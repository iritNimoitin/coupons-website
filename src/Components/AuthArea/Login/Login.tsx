import axios from "axios";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import CredentialModel from "../../../Models/CredentialModel";
import UserModel from "../../../Models/UserModel";
import { loginAction } from "../../../Redux/AuthState";
import store from "../../../Redux/Stores";
import globals from "../../../Services/Globals";
import notify from "../../../Services/Notification";
import { Button, ButtonGroup, Checkbox, FormControlLabel, TextField, Typography } from "@material-ui/core";
import { MailOutline,Send,Cancel } from "@material-ui/icons";
import "./Login.css";

function Login(): JSX.Element {
    const history = useHistory(); // Redirect function
    const {register, handleSubmit } = useForm<CredentialModel>();

    async function send(credentials: CredentialModel) {
        try {
            const response = await axios.post<UserModel>(globals.urls.login, credentials);
            store.dispatch(loginAction(response.data));
            notify.success("You have been successfully logged in!");
            history.push("/home"); // Redirect to home on success
        }
        catch(err) {
            notify.error(err);
        }
    }

    return (
        <div className="Login Box">

            <h2>Login</h2>

            <form onSubmit={handleSubmit(send)}>

			    {/* <label>Username: </label> <br />
                <input type="text" name="username" ref={register} /> <br /> <br />

			    <label>Password: </label> <br />
                <input type="password" name="password" ref={register} /> <br /> <br />

                <button>Login</button> */}

                <Typography variant="h3" className="Headline"> <MailOutline />Contact Us</Typography>

           <TextField label="Name" variant="outlined" className="TextBox"/>
            <br />

            <TextField label="email" variant="outlined" type="email" className="TextBox"/>
            <br />

            <TextField label="Massage" variant="outlined" className="TextBox"/>
            <br />
            
            <FormControlLabel label="Send me promotional emails:" control={<Checkbox/>}/>
            <br />
        
            <ButtonGroup variant="contained" fullWidth>
           <Button color="primary" startIcon={<Send/>}>send</Button>
           <Button color="secondary" startIcon ={<Cancel/>}>cancel</Button>
            </ButtonGroup>

            </form>
        </div>
    );
}

export default Login;
