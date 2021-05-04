import { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import "./CouponDetails.css";
import CouponModel from "../../../Models/CouponModel";
import LogoImage from "../../../Assests/Images/Coupons_logo.png"
import { getCategory } from "../../../Redux/Stores";
import notify from "../../../Services/Notification";

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

    public render(): JSX.Element {
        
        return (
            <div className="CouponDetails">
                {this.state.coupon && 
                    <>
                        <h2>Coupon Details</h2>
                        <h3>Title: {this.state.coupon.title}</h3>
                        <h3>Price: {this.state.coupon.price}</h3>
                        <h3>Amount: {this.state.coupon.amount}</h3>
                        <img src={LogoImage}/>
                        {/* <img src={globals.urls.couponImages + this.state.coupon.imageName}/> */}
                        <br /> <br />
                        <NavLink to ="/coupons">Back</NavLink>
                    </>
                }
            </div>
        );
    }
}

export default CouponDetails;
