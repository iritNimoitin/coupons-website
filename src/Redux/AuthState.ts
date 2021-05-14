import AdminModel from "../Models/AdminModel";
import CompanyModel from "../Models/CompanyModel";
import CustomerModel from "../Models/CustomerModel";

export class AuthState{
    public user: CustomerModel | CompanyModel | AdminModel = null;
    public constructor (){
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if(storedUser){
            this.user = storedUser;
        }
    }
}
//--------------------------------------------------------
//Auth action types:
export enum AuthActionType {
    Register = "Register",
    Login = "Login",
    Logout = "Logout"
}
//---------------------------------------------------------
//Auth Action:
export interface AuthAction {
    type: AuthActionType;
    payload?: any;
}
//-------------------------------------------------------
//action creators 
export function registerAction(user: CustomerModel | CompanyModel): AuthAction{
    return { type: AuthActionType.Register, payload: user };
}
export function loginAction(user: CustomerModel | CompanyModel | AdminModel): AuthAction{
    return { type: AuthActionType.Login, payload: user };
}
export function logoutAction(): AuthAction{
    return { type: AuthActionType.Logout };
}
//----------------------------------------------------------
//Auth reducer :
export function AuthReducer(currentState: AuthState = new AuthState(), action: AuthAction): AuthState{
    const newState = {...currentState};//spread operator

    switch(action.type){
        case AuthActionType.Register://here the payload is the registered user send from server
        case AuthActionType.Login://here the payload is the logged in user send from the server
            newState.user = action.payload ;
            localStorage.setItem("user", JSON.stringify(newState.user)); //saving in the local storage - wont be deleted
            //sessionStorage.setItem("user" ,JSON.stringify(newState.user)); //saving in the session storage - will be deleted
            break;
        case AuthActionType.Logout: //here we don't have payload
            newState.user = null;
            localStorage.removeItem("user"); 
            break;

    }
    return newState;
}