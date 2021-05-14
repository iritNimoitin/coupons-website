import axios from "axios";
import React from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CredentialModel from "../../../Models/CredentialModel";
import Select from '@material-ui/core/Select';
import UserModel from "../../../Models/UserModel";
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
import LockOpenIcon from '@material-ui/icons/LockOpen';
import "./Login.css";
import jwtAxios from "../../../Services/jwtAxios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import CustomerModel from "../../../Models/CustomerModel";
import CompanyModel from "../../../Models/CompanyModel";
import AdminModel from "../../../Models/AdminModel";
import userEvent from "@testing-library/user-event";
import Utilities from "../../../Services/Utilities";
import getUserFromToken from "../../../Services/Utilities";

interface State {
    password: string;
    showPassword: boolean;
    clientType: "Company" | "Customer" | "Admin";
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


function Login(): JSX.Element {
    const history = useHistory(); // Redirect function
    const {register, handleSubmit, formState } = useForm<CredentialModel>({
        mode: "onChange"
    });

    const [values, setValues] = React.useState<State>({
        password: '',
        showPassword: false,
        clientType: "Customer"
      });
    const classes = useStyles();

    async function send(credentials: CredentialModel) {
        try {
          const headers = {
            'email': credentials.email,
            'password': credentials.password,
            'clientType': credentials.clientType,
          }
          const response = await jwtAxios.post(globals.urls.auth.login, null, {headers});

          const client = getUserFromToken(response.data, credentials.clientType);
          store.dispatch(loginAction(client));
          notify.success("You have been successfully logged in!");
          history.push("/home"); // Redirect to home on success
        }
        catch(err) {
          notify.error(err);
        }
    }

    const handleChangeType = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      const name = event.target.name as keyof typeof values;
      setValues({
        ...values,
        [name]: event.target.value,
      });
    };

    const handleChange = (event: any) => {
      //setValues({ ...values, [prop]: event.target.value });
      setValues({ ...values, password: event.target.value });
    };

    const handleClickShowPassword = () => {
      setValues({ ...values, showPassword: !values.showPassword });
    };
    
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    return (
        <div className="Login Box">

            <Box component="span" m={1}>
                <form onSubmit={handleSubmit(send)}>

                    <Typography variant="h4" className="Headline"><LockOpenIcon /> Login</Typography>
                    <br />

                    <TextField label="Email" variant="outlined" type="email" name="email" className={clsx(classes.margin, classes.textField)} inputRef={register({
                        required: { value: true, message: "Missing Email." },

                    })}/>
                    <br />

                    {/* <TextField label="password" variant="outlined" className="TextBox" ref={register}/> */}
                    {/* <FormControl className={clsx(classes.margin, classes.textField)}  variant="outlined">  */}
                        <TextField
                            name="password"
                            variant="outlined"
                            label="Password"
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange}
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
                                required: { value: true, message: "Missing Password." }
                            })}
                        />
                    {/* </FormControl> */}
                    <br />

                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel htmlFor="outlined-clientType-native-simple">Connect as</InputLabel>
                      <Select
                        native
                        value={values.clientType}
                        name="clientType"
                        onChange={handleChangeType}
                        label="Connect as"
                        inputProps={{
                          name: 'clientType',
                          id: 'outlined-clientType-native-simple',
                        }}
                        inputRef={register({
                          required: { value: true, message: "Missing Email." },
  
                      })}
                      >
                        <option value="Customer">Customer</option>
                        <option value="Company">Company</option>
                        <option value="Administrator">Admin</option>
                      </Select>
                    </FormControl>

                    <Button type="submit" color="primary" variant="contained" className="button-login" startIcon={<Send/>} disabled={!formState.isValid} fullWidth>Sign in</Button>

                </form>
            </Box>
        </div>
    );
}

export default Login;
