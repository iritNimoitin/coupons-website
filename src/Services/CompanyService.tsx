import globals from "./Globals";
import jwtAxios from "./jwtAxios";
import notify from "./Notification";

class CompanyService {

    //private check if logged

    public async deleteCoupon(couponId: number) {
        try {
            const headers = {
                'couponId': couponId
            }
            await jwtAxios.delete(globals.urls.company.coupons, { headers });
            notify.success("You have been successfully deleting the coupon.");
        }
        catch (err) {
            notify.error(err);
        }
    }

}

const companyService = new CompanyService();
export default companyService;