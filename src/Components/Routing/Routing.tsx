
import { Redirect, Route, Switch } from "react-router";
import Login from "../AuthArea/Login/Login";
import Logout from "../AuthArea/Logout/Logout";
import Register from "../AuthArea/Register/Register";
import CompanyCouponsPage from "../CompanyArea/CompanyCouponsPage/CompanyCouponsPage";
import CompanyDetails from "../CompanyArea/CompanyDetails/CompanyDetails";
import UpdateCoupon from "../CompanyArea/UpdateCoupon/UpdateCoupon";
import CouponDetails from "../CouponsArea/CouponDetails/CouponDetails";
import CouponsList from "../CouponsArea/CouponsList/CouponsList";
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
                <Route path="/customer/details" component={CustomerDetails} exact />
                <Route path="/update/:category/:id" component={UpdateCoupon} />
                <Redirect from="/" to="/home" exact />
                <Route component={Page404} />
                {/* must be last */}

            </Switch>
        </div>
    );
}

export default Routing;
