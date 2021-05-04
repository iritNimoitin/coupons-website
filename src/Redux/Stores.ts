
import {combineReducers, createStore} from "redux";
import CouponModel from "../Models/CouponModel";
import { AuthReducer } from "./AuthState";
import { couponsReducer } from "./CouponsState";

//single reducer:
//const store = createStore(Productsreducer);

//for getting productsState :
//store.getState().products

//--------------------------------------------------------------

//multiple reducer:
const reducers = combineReducers({CouponsState: couponsReducer, AuthState: AuthReducer});
const store = createStore(reducers);

export function getCategory(category: string): CouponModel[]{
    switch(category){
        case "Electricity":
            return store.getState()?.CouponsState.coupons.Electricity;
        case "Spa":
            return store.getState()?.CouponsState.coupons.Spa;
        case "Restaurant":
            return store.getState()?.CouponsState.coupons.Restaurant;
        case "Vacation":
            return store.getState()?.CouponsState.coupons.Vacation;
        case "Attractions":
            return store.getState()?.CouponsState.coupons.Attractions;
        case "Furniture":
            return store.getState()?.CouponsState.coupons.Furniture;
        case "":
            return store.getState()?.CouponsState.coupons.All;
    }
}

//for getting productState:
//store.getState().productsState.product
//store.getState().employeeState.employees

export default store;
