import AdminModel from "../Models/AdminModel";
import CompanyModel from "../Models/CompanyModel";
import CouponModel from "../Models/CouponModel";
import CustomerModel from "../Models/CustomerModel";

export class SharedState {
    public companyCouponsCategory: string = "All";
    public companyMaxPrice: number = undefined;
}
//--------------------------------------------------------
//Shared action types:
export enum SharedActionType {
    ChangeCompanyCouponsCategory = "ChangeCompanyCouponsCategory",
    ChangeCompanyMaxPrice = "ChangeCompanyMaxPrice"
}
//---------------------------------------------------------
//Shared Action:
export interface SharedAction {
    type: SharedActionType;
    //payload?: any;
    companyCouponsCategory?: string;
    companyMaxPrice?: number;
}
//-------------------------------------------------------
//action creators 
export function ChangeCompanyCouponsCategoryAction(companyCouponsCategory: string): SharedAction {
    return { type: SharedActionType.ChangeCompanyCouponsCategory, companyCouponsCategory: companyCouponsCategory };
}
export function ChangeCompanyMaxPriceAction(companyMaxPrice: number): SharedAction {
    return { type: SharedActionType.ChangeCompanyMaxPrice, companyMaxPrice: companyMaxPrice };
}

//----------------------------------------------------------
//Shared reducer :
export function SharedReducer(currentState: SharedState = new SharedState(), action: SharedAction): SharedState {
    const newState = { ...currentState };

    switch (action.type) {
        case SharedActionType.ChangeCompanyCouponsCategory:
            newState.companyCouponsCategory = action.companyCouponsCategory;
            break;
        case SharedActionType.ChangeCompanyMaxPrice:
            newState.companyMaxPrice = action.companyMaxPrice;
            break;
    }
    return newState;
}