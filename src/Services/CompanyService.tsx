import CompanyModel from "../Models/CompanyModel";
import CouponModel from "../Models/CouponModel";
import { userCouponDeletedAction } from "../Redux/AuthState";
import { couponDeletedAction } from "../Redux/CouponsState";
import store, { getCategory, getUserCategory } from "../Redux/Stores";
import globals from "./Globals";
import jwtAxios from "./jwtAxios";
import notify from "./Notification";

class CompanyService {

    //private check if logged

    public async deleteCoupon(coupon: CouponModel) {
        try {
            const headers = {
                'couponId': coupon.id,
                'category': coupon.category
            }
            await jwtAxios.delete(globals.urls.company.coupons, { headers });
            const user = (store.getState().AuthState.user as CompanyModel);
            if (getCategory("All").coupons.find(c => c.id === coupon.id)) {
                store.dispatch(couponDeletedAction(coupon, "All"));
            }
            if (getCategory(coupon.category).coupons.find(c => c.id === coupon.id)) {
                store.dispatch(couponDeletedAction(coupon, coupon.category));
            }
            if (getUserCategory("All", user).find(c => c.id === coupon.id)) {
                store.dispatch(userCouponDeletedAction(coupon, "All"));
            }
            if (getUserCategory(coupon.category, user).find(c => c.id === coupon.id)) {
                store.dispatch(userCouponDeletedAction(coupon, coupon.category));
            }
            notify.success("You have been successfully deleting the coupon.");
        }
        catch (err) {
            notify.error(err);
        }
    }

}

const companyService = new CompanyService();
export default companyService;