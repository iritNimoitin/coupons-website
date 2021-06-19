import { BrowserRouter } from "react-router-dom";
import Header from "../../HeaderArea/Header/Header";
import HideAppBar from "../../HeaderArea/HideAppBar/HideAppBar";
import Footer from "../Footer/Footer";
import "./Layout.css";

function Layout(): JSX.Element {
    return (
        <BrowserRouter>
            <div className='Layout'>
                <div className="bar">
                    <HideAppBar children={<Header />} />
                </div>
                <footer>
                    <Footer />
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default Layout;
