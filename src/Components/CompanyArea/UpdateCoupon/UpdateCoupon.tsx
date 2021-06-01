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
  const [category, setCategory] = React.useState(props.match.params.category);

  useEffect(() => {
    const category = props.match.params.category;
    const id = parseInt(props.match.params.id);
    let coupon = getCategory(category).coupons.find(coupon => coupon.id === id);
    if (coupon === undefined) {
      coupon = getCategory("").coupons.find(coupon => coupon.id === id);
      if (coupon === undefined) {
        const user = store.getState().AuthState.user;
        coupon = getUserCategory(category, (user as CompanyModel)).find(coupon => coupon.id === id);
      }
    }
    console.log(coupon.imagesNames);
    const imagesSelect: boolean[] = [];
    for (let i = 0; i < coupon.images.length; i++) {
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
      fromData.append("title", coupon.title);
      fromData.append("description", coupon.description);
      fromData.append("startDate", coupon.startDate.toString());
      fromData.append("endDate", coupon.endDate.toString());
      fromData.append("price", coupon.price.toString());
      fromData.append("amount", coupon.amount.toString());
      // coupon.imageToSend
      fromData.append("category", category);
      let url = globals.urls.auth.register;
      // if(values.clientType === "Customer"){
      //     url = url + "customer/";
      //     headers = {
      //         'email': (user as CustomerModel).email,
      //         'password': (user as CustomerModel).password,
      //         'firstName': (user as CustomerModel).firstName,
      //         'lastName': (user as CustomerModel).lastName
      //     }
      // } else {
      //     url = url + "company/";
      //     headers = {
      //         'email': (user as CompanyModel).email,
      //         'password': (user as CompanyModel).password,
      //         'name': (user as CompanyModel).name
      //     }
      // }
      // const response = await jwtAxios.post(url, null, { headers });
      // const client = getUserFromToken(response.data, values.clientType);
      // store.dispatch(registerAction((client as CustomerModel | CompanyModel), values.clientType));
      // notify.success("you have been successfully registered!");
      // history.push("/home"); //redirect to home on success
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
                {values.coupon.images.map((i: string, index: number) =>
                  <>
                    <FormControlLabel
                      control={<Checkbox indeterminate checked={values.imagesSelect[index]} onChange={handleChangeDelete} value={index} />}
                      label={values.coupon.imagesNames[i]}
                    />
                    &nbsp;
                    <img src={i} width="150" height="150" />
                    &nbsp;&nbsp;&nbsp;
                  </>
                )}
              </FormGroup>
            </FormControl>
            <br />
            <br />
            <Button variant="contained" component="label">
              Upload images
              <input type="file" name="imagesToSend" accept="image/*" ref={register()} multiple hidden />
            </Button>
            <br />
            <br />
            <Button type="submit" color="primary" variant="contained" className="button-login" startIcon={<Send />} >Update</Button>
            <br />
            <br />
          </form>
        </Box>
      }

    </div>
  );
}

export default UpdateCoupon;
