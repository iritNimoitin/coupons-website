
import { Redirect, Route, Switch } from "react-router";
import AddCompany from "../AdminArea/AddCompany/AddCompany";
import AddCustomer from "../AdminArea/AddCustomer/AddCustomer";
import Companies from "../AdminArea/Companies/Companies";
import Customers from "../AdminArea/Customers/Customers";
import UpdateCompany from "../AdminArea/UpdateCompany/UpdateCompany";
import UpdateCustomer from "../AdminArea/UpdateCustomer/UpdateCustomer";
import Login from "../AuthArea/Login/Login";
import Logout from "../AuthArea/Logout/Logout";
import Register from "../AuthArea/Register/Register";
import AddCoupon from "../CompanyArea/AddCoupon/AddCoupon";
import CompanyCouponsPage from "../CompanyArea/CompanyCouponsPage/CompanyCouponsPage";
import CompanyDetails from "../CompanyArea/CompanyDetails/CompanyDetails";
import UpdateCoupon from "../CompanyArea/UpdateCoupon/UpdateCoupon";
import CouponDetails from "../CouponsArea/CouponDetails/CouponDetails";
import CouponsList from "../CouponsArea/CouponsList/CouponsList";
import CustomerCouponsPage from "../CustomerArea/CustomerCouponsPage/CustomerCouponsPage";
import CustomerDetails from "../CustomerArea/CustomerDetails/CustomerDetails";
import Home from "../HomeArea/Home/Home";
import Page404 from "../SharedArea/Page404/Page404";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
            <Switch>
                <Route path="/home" component={Home} exact />
                <Route path="/coupons" component={CouponsList} exact />
                <Route path="/coupons/:category" component={CouponsList} exact />
                <Route path="/coupons/:category/:id" component={CouponDetails} exact />
                <Route path="/login" component={Login} exact />
                <Route path="/logout" component={Logout} exact />
                <Route path="/register" component={Register} exact />
                <Route path="/company/details" component={CompanyDetails} exact />
                <Route path="/company/coupons" component={CompanyCouponsPage} exact />
                <Route path="/company/addCoupon" component={AddCoupon} />
                <Route path="/company/update/:category/:id" component={UpdateCoupon} />
                <Route path="/customer/details" component={CustomerDetails} exact />
                <Route path="/customer/coupons" component={CustomerCouponsPage} exact />
                <Route path="/admin/companies" component={Companies} exact />
                <Route path="/admin/addCompany" component={AddCompany} exact />
                <Route path="/admin/companies/update/:id" component={UpdateCompany} exact />
                <Route path="/admin/customers" component={Customers} exact />
                <Route path="/admin/addCustomer" component={AddCustomer} exact />
                <Route path="/admin/customers/update/:id" component={UpdateCustomer} exact />
                <Redirect from="/" to="/home" exact />
                <Route component={Page404} />

            </Switch>
        </div>
    );
}

export default Routing;
