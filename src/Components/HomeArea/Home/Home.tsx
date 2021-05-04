import "./Home.css";
import couponGif from "../../../Assests/Gifs/coupon.gif";
import CouponsList from "../../CouponsArea/CouponsList/CouponsList";

import { match } from 'react-router';

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
