import "./UpdateCoupon.css";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from "react-router-dom";
import Select from '@material-ui/core/Select';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import store, { getCategory, getUserCategory } from "../../../Redux/Stores";
import globals from "../../../Services/Globals";
import notify from "../../../Services/Notification";
import clsx from 'clsx';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormLabel from '@material-ui/core/FormLabel';
import CompanyModel from "../../../Models/CompanyModel";
import CouponModel from "../../../Models/CouponModel";
import { RouteComponentProps } from "react-router";
import jwtAxios from "../../../Services/jwtAxios";
import { couponUpdatedAction } from "../../../Redux/CouponsState";
import { logoutAction, userCouponUpdatedAction } from "../../../Redux/AuthState";
import axios from "axios";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 1000,
    },
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '40ch',
    },
    category: {
      minWidth: 300
    }
  }),
);

interface RouteParam {
  category: string;
  id: string;
}

interface UpdateCouponProps extends RouteComponentProps<RouteParam> {

}

function UpdateCoupon(props: UpdateCouponProps): JSX.Element {
  const { register, handleSubmit, errors } = useForm<CouponModel>();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [values, setValues] = React.useState({
    coupon: null,
    couponExist: false,
    imagesSelect: null
  });
  const [imagesUploaded, setImagesUploaded] = React.useState<FileList>();
  const [category, setCategory] = React.useState(props.match.params.category);

  useEffect(() => {
    const category = props.match.params.category;
    const id = parseInt(props.match.params.id);
    let coupon = getCategory("All").coupons.find(coupon => coupon.id === id);
    if (coupon === undefined) {
      coupon = getCategory(category).coupons.find(coupon => coupon.id === id);
      if (coupon === undefined) {
        const user = store.getState().AuthState.user;
        coupon = getUserCategory("All", (user as CompanyModel)).find(coupon => coupon.id === id);
        if (coupon === undefined) {
          coupon = getUserCategory(category, (user as CompanyModel)).find(coupon => coupon.id === id);
        }
      }
    }
    if (coupon !== undefined) {
      const imagesSelect: boolean[] = [];
      if (coupon.imagesNames) {
        for (let i = 0; i < coupon.imagesNames.length; i++) {
          imagesSelect[i] = false;
        }
      }
      setValues({
        coupon: coupon,
        couponExist: true,
        imagesSelect: imagesSelect
      });
      setStartDate(new Date(coupon.startDate));
      setEndDate(new Date(coupon.endDate));
    } else {
      getCouponFromServer();
    }

  }, []);

  const classes = useStyles();
  const history = useHistory();

  const getCouponFromServer = async () => {
    try {
      const id = +props.match.params.id;
      const headers = {
        'Id': id
      }
      let url = globals.urls.coupon;
      const response = await axios.get(url, { headers });
      const imagesSelect: boolean[] = [];
      if (response.data.imagesNames) {
        for (let i = 0; i < response.data.imagesNames.length; i++) {
          imagesSelect[i] = false;
        }
      }
      setValues({
        coupon: response.data,
        couponExist: true,
        imagesSelect: imagesSelect
      });
      setStartDate(new Date(response.data.startDate));
      setEndDate(new Date(response.data.endDate));
    } catch (err) {
      notify.error(err);
    }
  }

  async function send(coupon: CouponModel) {
    try {
      const fromData = new FormData();
      fromData.append("id", values.coupon.id.toString());
      fromData.append("idC", values.coupon.company.id.toString());
      fromData.append("title", coupon.title);
      fromData.append("description", coupon.description);
      fromData.append("startDate", coupon.startDate.toString());
      fromData.append("endDate", coupon.endDate.toString());
      fromData.append("price", coupon.price.toString());
      fromData.append("amount", coupon.amount.toString());
      fromData.append("category", category);
      for (let i = 0; i < coupon.imagesFiles.length; i++) {
        fromData.append("images", coupon.imagesFiles.item(i));
      }
      let url = globals.urls.company.coupons;
      if (coupon.imagesFiles.length > 0) {
        url = url + "images/";
      }

      const imagesNames: string[] = [];
      const imagesToDelete: string[] = [];
      values.imagesSelect.forEach((element: boolean, index: number) => {
        if (element === true) {
          imagesToDelete.push(values.coupon.imagesNames[index]);
        } else {
          imagesNames.push(values.coupon.imagesNames[index]);
        }
      });
      const headers = {
        imagesToDelete: imagesToDelete
      };

      const response = await jwtAxios.put(url, fromData, { headers });

      for (let i = 0; i < coupon.imagesFiles.length; i++) {
        imagesNames.push(coupon.imagesFiles.item(i).name);
      }

      const couponU: CouponModel = {
        id: values.coupon.id,
        company: values.coupon.company,
        title: coupon.title,
        companyId: values.coupon.company.id,
        category: category,
        description: coupon.description,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        amount: coupon.amount,
        price: coupon.price,
        imagesNames: imagesNames,
        imagesFiles: null,
        customers: null
      }
      const user = store.getState().AuthState.user;
      if (getCategory("All").coupons.find(coupon => coupon.id === couponU.id)) {
        store.dispatch(couponUpdatedAction(couponU, "All"));
      }
      if (getCategory(category).coupons.find(coupon => coupon.id === couponU.id)) {
        store.dispatch(couponUpdatedAction(couponU, category));
      }
      if (getUserCategory("All", (user as CompanyModel)).find(coupon => coupon.id === couponU.id)) {
        store.dispatch(userCouponUpdatedAction(couponU, "All"));
      }
      if (getUserCategory(category, (user as CompanyModel)).find(coupon => coupon.id === couponU.id)) {
        store.dispatch(userCouponUpdatedAction(couponU, category));
      }

      notify.success("you have been successfully updating the coupon!");
      history.push("/company/coupons");
    }
    catch (err) {
      notify.error(err);
    }
  }

  const handleChangeCategory = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategory((event.target.value as string));
  };

  const handleChangeDelete = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chooseIndex = parseInt((event.target as HTMLInputElement).value);
    const newImagesSelect = values.imagesSelect.map((bool: boolean, index: number) => index === chooseIndex ? !bool : bool);
    setValues({ ...values, imagesSelect: newImagesSelect });
  };

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImagesUploaded(event.target.files);
  };

  return (
    <div className="UpdateCoupon">
      {values.couponExist &&
        <Box component="span" m={1}>
          <form onSubmit={handleSubmit(send)}>
            <div className="FieldContainer">
              <Typography variant="h4" className="Headline"><PersonAddIcon />Update coupon</Typography>
              <br />

              <TextField defaultValue={values.coupon.title} label="Title" variant="outlined" type="text" name="title" className={clsx(classes.margin, classes.textField)} inputRef={register({
                required: { value: true, message: "Missing Title." },
                minLength: { value: 3, message: "Title is too short" },
                maxLength: { value: 50, message: "Title is too long" }
              })} />
              <span className="error">{errors.title?.message}</span>
              <br />

              <TextField defaultValue={values.coupon.description} label="Description" variant="outlined" type="text" name="description" multiline rows={4} className={clsx(classes.margin, classes.textField)} inputRef={register({
                required: { value: true, message: "Missing Description." },
                minLength: { value: 50, message: "Description is too short." }
              })} />
              <span className="error"> {errors.description?.message}</span>
              <br />

              <TextField defaultValue={values.coupon.startDate} label="Start Date" variant="outlined" type="Date" name="startDate" onChange={(event) => setStartDate(new Date(event.target.value))} className={clsx(classes.margin, classes.textField)} inputRef={register({
                required: { value: true, message: "Missing Start Date." },
                min: { value: (new Date()).toString(), message: "Start Date is not valid." },
                max: { value: endDate.toString(), message: "Start Date can't be after end date." }
              })} />
              <span className="error">{errors.startDate?.message}</span>
              <br />

              <TextField defaultValue={values.coupon.endDate} label="End Date" variant="outlined" type="Date" name="endDate" onChange={(event) => setEndDate(new Date(event.target.value))} className={clsx(classes.margin, classes.textField)} inputRef={register({
                required: { value: true, message: "Missing End Date." },
                min: { value: startDate.toString(), message: "End Date can't be before start date." }
              })} />
              <span className="error">{errors.endDate?.message}</span>
              <br />

              <TextField defaultValue={values.coupon.price} label="Price" variant="outlined" type="number" name="price" className={clsx(classes.margin, classes.textField)} inputRef={register({
                required: { value: true, message: "Missing Price." },
                min: { value: 1, message: "Price have to be above 1." },
                max: { value: 100000, message: "Price have to be below 100000." }
              })} />
              <span className="error">{errors.price?.message}</span>
              <br />

              <TextField defaultValue={values.coupon.amount} label="Amount" variant="outlined" type="number" name="amount" className={clsx(classes.margin, classes.textField)} inputRef={register({
                required: { value: true, message: "Missing Amount." },
                min: { value: 1, message: "Amount have to be above 1." },
                max: { value: 100000, message: "Amount have to be below 100000." }
              })} />
              <span className="error">{errors.amount?.message}</span>
              <br />

              <FormControl className={classes.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  name="category"
                  onChange={handleChangeCategory}
                >
                  <MenuItem value={"Electricity"}>Electricity</MenuItem>
                  <MenuItem value={"Spa"}>Spa</MenuItem>
                  <MenuItem value={"Restaurant"}>Restaurant</MenuItem>
                  <MenuItem value={"Vacation"}>Vacation</MenuItem>
                  <MenuItem value={"Attractions"}>Attractions</MenuItem>
                  <MenuItem value={"Furniture"}>Furniture</MenuItem>
                </Select>
              </FormControl>
            </div>
            <br />
            <br />
            {values.coupon.imagesNames &&
              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Choose images to delete</FormLabel>
                <br />
                <FormGroup row>
                  {values.coupon.imagesNames.map((imageName: string, index: number) =>
                    <>
                      <FormControlLabel key={index}
                        control={<Checkbox indeterminate checked={values.imagesSelect[index]} onChange={handleChangeDelete} value={index} />}
                        label={values.coupon.imagesNames[index]}
                      />
                    &nbsp;
                    <img src={globals.urls.images + values.coupon.category + "/" + values.coupon.id + "/" + values.coupon.imagesNames[index]} width="150" height="150" />
                    &nbsp;&nbsp;&nbsp;
                  </>
                  )}
                </FormGroup>
              </FormControl>
            }
            <br />
            <br />
            <Button variant="contained" component="label">
              Upload images
              <input type="file" name="imagesFiles" onChange={handleUploadChange} accept="image/*" ref={register()} multiple hidden />
            </Button>
            <br />
            <br />
            <Button type="submit" color="primary" variant="contained" className="button-login" startIcon={<Send />} >Update</Button>
            <br />
            <br />
          </form>
          <br />
          {imagesUploaded &&
            Array.from(imagesUploaded).forEach(image => {
              <>
                &nbsp;
                <img src={URL.createObjectURL(image)} width="150" height="150" />
                &nbsp;&nbsp;&nbsp;
              </>
            })
          }
        </Box>
      }

    </div>
  );
}

export default UpdateCoupon;