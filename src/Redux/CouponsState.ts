
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

export interface CouponSet {
    coupons: CouponModel[],
    numOfPages: number,
    totalElements: number
}

interface CouponPageCategories {
    All: CouponSet,
    Electricity: CouponSet,
    Spa: CouponSet,
    Restaurant: CouponSet,
    Vacation: CouponSet,
    Attractions: CouponSet,
    Furniture: CouponSet
}

export class CouponsState {
    public category: CouponPageCategories = {
        All: {
            coupons: [],
            numOfPages: 0,
            totalElements: 0
        },
        Electricity: {
            coupons: [],
            numOfPages: 0,
            totalElements: 0
        },
        Spa: {
            coupons: [],
            numOfPages: 0,
            totalElements: 0
        },
        Restaurant: {
            coupons: [],
            numOfPages: 0,
            totalElements: 0
        },
        Vacation: {
            coupons: [],
            numOfPages: 0,
            totalElements: 0
        },
        Attractions: {
            coupons: [],
            numOfPages: 0,
            totalElements: 0
        },
        Furniture: {
            coupons: [],
            numOfPages: 0,
            totalElements: 0
        }
    };
}
//----------------------------------------------------------------------------------
//product action types:-אלו פעולות ניתן לבצע ברמת האפליקציה
export enum CouponsActionType {
    CouponsDownloaded = "CouponsDownloaded",
    CouponAdded = "CouponAdded",
    CouponUpdated = "CouponUpdated",
    CouponDeleted = "CouponDeleted"
}
//----------------------------------------------------------------------------------
//product action 
export interface CouponsAction {
    type: CouponsActionType;
    payload?: any;
    category?: string;
    index?: number;
    amount?: number;
    numOfPages?: number;
    totalElements?: number;
}
//----------------------------------------------------------------------------------
//products action creators

export function couponsDownloadedAction(coupons: CouponModel[], category: string, index: number, amount: number, numOfPages: number, totalElements: number): CouponsAction {
    return { type: CouponsActionType.CouponsDownloaded, payload: coupons, category: category, index: index, amount: amount, numOfPages: numOfPages, totalElements: totalElements };
}

export function couponAddedAction(coupon: CouponModel, category: string): CouponsAction {
    return { type: CouponsActionType.CouponAdded, payload: coupon, category: category };
}

export function couponUpdatedAction(coupon: CouponModel, category: string): CouponsAction {
    return { type: CouponsActionType.CouponUpdated, payload: coupon, category: category };
}
export function couponDeletedAction(coupon: CouponModel, category: string): CouponsAction {
    return { type: CouponsActionType.CouponDeleted, payload: coupon, category: category };
}
//----------------------------------------------------------------------------------------
//products reducer 
export function couponsReducer(currentState: CouponsState = new CouponsState(), action: CouponsAction): CouponsState {
    const newState = { ...currentState };
    switch (action.type) {
        case CouponsActionType.CouponAdded:
            const categoryA = action.category;
            switchCategory(newState, categoryA, [action.payload], (source: CouponModel[], couponAdded: CouponModel[]) => {
                source.push(couponAdded[0]);
                return source;
            });
            break;
        case CouponsActionType.CouponsDownloaded:
            switchCategory(newState, action.category, action.payload, (source: CouponModel[], couponsDownloaded: CouponModel[]) => {
                source = source.concat(couponsDownloaded);
                // const temp = [];
                // const range = action.index - source.length;
                // for (let i = 0; i < range; i++) {
                //     temp.push(null);
                // }
                // source.push(...temp);
                // source.splice(action.index, action.amount, ...couponsDownloaded);
                return source;
            }, action.numOfPages, action.totalElements);
            break;
        case CouponsActionType.CouponUpdated:
            const categoryU = action.category;
            switchCategory(newState, categoryU, [action.payload], (source: CouponModel[], couponUpdated: CouponModel[]) => {
                source = source.filter(coupon => coupon.id !== couponUpdated[0].id);
                source.push(couponUpdated[0]);
                return source;
            });
            break;
        case CouponsActionType.CouponDeleted:
            const categoryD = action.category;
            switchCategory(newState, categoryD, [action.payload], (source: CouponModel[], couponDeleted: CouponModel[]) => {
                source = source.filter(coupon => coupon.id !== couponDeleted[0].id);
                return source;
            });
            break;
    }
    return newState;

}

function switchCategory(state: CouponsState, category: string, target: CouponModel[], fun: (source: CouponModel[], target: CouponModel[]) => CouponModel[], numOfPages?: number, totalElements?: number): void {
    switch (category) {
        case "Electricity":
            state.category.Electricity.coupons = fun(state.category.Electricity.coupons, target);
            if (numOfPages != undefined) {
                state.category.Electricity.numOfPages = numOfPages;
                state.category.Electricity.totalElements = totalElements;
            }
            break;
        case "Spa":
            state.category.Spa.coupons = fun(state.category.Spa.coupons, target);
            if (numOfPages != undefined) {
                state.category.Spa.numOfPages = numOfPages;
                state.category.Spa.totalElements = totalElements;
            }
            break;
        case "Restaurant":
            state.category.Restaurant.coupons = fun(state.category.Restaurant.coupons, target);
            if (numOfPages != undefined) {
                state.category.Restaurant.numOfPages = numOfPages;
                state.category.Restaurant.totalElements = totalElements;
            }
            break;
        case "Vacation":
            state.category.Vacation.coupons = fun(state.category.Vacation.coupons, target);
            if (numOfPages != undefined) {
                state.category.Vacation.numOfPages = numOfPages;
                state.category.Vacation.totalElements = totalElements;
            }
            break;
        case "Attractions":
            state.category.Attractions.coupons = fun(state.category.Attractions.coupons, target);
            if (numOfPages != undefined) {
                state.category.Attractions.numOfPages = numOfPages;
                state.category.Attractions.totalElements = totalElements;
            }
            break;
        case "Furniture":
            state.category.Furniture.coupons = fun(state.category.Furniture.coupons, target);
            if (numOfPages != undefined) {
                state.category.Furniture.numOfPages = numOfPages;
                state.category.Furniture.totalElements = totalElements;
            }
            break;
        case "All":
            state.category.All.coupons = fun(state.category.All.coupons, target);
            if (numOfPages != undefined) {
                state.category.All.numOfPages = numOfPages;
                state.category.All.totalElements = totalElements;
            }
            break;
    }
}