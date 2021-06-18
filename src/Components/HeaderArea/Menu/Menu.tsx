import "./Menu.css";
import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import { NavLink } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    // border: 0,
    // borderRadius: 3,
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    // height: 48,
    // padding: '0 30px',
  },
});

function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();

  return (
    <div>
      <Button className={classes.root} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}><MenuRoundedIcon />
        &nbsp;Categories
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <nav>
          <NavLink to="/coupons/All" exact>
            <MenuItem onClick={handleClose}>All</MenuItem>
          </NavLink>
          <NavLink to="/coupons/Electricity" exact>
            <MenuItem onClick={handleClose}>Electricity</MenuItem>
          </NavLink>
          <NavLink to="/coupons/Spa" exact>
            <MenuItem onClick={handleClose}>Spa</MenuItem>
          </NavLink>
          <NavLink to="/coupons/Restaurant" exact>
            <MenuItem onClick={handleClose}>Restaurant</MenuItem>
          </NavLink>
          <NavLink to="/coupons/Vacation" exact>
            <MenuItem onClick={handleClose}>Vacation</MenuItem>
          </NavLink>
          <NavLink to="/coupons/Attractions" exact>
            <MenuItem onClick={handleClose}>Attractions</MenuItem>
          </NavLink>
          <NavLink to="/coupons/Furniture" exact>
            <MenuItem onClick={handleClose}>Furniture</MenuItem>
          </NavLink>
        </nav>
      </Menu>
    </div>
  );
}

export default SimpleMenu;