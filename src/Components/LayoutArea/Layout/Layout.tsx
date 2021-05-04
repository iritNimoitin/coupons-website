import { Toolbar } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import Header from "../../HeaderArea/Header/Header";
import HideAppBar from "../../HeaderArea/HideAppBar/HideAppBar";
import Routing from "../../Routing/Routing";
import BackToTop from "../BackToTop/BackToTop";
import Footer from "../Footer/Footer";
import "./Layout.css";

function Layout(): JSX.Element {
    return (
		<BrowserRouter>
            <div className='Layout'>
                {/* <header>
                    <Toolbar></Toolbar>
                    <HideAppBar children = {<Header/>}/>
                </header> */}
                <HideAppBar children = {<Header/>}/>
                {/* <aside>
                
                </aside> */}

                {/* <main>
                    <Routing/>
                </main>

                <footer>
                    <Footer/>
                </footer> */}
            </div>
        </BrowserRouter>
    );
}

export default Layout;
