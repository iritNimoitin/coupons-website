import { CouponCategories } from "../Redux/CouponsState";

class CustomerModel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public coupons: CouponCategories;
    public token: string;
}

export default CustomerModel;
