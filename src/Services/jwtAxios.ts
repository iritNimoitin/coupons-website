import axios from "axios";
import store from '../Redux/Stores';

const jwtAxios = axios.create();
//request interceptors
jwtAxios.interceptors.request.use(request => {
    request.headers = {
        ...request.headers,
        //"authorization":"Bearer " + store.getState().AuthState.user?.token,//change key name
        "token": store.getState().AuthState.user?.token,//change key name
        "email": store.getState().AuthState.user?.email
    }
    return request;
});
export default jwtAxios;