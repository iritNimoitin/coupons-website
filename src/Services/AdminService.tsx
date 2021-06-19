import { CompanyDeletedAction, CustomerDeletedAction } from "../Redux/AdminState";
import { companyCouponsDeletedAction } from "../Redux/CouponsState";
import store from "../Redux/Stores";
import globals from "./Globals";
import jwtAxios from "./jwtAxios";
import notify from "./Notification";

class AdminService {

    public async deleteCompany(companyId: number) {
        try {
            const headers = {
                'Id': companyId,
            }
            await jwtAxios.delete(globals.urls.admin.companies, { headers });
            store.dispatch(companyCouponsDeletedAction(companyId, "All"));
            store.dispatch(CompanyDeletedAction(companyId));
            notify.success("You have been successfully deleting the company.");
        }
        catch (err) {
            notify.error(err);
        }
    }

    public async deleteCustomer(customerId: number) {
        try {
            const headers = {
                'Id': customerId,
            }
            await jwtAxios.delete(globals.urls.admin.customers, { headers });
            store.dispatch(CustomerDeletedAction(customerId));
            notify.success("You have been successfully deleting the customer.");
        }
        catch (err) {
            notify.error(err);
        }
    }

}

const adminService = new AdminService();
export default adminService;