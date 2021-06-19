import LogoImage from "../../../Assests/Images/Coupons_logo.png"

function Logo(): JSX.Element {
    return (
        <div className="Logo">
            <img src={LogoImage} width="120" height="50" />
        </div>
    );
}

export default Logo;
