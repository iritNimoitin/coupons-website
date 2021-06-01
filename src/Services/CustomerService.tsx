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

  public async purchaseCoupon(couponId: number) {
    try {
      const headers = {
        'token': store.getState().AuthState.user.token,
        'couponId': couponId,
      }
      await jwtAxios.put(globals.urls.customer.coupons, null, { headers });
      notify.success("You have been successfully purchasing the coupon.");
    }
    catch (err) {
      notify.error(err);
    }
  }

}

const customerService = new CustomerService();
export default customerService;