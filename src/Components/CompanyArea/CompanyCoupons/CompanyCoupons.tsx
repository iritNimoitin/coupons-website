import { Component } from "react";
import { Unsubscribe } from "redux";
import CompanyModel from "../../../Models/CompanyModel";
import CouponModel from "../../../Models/CouponModel";
import { userCouponsDownloadedAction } from "../../../Redux/AuthState";
import store, { getUserCategory } from "../../../Redux/Stores";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notification";
import CouponCard from "../../CouponsArea/CouponCard/CouponCard";
import "./CompanyCoupons.css";

interface CompanyCouponsState {
    coupons: CouponModel[];
    category: string;
    maxPrice: number;
}

class CompanyCoupons extends Component<{}, CompanyCouponsState> {

    public constructor(props: {}) {
        super(props);
        this.state = {
            coupons: [],
            category: store.getState().SharedState.companyCouponsCategory,
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
            const category = store.getState().SharedState.companyCouponsCategory;
            if (category !== this.state.category) {
                this.setState({
                    category: category
                });
                this.getCoupons();
            } else if (getUserCategory(category, (store.getState().AuthState.user as CompanyModel)).length !== this.state.coupons.length) {
                this.setState({
                    ...this.state,
                    coupons: getUserCategory(category, (store.getState().AuthState.user as CompanyModel))
                })
            }
            if (!store.getState().SharedState.companyMaxPrice) {
                this.setState({
                    coupons: getUserCategory(category, (store.getState().AuthState.user as CompanyModel))
                })
            } else if (this.state.maxPrice !== store.getState().SharedState.companyMaxPrice) {
                this.setState({
                    coupons: getUserCategory(category, (store.getState().AuthState.user as CompanyModel)).filter(coupon => coupon.price < store.getState().SharedState.companyMaxPrice)
                })
            }
        });
    }

    private getCoupons() {
        const userCoupons = getUserCategory(store.getState().SharedState.companyCouponsCategory, (store.getState().AuthState.user as CompanyModel));
        if (userCoupons.length === 0) {
            this.getCouponsFromServer();
        } else {
            this.setState({ coupons: userCoupons });
        }
    }

    private getCouponsFromServer = async () => {
        try {
            const category = store.getState().SharedState.companyCouponsCategory;
            const headers = {
                'category': category
            }
            let url = globals.urls.company.coupons;
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
        }
    }

    public render(): JSX.Element {
        return (
            <div className="CompanyCoupons">
                {this.state.coupons.map(c => <CouponCard key={c.id} coupon={c} />)}
            </div>
        );
    }
}

export default CompanyCoupons;
