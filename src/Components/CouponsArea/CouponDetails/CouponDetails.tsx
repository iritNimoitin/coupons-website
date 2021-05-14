import { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import "./CouponDetails.css";
import CouponModel from "../../../Models/CouponModel";
import LogoImage from "../../../Assests/Images/Coupons_logo.png"
import store, { getCategory } from "../../../Redux/Stores";
import Button from '@material-ui/core/Button';
import notify from "../../../Services/Notification";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import Purchase from "../../CustomerArea/Purchase/Purchase";
import axios from "axios";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";

interface RouteParam{
   id: string;
   category: string;
}
interface CouponDetailsProps extends RouteComponentProps<RouteParam>{
	
}

interface CouponDetailsState {
	coupon: CouponModel;
}

class CouponDetails extends Component<CouponDetailsProps, CouponDetailsState> {

    public constructor(props: CouponDetailsProps) {
        super(props);
        this.state = {coupon:null}; 
    }

    public async componentDidMount() {
        try {
            const id = +this.props.match.params.id;//the + is for converting string to number 
            const category = this.props.match.params.category;
            let coupon = getCategory("").find(c => c.id === id);
            if(coupon == undefined){
                coupon = getCategory(category).find(c => c.id === id);
            }
            this.setState({ coupon });
        }
        catch (err) {
            notify.error(err);
        }
    }
    

    public handlePurchase = () => {
        this.purchaseCoupon();
    }

    private async purchaseCoupon() {
        try {
          const headers = {
            'token': store.getState().AuthState.user.token,
            'couponId': this.state.coupon.id
          }
          await jwtAxios.put(globals.urls.customer.coupons, null, {headers});
          notify.success("You have been successfully purchasing the coupon.");
        }
        catch(err) {
          notify.error(err);
        }
    }

    public render(): JSX.Element {
        

        return (
            <div className="CouponDetails">
                {this.state.coupon && 
                    <>
                        <h2>Coupon Details</h2>
                        <h3>Title: {this.state.coupon.title}</h3>
                        <h3>Price: {this.state.coupon.price}</h3>
                        <h3>Amount: {this.state.coupon.amount}</h3>
                        <h3>Description: {this.state.coupon.description}</h3>
                        <img src={LogoImage}/>
                        {/* <img src={globals.urls.couponImages + this.state.coupon.imageName}/> */}
                        {store.getState().AuthState.user != null && <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<ShoppingCartOutlinedIcon />}
                            onClick={this.handlePurchase}
                        >
                            Buy Now
                        </Button>}
                        <br /> <br />
                        <NavLink to ="/coupons">Back</NavLink>
                    </>
                }
            </div>
        );
    }
}

export default CouponDetails;
