import axios from "axios";
import { registerAction } from "../../../Redux/AuthState";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import React from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import PasswordStrengthBar from 'react-password-strength-bar';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import store from "../../../Redux/Stores";
import globals from "../../../Services/Globals";
import notify from "../../../Services/Notification";
import clsx from 'clsx';
import { Box, Button, FormControlLabel, TextField, Typography } from "@material-ui/core";
import { Send, Visibility, VisibilityOff } from "@material-ui/icons";
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import "./Register.css";
import CompanyModel from "../../../Models/CompanyModel";
import CustomerModel from "../../../Models/CustomerModel";
import getUserFromToken from "../../../Services/Utilities";

interface State {
    password: string;
    showPassword: boolean;
    clientType: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
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
            width: '25ch',
        },
    }),
);

function Register(): JSX.Element {
    const { register, handleSubmit, formState, errors } = useForm<CustomerModel | CompanyModel>({
        mode: "onChange"
    });

    const [values, setValues] = React.useState<State>({
        password: '',
        showPassword: false,
        clientType: "Customer"
    });

    const classes = useStyles();
    const history = useHistory();

    async function send(user: CustomerModel | CompanyModel) {
        try {
            let headers;
            let url = globals.urls.auth.register;
            if (values.clientType === "Customer") {
                url = url + "customer/";
                headers = {
                    'email': (user as CustomerModel).email,
                    'password': (user as CustomerModel).password,
                    'firstName': (user as CustomerModel).firstName,
                    'lastName': (user as CustomerModel).lastName
                }
            } else {
                url = url + "company/";
                headers = {
                    'email': (user as CompanyModel).email,
                    'password': (user as CompanyModel).password,
                    'name': (user as CompanyModel).name
                }
            }
            const response = await axios.post(url, null, { headers });
            const client = getUserFromToken(response.data, values.clientType);
            store.dispatch(registerAction((client as CustomerModel | CompanyModel), values.clientType));
            notify.success("you have been successfully registered!");
            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, password: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, clientType: (event.target as HTMLInputElement).value });
    };

    return (
        <div className="Register Box">
            <Box component="span" m={1}>
                <form onSubmit={handleSubmit(send)}>

                    <Typography variant="h4" className="Headline"><PersonAddIcon /> Create your account</Typography>
                    <br />

                    <TextField label="Email" variant="outlined" type="email" name="email" className={clsx(classes.margin, classes.textField)} inputRef={register({
                        required: { value: true, message: "Missing Email." },
                    })} />
                    <span className="error">{errors.email?.message}</span>
                    <br />

                    <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                        <TextField
                            name="password"
                            variant="outlined"
                            label="Password"
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            inputRef={register({
                                required: { value: true, message: "Missing Password." },
                                minLength: { value: 8, message: "Password must include at least 8 characters." }
                            })
                            }
                        />
                        <PasswordStrengthBar password={values.password} />
                    </FormControl>
                    <span className="error">{errors.password?.message}</span>
                    <br />

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Register as</FormLabel>
                        <RadioGroup aria-label="clientType" name="clientType" value={values.clientType} onChange={handleRadioChange}>
                            <FormControlLabel value="Customer" control={<Radio />} label="Customer" />
                            <FormControlLabel value="Company" control={<Radio />} label="Company" />
                        </RadioGroup>
                    </FormControl>

                    {values.clientType === 'Customer' &&
                        <>
                            <br />
                            <TextField label="First Name" variant="outlined" type="text" name="firstName" className={clsx(classes.margin, classes.textField)} inputRef={register({
                                required: { value: true, message: "Missing first name." }
                            })} />
                            <br />
                            <TextField label="Last Name" variant="outlined" type="text" name="lastName" className={clsx(classes.margin, classes.textField)} inputRef={register({
                                required: { value: true, message: "Missing last name." }
                            })} />
                        </>
                    }
                    {values.clientType === 'Company' &&
                        <>
                            <br />
                            <TextField label="Company Name" variant="outlined" type="text" name="name" className={clsx(classes.margin, classes.textField)} inputRef={register({
                                required: { value: true, message: "Missing company name." }
                            })} />
                        </>
                    }

                    <Button type="submit" color="primary" variant="contained" className="button-login" startIcon={<Send />} disabled={!formState.isValid} fullWidth>Create account</Button>

                </form>
            </Box>


        </div>
    );
}

export default Register;
