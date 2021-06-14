import "./UpdateCompany.css";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import store from "../../../Redux/Stores";
import globals from "../../../Services/Globals";
import notify from "../../../Services/Notification";
import clsx from 'clsx';
import { Box, Button, TextField, Typography } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import CompanyModel from "../../../Models/CompanyModel";
import { RouteComponentProps } from "react-router";
import jwtAxios from "../../../Services/jwtAxios";
import { CompanyUpdatedAction } from "../../../Redux/AdminState";

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
    id: string;
}

interface UpdateCompanyProps extends RouteComponentProps<RouteParam> {

}

function UpdateCompany(props: UpdateCompanyProps): JSX.Element {
    const { register, handleSubmit, errors } = useForm<CompanyModel>();
    const [values, setValues] = React.useState({
        company: null,
        companyExist: false
    });

    useEffect(() => {
        const id = parseInt(props.match.params.id);
        setValues({
            company: store.getState().AdminState.companies.find(company => company.id === id),
            companyExist: true
        });
    }, []);

    const classes = useStyles();
    const history = useHistory();

    async function send(company: CompanyModel) {
        try {

            const companyU = {
                ...company,
                id: values.company.id,
                name: values.company.name,
                coupons: values.company.coupons
            }
            let url = globals.urls.admin.companies;
            const response = await jwtAxios.put(url, companyU);

            store.dispatch(CompanyUpdatedAction(companyU));

            notify.success("you have been successfully updating the company!");
            history.push("/admin/companies");
        }
        catch (err) {
            notify.error(err);
        }
    }


    return (
        <div className="UpdateCompany">
            {values.companyExist &&
                <Box component="span" m={1}>
                    <form onSubmit={handleSubmit(send)}>

                        <Typography variant="h4" className="Headline"><PersonAddIcon />Update company</Typography>
                        <br />
                        <Typography variant="h6" className="Headline">{values.company.name}</Typography>
                        <br />

                        <TextField defaultValue={values.company.email} label="Email" variant="outlined" type="email" name="email" inputRef={register({
                            required: { value: true, message: "Missing Email." }
                        })} className={clsx(classes.margin, classes.textField)} />
                        <span className="error">{errors.email?.message}</span>
                        <br />

                        <TextField defaultValue={values.company.password} label="Password" variant="outlined" type="password" name="password" inputRef={register({
                            required: { value: true, message: "Missing Password." },
                            minLength: { value: 8, message: "Password must include at least 8 characters." }
                        })} className={clsx(classes.margin, classes.textField)} />
                        <span className="error">{errors.password?.message}</span>
                        <br />

                        <Button type="submit" color="primary" variant="contained" className="button-login" startIcon={<Send />} >Update</Button>
                        <br />
                        <br />
                    </form>
                    <br />
                </Box>
            }

        </div>
    );
}

export default UpdateCompany;
