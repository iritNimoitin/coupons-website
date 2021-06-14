import "./Customers.css";
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CompanyModel from "../../../Models/CompanyModel";
import store from "../../../Redux/Stores";
import globals from "../../../Services/Globals";
import notify from "../../../Services/Notification";
import { CompaniesDownloadedAction, CustomersDownloadedAction } from "../../../Redux/AdminState";
import jwtAxios from "../../../Services/jwtAxios";
import { Button, Typography } from "@material-ui/core";
import { AddBox } from "@material-ui/icons";
import { useHistory } from "react-router";
import adminService from "../../../Services/AdminService";
import CustomerModel from "../../../Models/CustomerModel";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function Customers(): JSX.Element {

    const [customers, setCustomers] = React.useState<CustomerModel[]>([]);
    const history = useHistory();

    useEffect(() => {
        getCustomers();
        store.subscribe(() => {
            if (store.getState().AdminState.customers.length !== customers.length) {
                setCustomers(store.getState().AdminState.customers);
            }
        });
    }, []);

    const getCustomers = () => {
        const temp = store.getState().AdminState.customers;
        if (temp.length === 0) {
            getCustomersFromServer();
        } else {
            setCustomers(temp);
        }
    }

    const getCustomersFromServer = async () => {
        try {
            let url = globals.urls.admin.customers;
            const response = await jwtAxios.get(url);
            setCustomers(response.data);
            store.dispatch(CustomersDownloadedAction(response.data));
        } catch (err) {
            notify.error(err);
        }
    }

    const handleUpdate = (customerId: number) => {
        let path = `/admin/customers/update/${customerId}`;
        history.push(path);
    }

    const handleDelete = (customerId: number) => {
        adminService.deleteCustomer(customerId);
    }

    const handleAddCustomer = () => {
        let path = "/admin/addCustomer";
        history.push(path);
    }

    const classes = useStyles();
    return (
        <div className="Customers">
            <Typography variant="h2" component="h2" gutterBottom>
                Customers
            </Typography>
            <Button className="addCustomer" variant="contained" color="primary" size="small" onClick={handleAddCustomer}>
                <AddBox />&nbsp;Add Customer
            </Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Password</TableCell>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell component="th" scope="row">
                                    {customer.id}
                                </TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.firstName}</TableCell>
                                <TableCell>{customer.lastName}</TableCell>
                                <TableCell>{customer.password}</TableCell>
                                <TableCell align="left">
                                    <Button variant="contained" color="primary" size="small" onClick={() => handleUpdate(customer.id)}>
                                        Update
                                    </Button>
                                </TableCell>
                                <TableCell align="left">
                                    <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(customer.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Customers;