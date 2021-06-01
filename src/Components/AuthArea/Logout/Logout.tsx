import "./Logout.css";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { logoutAction } from "../../../Redux/AuthState";
import store from "../../../Redux/Stores";
import notify from "../../../Services/Notification";


function Logout(): JSX.Element {
    const history = useHistory();
    useEffect(() => {
        store.dispatch(logoutAction());
        notify.success("You are now logged out.");
        history.push("/home");

    });
    return null;
}

export default Logout;
