import axios from "axios";
import AdminModel from "../Models/AdminModel";
import CompanyModel from "../Models/CompanyModel";
import CouponModel from "../Models/CouponModel";
import CustomerModel from "../Models/CustomerModel";
import globals from "../Services/Globals";
import store from "./Stores";

export class AuthState {
    public user: CustomerModel | CompanyModel | AdminModel = null;
    public clientType: string = null;
    public constructor() {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedClientType = JSON.parse(localStorage.getItem("clientType"));
        if (storedUser && storedClientType) {
            getNewToken(storedUser, storedClientType);
        }
    }
}

export async function getNewToken(user: CustomerModel | CompanyModel | AdminModel, clientType: string) {
    try {
        let url = globals.urls.auth.token;
        const headers = {
            "token": user.token,
            "clientType": clientType
        };
        const response = await axios.get(url, { headers });
        user.token = response.data;
        store.dispatch(loginAction(user, clientType));
    }
    catch (err) {
    }
}

export enum AuthActionType {
    Register = "Register",
    Login = "Login",
    Logout = "Logout",
    UserCouponsDownloaded = "UserCouponsDownloaded",
    UserCouponAdded = "UserCouponAdded",
    UserCouponUpdated = "UserCouponUpdated",
    UserCouponDeleted = "UserCouponDeleted"
}

export interface AuthAction {
    type: AuthActionType;
    payload?: any;
    clientType?: string;
    category?: string;
}

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
export function userCouponAddedAction(coupon: CouponModel, category: string): AuthAction {
    return { type: AuthActionType.UserCouponAdded, payload: coupon, category: category };
}
export function userCouponUpdatedAction(coupon: CouponModel, category: string): AuthAction {
    return { type: AuthActionType.UserCouponUpdated, payload: coupon, category: category };
}
export function userCouponDeletedAction(coupon: CouponModel, category: string): AuthAction {
    return { type: AuthActionType.UserCouponDeleted, payload: coupon, category: category };
}

export function AuthReducer(currentState: AuthState = new AuthState(), action: AuthAction): AuthState {
    const newState = { ...currentState };

    switch (action.type) {
        case AuthActionType.Register:
        case AuthActionType.Login:
            newState.user = action.payload;
            newState.clientType = action.clientType;
            localStorage.setItem("user", JSON.stringify(newState.user));
            localStorage.setItem("clientType", JSON.stringify(newState.clientType));
            break;
        case AuthActionType.Logout:
            newState.user = null;
            newState.clientType = null;
            localStorage.removeItem("user");
            localStorage.removeItem("clientType");
            break;
        case AuthActionType.UserCouponsDownloaded:
            switchCategory(newState, action.category, action.payload, (source: CouponModel[], couponsDownloaded: CouponModel[]) => {
                source = source.concat(couponsDownloaded);
                return source;
            });
            break;
        case AuthActionType.UserCouponAdded:
            const categoryA = action.category;
            switchCategory(newState, categoryA, [action.payload], (source: CouponModel[], couponAdded: CouponModel[]) => {
                source.push(couponAdded[0]);
                return source;
            });
            break;
        case AuthActionType.UserCouponUpdated:
            const categoryU = action.category;
            switchCategory(newState, categoryU, [action.payload], (source: CouponModel[], couponUpdated: CouponModel[]) => {
                source = source.filter(coupon => coupon.id !== couponUpdated[0].id);
                source.push(couponUpdated[0]);
                return source;
            });
            break;
        case AuthActionType.UserCouponDeleted:
            const categoryD = action.category;
            switchCategory(newState, categoryD, [action.payload], (source: CouponModel[], couponDeleted: CouponModel[]) => {
                source = source.filter(coupon => coupon.id !== couponDeleted[0].id);
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
        case "Sport":
            (state.user as CustomerModel | CompanyModel).coupons.Sport =
                fun((state.user as CustomerModel | CompanyModel).coupons.Sport, target);
            break;
        case "All":
            (state.user as CustomerModel | CompanyModel).coupons.All =
                fun((state.user as CustomerModel | CompanyModel).coupons.All, target);
            break;
    }
}