import AdminModel from "../Models/AdminModel";
import CompanyModel from "../Models/CompanyModel";
import CouponModel from "../Models/CouponModel";
import CustomerModel from "../Models/CustomerModel";

export class AuthState {
    public user: CustomerModel | CompanyModel | AdminModel = null;
    public clientType: string = null;
    public constructor() {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedClientType = JSON.parse(localStorage.getItem("clientType"));
        if (storedUser) {
            this.user = storedUser;
        }
        if (storedClientType) {
            this.clientType = storedClientType;
        }
    }
}
//--------------------------------------------------------
//Auth action types:
export enum AuthActionType {
    Register = "Register",
    Login = "Login",
    Logout = "Logout",
    UserCouponsDownloaded = "UserCouponsDownloaded",
    UserCouponAdded = "UserCouponAdded",
    UserCouponUpdated = "UserCouponUpdated",
    UserCouponDeleted = "UserCouponDeleted"
}
//---------------------------------------------------------
//Auth Action:
export interface AuthAction {
    type: AuthActionType;
    payload?: any;
    clientType?: string;
    category?: string;
}
//-------------------------------------------------------
//action creators 
export function registerAction(user: CustomerModel | CompanyModel, clientType: string): AuthAction {
    return { type: AuthActionType.Register, payload: user, clientType: clientType };
}
export function loginAction(user: CustomerModel | CompanyModel | AdminModel, clientType: string): AuthAction {
    return { type: AuthActionType.Login, payload: user, clientType: clientType };
}
export function logoutAction(): AuthAction {
    return { type: AuthActionType.Logout };
}
export function userCouponsDownloadedAction(coupons: CouponModel[], category: string): AuthAction {
    return { type: AuthActionType.UserCouponsDownloaded, payload: coupons, category: category };
}
export function userCouponAddedAction(coupon: CouponModel): AuthAction {
    return { type: AuthActionType.UserCouponAdded, payload: coupon };
}
export function userCouponUpdatedAction(coupon: CouponModel): AuthAction {
    return { type: AuthActionType.UserCouponUpdated, payload: coupon };
}
export function userCouponDeletedAction(coupon: CouponModel): AuthAction {
    return { type: AuthActionType.UserCouponDeleted, payload: coupon };
}
//----------------------------------------------------------
//Auth reducer :
export function AuthReducer(currentState: AuthState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...currentState };

    switch (action.type) {
        case AuthActionType.Register:
        case AuthActionType.Login:
            newState.user = action.payload;
            newState.clientType = action.clientType;
            localStorage.setItem("user", JSON.stringify(newState.user)); //saving in the local storage - wont be deleted
            localStorage.setItem("clientType", JSON.stringify(newState.clientType));
            //sessionStorage.setItem("user" ,JSON.stringify(newState.user)); //saving in the session storage - will be deleted
            break;
        case AuthActionType.Logout:
            newState.user = null;
            newState.clientType = null;
            localStorage.removeItem("user");
            localStorage.removeItem("clientType");
            break;
        case AuthActionType.UserCouponsDownloaded:
            switchCategory(newState, action.category, action.payload, (source: CouponModel[], couponsDownloaded: CouponModel[]) => {
                return couponsDownloaded;
            });
            break;
        case AuthActionType.UserCouponAdded:
            // const categoryA = (action.payload as CouponModel).category
            // switchCategory(categoryA, newState).push(action.payload);//TODO: check if need to replace with concat
            // newState.coupons.All.push(action.payload);
            break;
        case AuthActionType.UserCouponUpdated:
            const categoryU = (action.payload as CouponModel).category
            switchCategory(newState, categoryU, action.payload, (source: CouponModel[], couponUpdated: CouponModel[]) => {
                const index = source.indexOf(couponUpdated[0]);
                source.splice(index, 1, couponUpdated[0]);
                return source;
            });
            switchCategory(newState, undefined, action.payload, (source: CouponModel[], couponUpdated: CouponModel[]) => {
                const index = source.indexOf(couponUpdated[0]);
                source.splice(index, 1, couponUpdated[0]);
                return source;
            });
            break;
        case AuthActionType.UserCouponDeleted:
            const categoryD = (action.payload as CouponModel).category
            switchCategory(newState, categoryD, action.payload, (source: CouponModel[], couponDeleted: CouponModel[]) => {
                const index = source.indexOf(couponDeleted[0]);
                source.splice(index, 1);
                return source;
            });
            switchCategory(newState, undefined, action.payload, (source: CouponModel[], couponDeleted: CouponModel[]) => {
                const index = source.indexOf(couponDeleted[0]);
                source.splice(index, 1);
                return source;
            });
            break;
    }
    return newState;
}

function switchCategory(state: AuthState, category: string, target: CouponModel[], fun: (source: CouponModel[], target: CouponModel[]) => CouponModel[]): void {
    switch (category) {
        case "Electricity":
            (state.user as CustomerModel | CompanyModel).coupons.Electricity =
                fun((state.user as CustomerModel | CompanyModel).coupons.Electricity, target);
            break;
        case "Spa":
            (state.user as CustomerModel | CompanyModel).coupons.Spa =
                fun((state.user as CustomerModel | CompanyModel).coupons.Spa, target);
            break;
        case "Restaurant":
            (state.user as CustomerModel | CompanyModel).coupons.Restaurant =
                fun((state.user as CustomerModel | CompanyModel).coupons.Restaurant, target);
            break;
        case "Vacation":
            (state.user as CustomerModel | CompanyModel).coupons.Vacation =
                fun((state.user as CustomerModel | CompanyModel).coupons.Vacation, target);
            break;
        case "Attractions":
            (state.user as CustomerModel | CompanyModel).coupons.Attractions =
                fun((state.user as CustomerModel | CompanyModel).coupons.Attractions, target);
            break;
        case "Furniture":
            (state.user as CustomerModel | CompanyModel).coupons.Furniture =
                fun((state.user as CustomerModel | CompanyModel).coupons.Furniture, target);
            break;
        case "":
            (state.user as CustomerModel | CompanyModel).coupons.All =
                fun((state.user as CustomerModel | CompanyModel).coupons.All, target);
            break;
    }
}