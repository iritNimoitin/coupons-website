import "./Home.css";
import couponGif from "../../../Assests/Gifs/coupon.gif";
import CouponsList from "../../CouponsArea/CouponsList/CouponsList";

import { match } from 'react-router';
import globals from "../../../Services/Globals";
import axios from "axios";
import notify from "../../../Services/Notification";
import React from "react";

function Home(): JSX.Element {

    return (
        <div className="Home">
			{/* <div>
                <img src={couponGif} width="40%" height="20%" className="couponGif"/>
            </div> */}
            <CouponsList/>
        </div>
    );
}

export default Home;
