import AdminModel from "../Models/AdminModel";
import CompanyModel from "../Models/CompanyModel";
import CouponModel from "../Models/CouponModel";
import CustomerModel from "../Models/CustomerModel";

export class SharedState {
    public companyCouponsCategory: string = "All";
}
//--------------------------------------------------------
//Shared action types:
export enum SharedActionType {
    ChangeCompanyCouponsCategory = "ChangeCompanyCouponsCategory"
}
//---------------------------------------------------------
//Shared Action:
export interface SharedAction {
    type: SharedActionType;
    //payload?: any;
    companyCouponsCategory?: string;
}
//-------------------------------------------------------
//action creators 
export function ChangeCompanyCouponsCategoryAction(companyCouponsCategory: string): SharedAction {
    return { type: SharedActionType.ChangeCompanyCouponsCategory, companyCouponsCategory: companyCouponsCategory };
}

//----------------------------------------------------------
//Shared reducer :
export function SharedReducer(currentState: SharedState = new SharedState(), action: SharedAction): SharedState {
    const newState = { ...currentState };

    switch (action.type) {
        case SharedActionType.ChangeCompanyCouponsCategory:
            newState.companyCouponsCategory = action.companyCouponsCategory;
            break;
    }
    return newState;
}