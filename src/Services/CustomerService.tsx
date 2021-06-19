import CouponModel from "../Models/CouponModel";
import CustomerModel from "../Models/CustomerModel";
import { userCouponAddedAction } from "../Redux/AuthState";
import { couponPurchasedAction } from "../Redux/CouponsState";
import store from "../Redux/Stores";
import globals from "./Globals";
import jwtAxios from "./jwtAxios";
import notify from "./Notification";

class CustomerService {

  public async purchaseCoupon(coupon: CouponModel, customer: CustomerModel) {
    try {
      const headers = {
        'couponId': coupon.id,
      }
      await jwtAxios.put(globals.urls.customer.coupons, null, { headers });
      const user = (store.getState().AuthState.user as CustomerModel);
      store.dispatch(userCouponAddedAction(coupon, "All"));
      store.dispatch(userCouponAddedAction(coupon, coupon.category));
      store.dispatch(couponPurchasedAction(coupon, customer, coupon.category));
      store.dispatch(couponPurchasedAction(coupon, customer, "All"));
      notify.success("You have been successfully purchasing the coupon.");
    }
    catch (err) {
      notify.error(err);
    }
  }

}

const customerService = new CustomerService();
export default customerService;