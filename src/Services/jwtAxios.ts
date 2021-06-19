import axios from "axios";
import store from '../Redux/Stores';

const jwtAxios = axios.create();

jwtAxios.interceptors.request.use(request => {
    request.headers = {
        ...request.headers,
        "token": store.getState().AuthState.user?.token,
        "email": store.getState().AuthState.user?.email
    }
    return request;
});
export default jwtAxios;