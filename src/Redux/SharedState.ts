import AdminModel from "../Models/AdminModel";
import CompanyModel from "../Models/CompanyModel";
import CouponModel from "../Models/CouponModel";
import CustomerModel from "../Models/CustomerModel";

export class SharedState {
    public companyCouponsCategory: string = "All";
    public companyMaxPrice: number = undefined;
    public customerCouponsCategory: string = "All";
    public customerMaxPrice: number = undefined;
}
//--------------------------------------------------------
//Shared action types:
export enum SharedActionType {
    ChangeCompanyCouponsCategory = "ChangeCompanyCouponsCategory",
    ChangeCompanyMaxPrice = "ChangeCompanyMaxPrice",
    ChangeCustomerCouponsCategory = "ChangeCustomerCouponsCategory",
    ChangeCustomerMaxPrice = "ChangeCustomerMaxPrice"
}
//---------------------------------------------------------
//Shared Action:
export interface SharedAction {
    type: SharedActionType;
    //payload?: any;
    companyCouponsCategory?: string;
    companyMaxPrice?: number;
    customerCouponsCategory?: string;
    customerMaxPrice?: number;
}
//-------------------------------------------------------
//action creators 
export function ChangeCompanyCouponsCategoryAction(companyCouponsCategory: string): SharedAction {
    return { type: SharedActionType.ChangeCompanyCouponsCategory, companyCouponsCategory: companyCouponsCategory };
}
export function ChangeCompanyMaxPriceAction(companyMaxPrice: number): SharedAction {
    return { type: SharedActionType.ChangeCompanyMaxPrice, companyMaxPrice: companyMaxPrice };
}
export function ChangeCustomerCouponsCategoryAction(customerCouponsCategory: string): SharedAction {
    return { type: SharedActionType.ChangeCustomerCouponsCategory, customerCouponsCategory: customerCouponsCategory };
}
export function ChangeCustomerMaxPriceAction(customerMaxPrice: number): SharedAction {
    return { type: SharedActionType.ChangeCustomerMaxPrice, customerMaxPrice: customerMaxPrice };
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
        case SharedActionType.ChangeCustomerCouponsCategory:
            newState.customerCouponsCategory = action.customerCouponsCategory;
            break;
        case SharedActionType.ChangeCustomerMaxPrice:
            newState.customerMaxPrice = action.customerMaxPrice;
            break;
    }
    return newState;
}