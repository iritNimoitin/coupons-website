import axios from "axios";
import { registerAction } from "../../../Redux/AuthState";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import React from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CredentialModel from "../../../Models/CredentialModel";
import validator from 'validator';
import Select from '@material-ui/core/Select';
import PasswordStrengthBar from 'react-password-strength-bar';
import { loginAction } from "../../../Redux/AuthState";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import store from "../../../Redux/Stores";
import globals from "../../../Services/Globals";
import notify from "../../../Services/Notification";
import clsx from 'clsx';
import { Box, Button, ButtonGroup, Checkbox, FormControlLabel, TextField, Typography } from "@material-ui/core";
import { MailOutline,Send,Cancel, Visibility, VisibilityOff } from "@material-ui/icons";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import "./Register.css";
import CompanyModel from "../../../Models/CompanyModel";
import CustomerModel from "../../../Models/CustomerModel";

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
    const {register, handleSubmit, formState } = useForm<CustomerModel | CompanyModel>({
        mode: "onChange"
    });

    const [values, setValues] = React.useState<State>({
        password: '',
        showPassword: false,
        clientType: "Customer"
      });

    const classes = useStyles();
    const history = useHistory();//redirect function

    async function send(user: CustomerModel | CompanyModel ){
        try{
            let headers;
            let url = globals.urls.auth.register;
            if(values.clientType === "Customer"){
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
            console.log(user);
            console.log(headers);
            const response = await axios.post(url, {headers});
            console.log(response.data);
            store.dispatch(registerAction(response.data));
            notify.success("you have been successfully registered!");
            history.push("/home"); //redirect to home on success
        }
        catch(err){
            notify.error(err);
        }
    }

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
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
        <div className="Register">
            <Box component="span" m={1}>
                <form onSubmit={handleSubmit(send)}>

                    <Typography variant="h4" className="Headline"><PersonAddIcon /> Create your account</Typography>
                    <br />

                    <TextField label="Email" variant="outlined" type="email" name="email" className={clsx(classes.margin, classes.textField)} inputRef={register({
                        required: { value: true, message: "Missing Email." },

                    })}/>
                    <br />

                    <FormControl className={clsx(classes.margin, classes.textField)}  variant="outlined"> 
                        <TextField
                            name="password"
                            variant="outlined"
                            label="Password"
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            InputProps={{endAdornment: (
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
                            )}}
                            inputRef={register({
                                    required: { value: true, message: "Missing Password." },
                                    minLength: { value: 8, message: "Password must include at least 8 characters." }
                                })
                            }
                             // validate: { cc: value => (validator.isStrongPassword(value, {
                                //     minLength: 8, minLowercase: 1,
                                //     minUppercase: 1, minNumbers: 1, minSymbols: 1
                                //   })) ? null : null, message: "Missing Password."
                                // }
                        />
                        <PasswordStrengthBar password={values.password} />
                    </FormControl>
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
                            <br/>
                            <TextField label="First Name" variant="outlined" type="text" name="firstName" className={clsx(classes.margin, classes.textField)} inputRef={register({
                                required: { value: true, message: "Missing first name." }
                            })}/>
                            <br/>
                            <TextField label="Last Name" variant="outlined" type="text" name="lastName" className={clsx(classes.margin, classes.textField)} inputRef={register({
                                required: { value: true, message: "Missing last name." }
                            })}/>
                        </>
                    }
                    {values.clientType === 'Company' && 
                        <>
                            <br/>
                            <TextField label="Company Name" variant="outlined" type="text" name="name" className={clsx(classes.margin, classes.textField)} inputRef={register({
                                required: { value: true, message: "Missing company name." }
                            })}/>
                        </>
                    }

                    <Button type="submit" color="primary" variant="contained" className="button-login" startIcon={<Send/>} disabled={!formState.isValid} fullWidth>Create account</Button>

                </form>
            </Box>

			
        </div>
    );
}

export default Register;
