import { Component } from "react";
import { RouteComponentProps } from "react-router";
import "./CouponDetails.css";
import CouponModel from "../../../Models/CouponModel";
import store, { getCategory, getUserCategory } from "../../../Redux/Stores";
import Button from '@material-ui/core/Button';
import notify from "../../../Services/Notification";
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import customerService from "../../../Services/CustomerService";
import { Typography } from "@material-ui/core";
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import { withRouter } from 'react-router-dom';
import CustomerModel from "../../../Models/CustomerModel";
import CompanyModel from "../../../Models/CompanyModel";
import globals from "../../../Services/Globals";
import axios from "axios";
import companyService from "../../../Services/CompanyService";

interface RouteParam {
    id: string;
    category: string;
}
interface CouponDetailsProps extends RouteComponentProps<RouteParam> {

}

interface CouponDetailsState {
    coupon: CouponModel;
    images: string[];
    clientType: string;
}

class CouponDetails extends Component<CouponDetailsProps, CouponDetailsState> {

    public constructor(props: CouponDetailsProps) {
        super(props);
        this.state = {
            coupon: null,
            images: [],
            clientType: null
        };
    }

    public componentDidMount() {
        try {
            const id = +this.props.match.params.id;
            const category = this.props.match.params.category;
            let coupon = getCategory("All").coupons.find(c => c.id === id);
            if (coupon === undefined) {
                coupon = getCategory(category).coupons.find(c => c.id === id);
                if (coupon === undefined) {
                    const clientType = store.getState().AuthState.clientType;
                    let user;
                    if (clientType) {
                        user = store.getState().AuthState.user;
                        coupon = getUserCategory("All", (user as CompanyModel | CustomerModel)).find(coupon => coupon.id === id);
                        if (coupon === undefined) {
                            coupon = getUserCategory(category, (user as CompanyModel | CustomerModel)).find(coupon => coupon.id === id);
                        }
                    }
                }
            }
            if (coupon !== undefined) {
                const type = store.getState().AuthState.clientType;
                this.setState({
                    coupon: coupon,
                    images: coupon.imagesNames,
                    clientType: type
                });
            } else {
                this.getCouponFromServer();
            }

        }
        catch (err) {
            notify.error(err);
        }
    }

    public getCouponFromServer = async () => {
        try {
            const id = +this.props.match.params.id;
            const headers = {
                'Id': id
            }
            let url = globals.urls.coupon;
            const response = await axios.get(url, { headers });
            const type = store.getState().AuthState.clientType;
            this.setState({
                coupon: response.data,
                images: response.data.imagesNames,
                clientType: type
            });
        } catch (err) {
            notify.error(err);
        }
    }

    public handlePurchase = () => {
        customerService.purchaseCoupon(this.state.coupon, (store.getState().AuthState.user as CustomerModel));
    }

    public handleDelete = () => {
        companyService.deleteCoupon(this.state.coupon);
    }

    public handleUpdate = () => {
        let path = `/company/update/${this.state.coupon.category}/${this.state.coupon.id}`;
        this.props.history.push(path);
    }

    public render(): JSX.Element {

        return (
            <div className="CouponDetails">
                {this.state.coupon &&
                    <>
                        <Typography variant="h2" component="h2" gutterBottom>
                            {this.state.coupon.title}
                        </Typography>

                        <h3>Price: {this.state.coupon.price}</h3>
                        <h3>Amount: {this.state.coupon.amount}</h3>
                        <h3>Description: {this.state.coupon.description}</h3>
                        <div id="images">
                            <Carousel width={600}>
                                {this.state.images?.map(imageName =>
                                    <div key={imageName}>
                                        <img src={globals.urls.images + this.state.coupon.category + "/" + this.state.coupon.id + "/" + imageName} />
                                    </div>
                                )}
                            </Carousel>
                        </div>
                        {store.getState().AuthState.user && this.state.clientType === "Customer" ?
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<ShoppingCartOutlinedIcon />}
                                onClick={this.handlePurchase}
                            >
                                Buy Now
                            </Button>
                            :
                            store.getState().AuthState.user && this.state.clientType === "Company" ?
                                <>
                                    <Button variant="contained" color="primary" size="large" onClick={this.handleUpdate}>
                                        Update
                                </Button>
                                &nbsp;
                                    <Button variant="contained" color="secondary" size="large" onClick={this.handleDelete}>
                                        Delete
                                </Button>
                                </>
                                : null
                        }
                        <br /> <br />
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            startIcon={<ArrowBackOutlinedIcon />}
                            onClick={this.props.history.goBack}
                        >
                            Back
                        </Button>
                        <br /> <br />
                    </>
                }
            </div>
        );
    }
}

export default withRouter(CouponDetails);
