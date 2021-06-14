import CouponModel from "../Models/CouponModel";
import CustomerModel from "../Models/CustomerModel";
import { userCouponAddedAction } from "../Redux/AuthState";
import store from "../Redux/Stores";
import globals from "./Globals";
import jwtAxios from "./jwtAxios";
import notify from "./Notification";

class CustomerService {

  //private check if logged
  // if(store.getState().AuthState.user && store.getState().AuthState.clientType === "Customer"){
  //     purchaseCoupon();
  //   } else{
  //     notify.error("Please log in as customer for purchasing coupons.");
  //   }

  public async purchaseCoupon(coupon: CouponModel) {
    try {
      const headers = {
        'couponId': coupon.id,
      }
      await jwtAxios.put(globals.urls.customer.coupons, null, { headers });
      const user = (store.getState().AuthState.user as CustomerModel);
      store.dispatch(userCouponAddedAction(coupon, "All"));
      store.dispatch(userCouponAddedAction(coupon, coupon.category));
      notify.success("You have been successfully purchasing the coupon.");
    }
    catch (err) {
      notify.error(err);
    }
  }

}

const customerService = new CustomerService();
export default customerService;