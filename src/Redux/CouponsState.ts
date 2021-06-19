import CouponModel from "../Models/CouponModel";
import CustomerModel from "../Models/CustomerModel";

export interface CouponCategories {
    All: CouponModel[],
    Electricity: CouponModel[],
    Spa: CouponModel[],
    Restaurant: CouponModel[],
    Vacation: CouponModel[],
    Attractions: CouponModel[],
    Furniture: CouponModel[],
    Sport: CouponModel[]
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
    Furniture: CouponSet,
    Sport: CouponSet
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
        },
        Sport: {
            coupons: [],
            numOfPages: 0,
            totalElements: 0
        }
    };
}

export enum CouponsActionType {
    CouponsDownloaded = "CouponsDownloaded",
    CouponAdded = "CouponAdded",
    CouponUpdated = "CouponUpdated",
    CouponDeleted = "CouponDeleted",
    CompanyCouponsDeleted = "CompanyCouponsDeleted",
    CouponPurchased = "CouponPurchased"
}

export interface CouponsAction {
    type: CouponsActionType;
    payload?: any;
    category?: string;
    numOfPages?: number;
    totalElements?: number;
    customer?: CustomerModel;
    companyId?: number;
}

export function couponsDownloadedAction(coupons: CouponModel[], category: string, numOfPages: number, totalElements: number): CouponsAction {
    return { type: CouponsActionType.CouponsDownloaded, payload: coupons, category: category, numOfPages: numOfPages, totalElements: totalElements };
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
export function companyCouponsDeletedAction(companyId: number, category: string): CouponsAction {
    return { type: CouponsActionType.CompanyCouponsDeleted, payload: companyId, category: category };
}
export function couponPurchasedAction(coupon: CouponModel, customer: CustomerModel, category: string): CouponsAction {
    return { type: CouponsActionType.CouponPurchased, payload: coupon, customer: customer, category: category };
}

export function couponsReducer(currentState: CouponsState = new CouponsState(), action: CouponsAction): CouponsState {
    const newState = { ...currentState };
    switch (action.type) {
        case CouponsActionType.CouponAdded:
            const categoryA = action.category;
            switchCategory(newState, categoryA, (source: CouponSet, couponAdded: CouponModel[]) => {
                source.coupons.push(couponAdded[0]);
                source.totalElements++;
                return source;
            }, [action.payload]);
            break;
        case CouponsActionType.CouponsDownloaded:
            switchCategory(newState, action.category, (source: CouponSet, couponsDownloaded: CouponModel[]) => {
                source.numOfPages = action.numOfPages;
                source.totalElements = action.totalElements;
                source.coupons = source.coupons.concat(couponsDownloaded);
                return source;
            }, action.payload);
            break;
        case CouponsActionType.CouponUpdated:
            const categoryU = action.category;
            switchCategory(newState, categoryU, (source: CouponSet, couponUpdated: CouponModel[]) => {
                source.coupons = source.coupons.filter(coupon => coupon.id !== couponUpdated[0].id);
                source.coupons.push(couponUpdated[0]);
                return source;
            }, [action.payload]);
            break;
        case CouponsActionType.CouponDeleted:
            const categoryD = action.category;
            switchCategory(newState, categoryD, (source: CouponSet, couponDeleted: CouponModel[]) => {
                source.coupons = source.coupons.filter(coupon => coupon.id !== couponDeleted[0].id);
                source.totalElements--;
                return source;
            }, [action.payload]);
            break;
        case CouponsActionType.CompanyCouponsDeleted:
            const categoryC = action.category;
            switchCategory(newState, categoryC, (source: CouponSet) => {
                let counter = 0;
                source.coupons.forEach((coupon) => coupon.company.id === action.payload ? counter++ : null);
                source.coupons = source.coupons.filter(coupon => coupon.company.id !== action.payload);
                source.totalElements = source.totalElements - counter;
                return source;
            });
            break;
        case CouponsActionType.CouponPurchased:
            const categoryP = action.category;
            action.payload.customers.push(action.customer);
            console.log(action.payload);
            switchCategory(newState, categoryP, (source: CouponSet, couponPurchased: CouponModel[]) => {
                source.coupons = source.coupons.filter(coupon => coupon.id !== couponPurchased[0].id);
                source.coupons.push(couponPurchased[0]);
                return source;
            }, [action.payload]);
            break;
    }
    return newState;

}

function switchCategory(state: CouponsState, category: string, fun: (source: CouponSet, target?: CouponModel[]) => CouponSet, target?: CouponModel[]): void {
    switch (category) {
        case "Electricity":
            state.category.Electricity = fun(state.category.Electricity, target);
            break;
        case "Spa":
            state.category.Spa = fun(state.category.Spa, target);
            break;
        case "Restaurant":
            state.category.Restaurant = fun(state.category.Restaurant, target);
            break;
        case "Vacation":
            state.category.Vacation = fun(state.category.Vacation, target);
            break;
        case "Attractions":
            state.category.Attractions = fun(state.category.Attractions, target);
            break;
        case "Furniture":
            state.category.Furniture = fun(state.category.Furniture, target);
            break;
        case "Sport":
            state.category.Sport = fun(state.category.Sport, target);
            break;
        case "All":
            state.category.All = fun(state.category.All, target);
            break;
    }
}