import axios from "axios";
import store from '../Redux/Stores';

const jwtAxios = axios.create();
//request interceptors-מה אנחנו רוצים לבצע בכל שליחה לשרת
jwtAxios.interceptors.request.use(request => {
    request.headers ={...request.headers,
        "authorization":"Bearer " + store.getState().AuthState.user?.token//change key name
    }
    return request;
});
export default jwtAxios;