import AdminModel from "../Models/AdminModel";
import CompanyModel from "../Models/CompanyModel";
import CouponModel from "../Models/CouponModel";
import CustomerModel from "../Models/CustomerModel";

export class AdminState {
    public companies: CompanyModel[] = [];
    public customers: CustomerModel[] = [];
}
//--------------------------------------------------------
//Admin action types:
export enum AdminActionType {
    CompaniesDownloaded = "CompaniesDownloaded",
    CustomersDownloaded = "CustomersDownloaded",
    CompanyAdded = "CompanyAdded",
    CustomerAdded = "CustomerAdded",
    CompanyUpdated = "CompanyUpdated",
    CustomerUpdated = "CustomerUpdated",
    CompanyDeleted = "CompanyDeleted",
    CustomerDeleted = "CustomerDeleted"
}
//---------------------------------------------------------
//Shared Action:
export interface AdminAction {
    type: AdminActionType;
    payload?: any;
}
//-------------------------------------------------------
//action creators 
export function CompaniesDownloadedAction(companies: CompanyModel[]): AdminAction {
    return { type: AdminActionType.CompaniesDownloaded, payload: companies };
}
export function CustomersDownloadedAction(customers: CustomerModel[]): AdminAction {
    return { type: AdminActionType.CustomersDownloaded, payload: customers };
}
export function CompanyAddedAction(company: CompanyModel): AdminAction {
    return { type: AdminActionType.CompanyAdded, payload: company };
}
export function CustomerAddedAction(customer: CustomerModel): AdminAction {
    return { type: AdminActionType.CustomerAdded, payload: customer };
}
export function CompanyUpdatedAction(company: CompanyModel): AdminAction {
    return { type: AdminActionType.CompanyUpdated, payload: company };
}
export function CustomerUpdatedAction(customer: CustomerModel): AdminAction {
    return { type: AdminActionType.CustomerUpdated, payload: customer };
}
export function CompanyDeletedAction(companyId: number): AdminAction {
    return { type: AdminActionType.CompanyDeleted, payload: companyId };
}
export function CustomerDeletedAction(customerId: number): AdminAction {
    return { type: AdminActionType.CustomerDeleted, payload: customerId };
}
//----------------------------------------------------------
//Shared reducer :
export function AdminReducer(currentState: AdminState = new AdminState(), action: AdminAction): AdminState {
    const newState = { ...currentState };

    switch (action.type) {
        case AdminActionType.CompaniesDownloaded:
            newState.companies = action.payload;
            break;
        case AdminActionType.CustomersDownloaded:
            newState.customers = action.payload;
            break;
        case AdminActionType.CompanyAdded:
            newState.companies.push(action.payload);
            break;
        case AdminActionType.CustomerAdded:
            newState.customers.push(action.payload);
            break;
        case AdminActionType.CompanyUpdated:
            newState.companies = newState.companies.filter(company => company.id !== action.payload.id);
            newState.companies.push(action.payload);
            break;
        case AdminActionType.CustomerUpdated:
            newState.customers = newState.customers.filter(customer => customer.id !== action.payload.id);
            newState.customers.push(action.payload);
            break;
        case AdminActionType.CompanyDeleted:
            newState.companies = newState.companies.filter(company => company.id !== action.payload);
            break;
        case AdminActionType.CustomerDeleted:
            newState.customers = newState.customers.filter(customer => customer.id !== action.payload);
            break;
    }
    return newState;
}