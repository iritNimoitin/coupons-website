import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        textTransform: 'capitalize',
        color: 'white',
    },
});

function AdminMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const classes = useStyles();

    return (
        <div className="AdminMenu">
            <Button className={classes.root} aria-controls="op-menu" aria-haspopup="true" onClick={handleClick}>
                Menu
            </Button>
            <Menu
                id="op-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <nav>
                    <NavLink to="/admin/companies" exact>
                        <MenuItem onClick={handleClose}>companies</MenuItem>
                    </NavLink>
                    <NavLink to="/admin/customers" exact>
                        <MenuItem onClick={handleClose}>customers</MenuItem>
                    </NavLink>
                </nav>
            </Menu>
        </div>
    );
}

export default AdminMenu;