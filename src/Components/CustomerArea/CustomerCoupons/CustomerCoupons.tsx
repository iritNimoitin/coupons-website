import "./CustomerCoupons.css";
import { Component } from "react";
import { Unsubscribe } from "redux";
import CouponModel from "../../../Models/CouponModel";
import { logoutAction, userCouponsDownloadedAction } from "../../../Redux/AuthState";
import store, { getUserCategory } from "../../../Redux/Stores";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import CouponCard from "../../CouponsArea/CouponCard/CouponCard";
import CustomerModel from "../../../Models/CustomerModel";
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface CustomerCouponsState {
    coupons: CouponModel[];
    category: string;
    maxPrice: number;
}

interface CustomerCouponsProps extends RouteComponentProps {

}

class CustomerCoupons extends Component<CustomerCouponsProps, CustomerCouponsState> {

    public constructor(props: CustomerCouponsProps) {
        super(props);
        this.state = {
            coupons: [],
            category: store.getState().SharedState.customerCouponsCategory,
            maxPrice: 0
        };
    }

    private unsubscribeMe: Unsubscribe;

    public componentWillUnmount(): void {
        this.unsubscribeMe();
    }

    public componentDidMount() {
        this.getCoupons();
        this.unsubscribeMe = store.subscribe(() => {
            const category = store.getState().SharedState.customerCouponsCategory;
            if (category !== this.state.category) {
                this.setState({
                    category: category
                });
                this.getCoupons();
            } else if (getUserCategory(category, (store.getState().AuthState.user as CustomerModel)).length !== this.state.coupons.length) {
                this.setState({
                    ...this.state,
                    coupons: getUserCategory(category, (store.getState().AuthState.user as CustomerModel))
                })
            }
            if (!store.getState().SharedState.customerMaxPrice) {
                this.setState({
                    coupons: getUserCategory(category, (store.getState().AuthState.user as CustomerModel))
                })
            } else if (this.state.maxPrice !== store.getState().SharedState.customerMaxPrice) {
                this.setState({
                    coupons: getUserCategory(category, (store.getState().AuthState.user as CustomerModel)).filter(coupon => coupon.price < store.getState().SharedState.customerMaxPrice)
                })
            }
        });
    }

    private getCoupons() {
        const userCoupons = getUserCategory(store.getState().SharedState.customerCouponsCategory, (store.getState().AuthState.user as CustomerModel));
        if (userCoupons.length === 0) {
            this.getCouponsFromServer();
        } else {
            this.setState({ coupons: userCoupons });
        }
    }

    private getCouponsFromServer = async () => {
        try {
            const category = store.getState().SharedState.customerCouponsCategory;
            const headers = {
                'category': category
            }
            let url = globals.urls.customer.coupons;
            if (category !== "All") {
                url = url + "category/";
            }
            const response = await jwtAxios.get(url, { headers });
            this.setState({
                coupons: response.data
            });
            store.dispatch(userCouponsDownloadedAction(response.data, category));
        } catch (err) {
            notify.error(err);
            store.dispatch(logoutAction());
            this.props.history.push('/login');
        }
    }

    public render(): JSX.Element {
        return (
            <div className="CustomerCoupons">
                {this.state.coupons.map(c => <CouponCard key={c.id} coupon={c} />)}
            </div>
        );
    }
}

export default withRouter(CustomerCoupons);
