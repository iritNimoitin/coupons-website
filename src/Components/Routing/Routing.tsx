
import { Redirect, Route, Switch } from "react-router";
import Login from "../AuthArea/Login/Login";
import CouponDetails from "../CouponsArea/CouponDetails/CouponDetails";
import CouponsList from "../CouponsArea/CouponsList/CouponsList";
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
            {/* <Route path="/coupons/Electricity" component={CouponsList} exact />
            <Route path="/coupons/Spa" component={CouponsList} exact />
            <Route path="/coupons/Restaurant" component={CouponsList} exact />
            <Route path="/coupons/Vacation" component={CouponsList} exact />
            <Route path="/coupons/Attractions" component={CouponsList} exact />
            <Route path="/coupons/Furniture" component={CouponsList} exact /> */}
            {/*<Route path="/products/new" component={AddProduct} exact />
            <Route path="/about" component={About} exact />
            <Route path="/contact-us" component={ContactUs} exact />
            <Route path ="/register" component={Register} exact />
            <Route path = "/login"  component={Login} exact />
            <Route path ="/logout" component={Logout} exact /> */}
            <Redirect from="/" to="/home" exact />
            <Route component={Page404} />
            {/* must be last */}

        </Switch>  
        </div>
    );
}

export default Routing;
