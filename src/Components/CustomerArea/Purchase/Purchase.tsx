import axios from 'axios';
import { useEffect } from 'react';
import store from '../../../Redux/Stores';
import globals from '../../../Services/Globals';
import notify from '../../../Services/Notification';
import "./Purchase.css";

interface PurchaseProps {
	couponId: number;
}

function Purchase(props: PurchaseProps): JSX.Element {

    //running the following as componentDidMount
    useEffect(() => { //react hook for running side-effects inside a function component
        if(!store.getState().AuthState.user){
            notify.error("Please log in for purchasing coupons.");
        } else{
            purchaseCoupon();
        }
    });

    async function purchaseCoupon() {
        try {
          const headers = {
            'token': store.getState().AuthState.user.token,
            'couponId': props.couponId,
          }
          await axios.post(globals.urls.customer.coupons, {headers});
          notify.success("You have been successfully purchasing the coupon.");
        }
        catch(err) {
          notify.error(err);
        }
    }
    return null;
}

export default Purchase;
