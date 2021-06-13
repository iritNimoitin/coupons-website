import "./AddCoupon.css";
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
import { couponAddedAction } from "../../../Redux/CouponsState";
import { userCouponAddedAction } from "../../../Redux/AuthState";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 1000,
        },
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: "center"
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

function AddCoupon(props: {}): JSX.Element {
    const { register, handleSubmit, errors } = useForm<CouponModel>();
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [imagesUploaded, setImagesUploaded] = React.useState<FileList>();
    const [category, setCategory] = React.useState("");
    const classes = useStyles();
    const history = useHistory();

    async function send(coupon: CouponModel) {
        try {
            const user = (store.getState().AuthState.user as CompanyModel);
            const fromData = new FormData();
            fromData.append("idC", user.id.toString());
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

            const response = await jwtAxios.post(url, fromData);

            const imagesNames: string[] = [];
            for (let i = 0; i < coupon.imagesFiles.length; i++) {
                imagesNames.push(coupon.imagesFiles.item(i).name);
            }

            const couponA: CouponModel = {
                id: response.data,
                company: user,
                title: coupon.title,
                companyId: user.id,
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

            if (getCategory("All").coupons.length > 0) {
                store.dispatch(couponAddedAction(couponA, "All"));
            }
            if (getCategory(category).coupons.length > 0) {
                store.dispatch(couponAddedAction(couponA, category));
            }
            if (getUserCategory("All", user).length > 0) {
                store.dispatch(userCouponAddedAction(couponA, "All"));
            }
            if (getUserCategory(category, user).length > 0) {
                store.dispatch(userCouponAddedAction(couponA, category));
            }

            notify.success("you have been successfully adding the coupon!");
            history.push("/company/coupons");
        }
        catch (err) {
            notify.error(err);
        }
    }

    const handleChangeCategory = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCategory((event.target.value as string));
    };

    const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImagesUploaded(event.target.files);
    };

    return (
        <div className="AddCoupon">
            <Box component="span" m={1}>
                <form onSubmit={handleSubmit(send)}>

                    <Typography variant="h4" className="Headline"><PersonAddIcon />Add coupon</Typography>
                    <br />

                    <TextField label="Title" variant="outlined" type="text" name="title" inputRef={register({
                        required: { value: true, message: "Missing Title." },
                        minLength: { value: 3, message: "Title is too short" },
                        maxLength: { value: 50, message: "Title is too long" }
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.title?.message}</span>
                    <br />

                    <TextField label="Description" variant="outlined" type="text" name="description" multiline rows={4} inputRef={register({
                        required: { value: true, message: "Missing Description." },
                        minLength: { value: 50, message: "Description is too short." }
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.description?.message}</span>
                    <br />

                    <TextField defaultValue={new Date()} label="Start Date" variant="outlined" type="Date" name="startDate" onChange={(event) => setStartDate(new Date(event.target.value))} inputRef={register({
                        required: { value: true, message: "Missing Start Date." },
                        min: { value: (new Date()).toString(), message: "Start Date is not valid." },
                        max: { value: endDate.toString(), message: "Start Date can't be after end date." }
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.startDate?.message}</span>
                    <br />

                    <TextField defaultValue={new Date()} label="End Date" variant="outlined" type="Date" name="endDate" onChange={(event) => setEndDate(new Date(event.target.value))} inputRef={register({
                        required: { value: true, message: "Missing End Date." },
                        min: { value: startDate.toString(), message: "End Date can't be before start date." }
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.endDate?.message}</span>
                    <br />

                    <TextField defaultValue={1} label="Price" variant="outlined" type="number" name="price" inputRef={register({
                        required: { value: true, message: "Missing Price." },
                        min: { value: 1, message: "Price have to be above 1." },
                        max: { value: 100000, message: "Price have to be below 100000." }
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.price?.message}</span>
                    <br />

                    <TextField defaultValue={1} label="Amount" variant="outlined" type="number" name="amount" inputRef={register({
                        required: { value: true, message: "Missing Amount." },
                        min: { value: 1, message: "Amount have to be above 1." },
                        max: { value: 100000, message: "Amount have to be below 100000." }
                    })} className={clsx(classes.margin, classes.textField)} />
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
                    <br />
                    <br />

                    <Button variant="contained" component="label">
                        Upload images
              <input type="file" name="imagesFiles" onChange={handleUploadChange} accept="image/*" ref={register()} multiple hidden />
                    </Button>
                    <br />
                    <br />
                    <Button type="submit" color="primary" variant="contained" className="button-login" startIcon={<Send />} >Add</Button>
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

        </div>
    );
}

export default AddCoupon;
