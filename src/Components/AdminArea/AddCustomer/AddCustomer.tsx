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
import jwtAxios from "../../../Services/jwtAxios";
import { CustomerAddedAction } from "../../../Redux/AdminState";
import CustomerModel from "../../../Models/CustomerModel";

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

function AddCustomer(props: {}): JSX.Element {
    const { register, handleSubmit, errors } = useForm<CustomerModel>();

    const classes = useStyles();
    const history = useHistory();

    async function send(customer: CustomerModel) {
        try {

            let url = globals.urls.admin.customers;
            const response = await jwtAxios.post(url, customer);
            customer.id = response.data;
            store.dispatch(CustomerAddedAction(customer));

            notify.success("you have been successfully adding the customer!");
            history.push("/admin/customers");
        }
        catch (err) {
            notify.error(err);
        }
    }


    return (
        <div className="AddCustomer">
            <Box component="span" m={1}>
                <form onSubmit={handleSubmit(send)}>

                    <Typography variant="h4" className="Headline"><PersonAddIcon />Add customer</Typography>
                    <br />

                    <TextField label="First Name" variant="outlined" type="text" name="firstName" inputRef={register({
                        required: { value: true, message: "Missing First Name." },
                        minLength: { value: 3, message: "First Name is too short." },
                        maxLength: { value: 30, message: "First Name is too long." }
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.firstName?.message}</span>
                    <br />

                    <TextField label="Last Name" variant="outlined" type="text" name="lastName" inputRef={register({
                        required: { value: true, message: "Missing Last Name." },
                        minLength: { value: 3, message: "Last Name is too short." },
                        maxLength: { value: 30, message: "Last Name is too long." },
                    })} className={clsx(classes.margin, classes.textField)} />
                    <span className="error">{errors.lastName?.message}</span>
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

export default AddCustomer;
