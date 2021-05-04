
//handing product app state

import CouponModel from "../Models/CouponModel";

export interface CouponCategories {
    All: CouponModel[],
    Electricity: CouponModel[],
    Spa: CouponModel[],
    Restaurant: CouponModel[],
    Vacation: CouponModel[],
    Attractions: CouponModel[],
    Furniture: CouponModel[]
}

//product app state- הבמידע ברמת האפליקציה הקשור למוצרים -אלו בעצם כל המוצרים
export class CouponsState {
    public coupons: CouponCategories = {
        All: [],
        Electricity: [],
        Spa: [],
        Restaurant: [],
        Vacation: [],
        Attractions: [],
        Furniture: []
    }; //we are going to create initial object
}
//----------------------------------------------------------------------------------
//product action types:-אלו פעולות ניתן לבצע ברמת האפליקציה
export enum CouponsActionType{
    CouponsDownloaded="CouponsDownloaded",
    CouponAdded="CouponAdded",
    CouponUpdated="CouponUpdated",
    CouponDeleted="CouponDeleted"
}
//----------------------------------------------------------------------------------
//product action - האובייקט המכיל את המידע עבור הפעולה שאנו מבצעים על המידע ברמת האפליקציה 
export interface CouponsAction{
    type: CouponsActionType;
    payload?: any;//payload?any, if the payload can be empty
    category?: string;
}
//----------------------------------------------------------------------------------
//products action creators-פונקציות המקבלות את ה- payload
//ומחזירות אובייקט action 
//מתאים עבור כל פעולה 

export function couponsDownloadedAction(coupons: CouponModel[], category: string): CouponsAction {
    return { type: CouponsActionType.CouponsDownloaded, payload: coupons, category: category };
}

export function couponAddedAction(coupon: CouponModel): CouponsAction {
    return { type: CouponsActionType.CouponAdded, payload: coupon };
}

export function couponUpdatedAction(coupon: CouponModel): CouponsAction {
    return { type: CouponsActionType.CouponUpdated, payload: coupon };
}
export function couponDeletedAction(coupon: CouponModel): CouponsAction {
    return { type: CouponsActionType.CouponDeleted, payload: coupon };
}
//----------------------------------------------------------------------------------------
//products reducer - פונקציה המבצעת את הפעולה בפועל 
export function couponsReducer (currentState: CouponsState = new CouponsState(), action:CouponsAction): CouponsState {
    //****functional programming**** TODO: check if can be replaced with concat
    const newState = {...currentState}; //spread operator - שכפול אובייקט
    switch(action.type){
        case CouponsActionType.CouponAdded:
            // const categoryA = (action.payload as CouponModel).category
            // switchCategory(categoryA, newState).push(action.payload);//TODO: check if need to replace with concat
            // newState.coupons.All.push(action.payload);
            break;
        case CouponsActionType.CouponsDownloaded:
            switchCategory(newState, action.category, action.payload, (source: CouponModel[], couponsDownloaded: CouponModel[]) => {
                return couponsDownloaded;
            });
            break;
        case CouponsActionType.CouponUpdated:
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
        case CouponsActionType.CouponDeleted:
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

function switchCategory(state: CouponsState, category: string, target: CouponModel[], fun: (source: CouponModel[], target: CouponModel[]) => CouponModel[]): void{
    switch(category){
        case "Electricity":
            state.coupons.Electricity = fun(state.coupons.Electricity, target);
            break;
        case "Spa":
            state.coupons.Spa = fun(state.coupons.Spa, target);
            break;
        case "Restaurant":
            state.coupons.Restaurant = fun(state.coupons.Restaurant, target);
            break;
        case "Vacation":
            state.coupons.Vacation = fun(state.coupons.Vacation, target);
            break;
        case "Attractions":
            state.coupons.Attractions = fun(state.coupons.Attractions, target);
            break;
        case "Furniture":
            state.coupons.Furniture = fun(state.coupons.Furniture, target);
            break;
        case "":
            state.coupons.All = fun(state.coupons.All, target);
            break;
    }
}