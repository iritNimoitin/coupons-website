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
  const { register, handleSubmit } = useForm<CouponModel>();
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
    const imagesSelect: boolean[] = [];
    for (let i = 0; i < coupon.imagesSrc.length; i++) {
      imagesSelect[i] = false;
    }
    setValues({
      coupon: coupon,
      couponExist: true,
      imagesSelect: imagesSelect
    });
  }, []);

  const classes = useStyles();
  const history = useHistory();

  async function send(coupon: CouponModel) {
    try {
      const fromData = new FormData();
      fromData.append("id", values.coupon.id.toString());
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
      console.log(fromData.get("images"));
      const imagesToDelete: string[] = [];
      values.imagesSelect.forEach((element: boolean, index: number) => {
        if (element === true) {
          imagesToDelete.push(values.coupon.imagesNames[index]);
        }
      });
      const headers = {
        imagesToDelete: imagesToDelete
      };

      let url = globals.urls.company.coupons

      const response = await jwtAxios.put(url, fromData, { headers });
      // store.dispatch(registerAction(());
      notify.success("you have been successfully registered!");
      history.push("/home"); //redirect to home on success
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
    console.log(event.target.files);
    setImagesUploaded(event.target.files);
  };

  return (
    <div className="UpdateCoupon">
      {values.couponExist &&
        <Box component="span" m={1}>
          <form onSubmit={handleSubmit(send)}>

            <Typography variant="h4" className="Headline"><PersonAddIcon />Update coupon</Typography>
            <br />

            <TextField defaultValue={values.coupon.title} label="Title" variant="outlined" type="text" name="title" inputRef={register()} className={clsx(classes.margin, classes.textField)} />
            <br />

            <TextField defaultValue={values.coupon.description} label="Description" variant="outlined" type="text" name="description" multiline rows={4} inputRef={register()} className={clsx(classes.margin, classes.textField)} />
            <br />

            <TextField defaultValue={values.coupon.startDate} label="Start Date" variant="outlined" type="Date" name="startDate" inputRef={register()} className={clsx(classes.margin, classes.textField)} />
            <br />

            <TextField defaultValue={values.coupon.endDate} label="End Date" variant="outlined" type="Date" name="endDate" inputRef={register()} className={clsx(classes.margin, classes.textField)} />
            <br />

            <TextField defaultValue={values.coupon.price} label="Price" variant="outlined" type="number" name="price" inputRef={register()} className={clsx(classes.margin, classes.textField)} />
            <br />

            <TextField defaultValue={values.coupon.amount} label="Amount" variant="outlined" type="number" name="amount" inputRef={register()} className={clsx(classes.margin, classes.textField)} />
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
            <br />
            <br />
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Choose images to delete</FormLabel>
              <br />
              <FormGroup row>
                {values.coupon.imagesSrc.map((imageSrc: string, index: number) =>
                  <>
                    <FormControlLabel
                      control={<Checkbox indeterminate checked={values.imagesSelect[index]} onChange={handleChangeDelete} value={index} />}
                      label={values.coupon.imagesNames[index]}
                    />
                    &nbsp;
                    <img src={imageSrc} width="150" height="150" />
                    &nbsp;&nbsp;&nbsp;
                  </>
                )}
              </FormGroup>
            </FormControl>
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