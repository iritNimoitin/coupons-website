import "./AddCompany.css";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
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
import jwtAxios from "../../../Services/jwtAxios";
import { CompanyAddedAction } from "../../../Redux/AdminState";

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

function AddCompany(props: {}): JSX.Element {
    const { register, handleSubmit, errors } = useForm<CompanyModel>();

    const classes = useStyles();
    const history = useHistory();

    async function send(company: CompanyModel) {
        try {

            let url = globals.urls.admin.companies;
            const response = await jwtAxios.post(url, company);
            company.id = response.data;
            store.dispatch(CompanyAddedAction(company));

            notify.success("you have been successfully adding the company!");
            history.push("/admin/companies");
        }
        catch (err) {
            notify.error(err);
        }
    }


    return (
        <div className="AddCompany">
            <Box component="span" m={1}>
                <form onSubmit={handleSubmit(send)}>

                    <Typography variant="h4" className="Headline"><PersonAddIcon />Add company</Typography>
                    <br />

                    <TextField label="Name" variant="outlined" type="text" name="name" inputRef={register({
                        required: { value: true, message: "Missing Name." },
                        minLength: { value: 3, message: "Company Name is too short." },
                        maxLength: { value: 30, message: "Company Name is too long." },
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.name?.message}</span>
                    <br />

                    <TextField label="Email" variant="outlined" type="email" name="email" inputRef={register({
                        required: { value: true, message: "Missing Email." }
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.email?.message}</span>
                    <br />

                    <TextField label="Password" variant="outlined" type="password" name="password" inputRef={register({
                        required: { value: true, message: "Missing Password." },
                        minLength: { value: 8, message: "Password must include at least 8 characters." }
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.password?.message}</span>
                    <br />

                    <Button type="submit" color="primary" variant="contained" className="button-login" startIcon={<Send />} >Add</Button>
                    <br />
                    <br />
                </form>
                <br />
            </Box>
        </div>
    );
}

export default AddCompany;
