export class SharedState {
    public companyCouponsCategory: string = "All";
    public companyMaxPrice: number = undefined;
    public customerCouponsCategory: string = "All";
    public customerMaxPrice: number = undefined;
}

export enum SharedActionType {
    ChangeCompanyCouponsCategory = "ChangeCompanyCouponsCategory",
    ChangeCompanyMaxPrice = "ChangeCompanyMaxPrice",
    ChangeCustomerCouponsCategory = "ChangeCustomerCouponsCategory",
    ChangeCustomerMaxPrice = "ChangeCustomerMaxPrice"
}

export interface SharedAction {
    type: SharedActionType;
    payload?: any;
}

export function ChangeCompanyCouponsCategoryAction(companyCouponsCategory: string): SharedAction {
    return { type: SharedActionType.ChangeCompanyCouponsCategory, payload: companyCouponsCategory };
}
export function ChangeCompanyMaxPriceAction(companyMaxPrice: number): SharedAction {
    return { type: SharedActionType.ChangeCompanyMaxPrice, payload: companyMaxPrice };
}
export function ChangeCustomerCouponsCategoryAction(customerCouponsCategory: string): SharedAction {
    return { type: SharedActionType.ChangeCustomerCouponsCategory, payload: customerCouponsCategory };
}
export function ChangeCustomerMaxPriceAction(customerMaxPrice: number): SharedAction {
    return { type: SharedActionType.ChangeCustomerMaxPrice, payload: customerMaxPrice };
}

export function SharedReducer(currentState: SharedState = new SharedState(), action: SharedAction): SharedState {
    const newState = { ...currentState };

    switch (action.type) {
        case SharedActionType.ChangeCompanyCouponsCategory:
            newState.companyCouponsCategory = action.payload;
            break;
        case SharedActionType.ChangeCompanyMaxPrice:
            newState.companyMaxPrice = action.payload;
            break;
        case SharedActionType.ChangeCustomerCouponsCategory:
            newState.customerCouponsCategory = action.payload;
            break;
        case SharedActionType.ChangeCustomerMaxPrice:
            newState.customerMaxPrice = action.payload;
            break;
    }
    return newState;
}