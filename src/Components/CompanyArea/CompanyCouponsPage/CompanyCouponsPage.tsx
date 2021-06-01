import React from "react";
import CompanyCoupons from "../CompanyCoupons/CompanyCoupons";
import "./CompanyCouponsPage.css";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import store from "../../../Redux/Stores";
import { ChangeCompanyCouponsCategoryAction } from "../../../Redux/SharedState";

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


function CompanyCouponsPage(): JSX.Element {
  const [category, setCategory] = React.useState<string>("All");
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    store.dispatch(ChangeCompanyCouponsCategoryAction(event.target.value as string));
    setCategory(event.target.value as string);
  };

  return (
    <div className="CompanyCouponsPage">
      <FormControl className={classes.formControl}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={handleChange}
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
        </Select>
        <FormHelperText>Please choose a category</FormHelperText>
      </FormControl>
      <br />
      <CompanyCoupons />
    </div>
  );
}

export default CompanyCouponsPage;
