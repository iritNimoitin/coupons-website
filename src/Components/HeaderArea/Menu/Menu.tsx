import "./Menu.css";
import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem'; 
import CategoryIcon from '@material-ui/icons/Category';
import { NavLink } from "react-router-dom";

function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategory = () => {

  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}><CategoryIcon/>
        Categories
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <nav>
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