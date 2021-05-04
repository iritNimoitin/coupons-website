import "./Logo.css";
import LogoImage from "../../../Assests/Images/Coupons_logo.png"

function Logo(): JSX.Element {
    return (
        <div className="Logo">
			<img src={LogoImage}/>
        </div>
    );
}

export default Logo;
