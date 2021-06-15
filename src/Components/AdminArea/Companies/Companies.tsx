import "./Companies.css";
import React, { useEffect } from 'react';
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
import { CompaniesDownloadedAction } from "../../../Redux/AdminState";
import jwtAxios from "../../../Services/jwtAxios";
import { Button, Typography } from "@material-ui/core";
import { AddBox } from "@material-ui/icons";
import { useHistory } from "react-router";
import adminService from "../../../Services/AdminService";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { couponsDownloadedAction } from "../../../Redux/CouponsState";
import axios from "axios";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function Companies(): JSX.Element {

    const [companies, setCompanies] = React.useState<CompanyModel[]>([]);
    const history = useHistory();

    useEffect(() => {
        getCompanies();
        if (store.getState().CouponsState.category.All.coupons.length === 0) {
            getCouponsFromServer();
        }
        store.subscribe(() => {
            if (store.getState().AdminState.companies.length !== companies.length) {
                setCompanies(store.getState().AdminState.companies);
            }
        });
    }, []);

    const getCompanies = () => {
        const temp = store.getState().AdminState.companies;
        if (temp.length === 0) {
            getCompaniesFromServer();
        } else {
            setCompanies(temp);
        }
    }

    const getCompaniesFromServer = async () => {
        try {
            let url = globals.urls.admin.companies;
            const response = await jwtAxios.get(url);
            setCompanies(response.data);
            store.dispatch(CompaniesDownloadedAction(response.data));
        } catch (err) {
            notify.error(err);
        }
    }

    const getCouponsFromServer = async () => {
        try {
            const headers = {
                'sortBy': 'id',
            }
            let url = globals.urls.coupons;
            const response = await axios.get(url, { headers });
            store.dispatch(couponsDownloadedAction(response.data, "All", Math.round(response.data.length / 8), response.data.length));
        } catch (err) {
            notify.error(err);
        }
    }

    const handleUpdate = (companyId: number) => {
        let path = `/admin/companies/update/${companyId}`;
        history.push(path);
    }

    const handleDelete = (companyId: number) => {
        adminService.deleteCompany(companyId);
    }

    const handleAddCompany = () => {
        let path = "/admin/addCompany";
        history.push(path);
    }

    function Row(props: { row: CompanyModel }) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        const classes = useStyles();

        return (
            <React.Fragment>
                <TableRow className={classes.root}>
                    <TableCell align="center" component="th" scope="row">
                        {row.id}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.password}</TableCell>
                    <TableCell align="center">
                        <Button variant="contained" color="primary" size="small" onClick={() => handleUpdate(row.id)}>
                            Update
                        </Button>
                    </TableCell>
                    <TableCell align="center">
                        <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(row.id)}>
                            Delete
                        </Button>
                    </TableCell>
                    <TableCell align="center">
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Coupons
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Id</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell align="center">Price</TableCell>
                                            <TableCell align="center">Amount</TableCell>
                                            <TableCell align="center">Start Date</TableCell>
                                            <TableCell align="center">End Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {store.getState().CouponsState.category.All.coupons.filter((coupon) => coupon.company.id === row.id).map((couponRow) => (
                                            <TableRow key={couponRow.id}>
                                                <TableCell align="center" component="th" scope="row">
                                                    {couponRow.id}
                                                </TableCell>
                                                <TableCell>{couponRow.title}</TableCell>
                                                <TableCell>{couponRow.category}</TableCell>
                                                <TableCell align="center">${couponRow.price}</TableCell>
                                                <TableCell align="center">{couponRow.amount}</TableCell>
                                                <TableCell align="center">{couponRow.startDate}</TableCell>
                                                <TableCell align="center">{couponRow.endDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    return (
        <div className="Companies">
            <Typography variant="h2" component="h2" gutterBottom>
                Companies
            </Typography>
            <Button className="addCompany" variant="contained" color="primary" size="small" onClick={handleAddCompany}>
                <AddBox />&nbsp;Add Company
            </Button>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Id</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Password</TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center">Coupons</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.map((company) => (
                            <Row key={company.id} row={company} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Companies;