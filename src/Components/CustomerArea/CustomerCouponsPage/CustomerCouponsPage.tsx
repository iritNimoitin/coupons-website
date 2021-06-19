import React from "react";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import store from "../../../Redux/Stores";
import { useHistory } from "react-router";
import { TextField } from "@material-ui/core";
import CustomerCoupons from "../CustomerCoupons/CustomerCoupons";
import { ChangeCustomerCouponsCategoryAction, ChangeCustomerMaxPriceAction } from "../../../Redux/SharedState";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);


function CustomerCouponsPage(): JSX.Element {
    const [category, setCategory] = React.useState<string>("All");
    const classes = useStyles();
    const history = useHistory();

    const handleChangeCategory = (event: React.ChangeEvent<{ value: unknown }>) => {
        store.dispatch(ChangeCustomerCouponsCategoryAction(event.target.value as string));
        setCategory(event.target.value as string);
    };

    const handleChangeMaxPrice = (event: React.ChangeEvent<{ value: unknown }>) => {
        store.dispatch(ChangeCustomerMaxPriceAction(event.target.value as number));
    }

    return (
        <div className="CustomerCouponsPage">
            <FormControl className={classes.formControl}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={category}
                    onChange={handleChangeCategory}
                >
                    <MenuItem value="All">
                        <em>All</em>
                    </MenuItem>
                    <MenuItem value={"Electricity"}>Electricity</MenuItem>
                    <MenuItem value={"Spa"}>Spa</MenuItem>
                    <MenuItem value={"Restaurant"}>Restaurant</MenuItem>
                    <MenuItem value={"Vacation"}>Vacation</MenuItem>
                    <MenuItem value={"Attractions"}>Attractions</MenuItem>
                    <MenuItem value={"Furniture"}>Furniture</MenuItem>
                    <MenuItem value={"Sport"}>Sport</MenuItem>
                </Select>
                <FormHelperText>Please choose a category</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
                <TextField label="Max Price" variant="standard" type="number" name="maxPrice" onChange={handleChangeMaxPrice} />
            </FormControl>
            <br />
            <CustomerCoupons />
        </div>
    );
}

export default CustomerCouponsPage;
