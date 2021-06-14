import "./Companies.css";
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
import { CompaniesDownloadedAction } from "../../../Redux/AdminState";
import jwtAxios from "../../../Services/jwtAxios";
import { Button, Typography } from "@material-ui/core";
import { AddBox } from "@material-ui/icons";
import { useHistory } from "react-router";
import adminService from "../../../Services/AdminService";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function Companies(): JSX.Element {

    const [companies, setCompanies] = React.useState<CompanyModel[]>([]);
    const history = useHistory();

    useEffect(() => {
        getCompanies();
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

    const classes = useStyles();
    return (
        <div className="Companies">
            <Typography variant="h2" component="h2" gutterBottom>
                Companies
            </Typography>
            <Button className="addCompany" variant="contained" color="primary" size="small" onClick={handleAddCompany}>
                <AddBox />&nbsp;Add Company
            </Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Password</TableCell>
                            <TableCell align="left"></TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.map((company) => (
                            <TableRow key={company.id}>
                                <TableCell component="th" scope="row">
                                    {company.id}
                                </TableCell>
                                <TableCell>{company.email}</TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.password}</TableCell>
                                <TableCell align="left">
                                    <Button variant="contained" color="primary" size="small" onClick={() => handleUpdate(company.id)}>
                                        Update
                                    </Button>
                                </TableCell>
                                <TableCell align="left">
                                    <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(company.id)}>
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

export default Companies;