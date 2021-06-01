import { CouponCategories } from "../Redux/CouponsState";
import CouponModel from "./CouponModel";

class CompanyModel {
    public id: number;
    public name: string;
    public email: string;
    public password: string;
    public coupons: CouponCategories;
    public token: string;
}

export default CompanyModel;
