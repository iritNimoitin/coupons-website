import { Component } from "react";
import axios from "axios";
import CouponModel from "../../../Models/CouponModel";
import store, { getCategory } from "../../../Redux/Stores";
import "./CouponsList.css";
import globals from "../../../Services/Globals";
import { couponsDownloadedAction } from "../../../Redux/CouponsState";
import notify from "../../../Services/Notification";
import CouponCard from "../CouponCard/CouponCard";
import { RouteComponentProps, withRouter } from "react-router";
import PagesToggle from "../PagesToggle/PagesToggle";

interface RouteParam{
    category: string;
}

interface CouponListProps extends RouteComponentProps<RouteParam>{
    
}

interface CouponsListState {
	coupons: CouponModel[];
    category: string;
    page: number;
    numOfPages: number;
    totalElements: number;
}

class CouponsList extends Component<CouponListProps, CouponsListState> {

    public constructor(props: CouponListProps) {
        super(props);
        this.state = {
            coupons: [],
            category: this.props.match.params.category || '',
            page: 0,
            numOfPages: 0,
            totalElements: 0
        };
    }

    public componentDidMount() {
        this.getCoupons();
    }

    private getCoupons(){
        //only if we dont have our products in the app state - get them from the server :
        if (getCategory(this.state.category).length === 0){
            this.getCouponsFromServer();
        } else {
            this.setState({ coupons: getCategory(this.state.category) });
        }
    }

    private async getCouponsFromServer() {
        try{
            const category = this.props.match.params.category || "";
            const itemsPerPage = this.state.page !== this.state.numOfPages-1 ? 4 :  this.state.totalElements-(this.state.page * 4);
            const headers = {
                'pageNumber': this.state.page,
                'itemsPerPage': itemsPerPage,
                'sortBy': 'price',
                'category': category
            }
            let url = globals.urls.coupons;
            if(category !== ''){
                url = url + "category/";
            }
            //get products from the server:
            const response = await axios.get(url, {headers});
            //update app state:
            store.dispatch(couponsDownloadedAction(response.data.content, category));
            //update local state:
            this.setState({
                coupons: response.data.content,
                totalElements: response.data.totalElements
            });
            if(this.state.page !== this.state.numOfPages-1){
                this.setState({
                    numOfPages: response.data.totalPages
                })
            }
        }catch (err) {
            notify.error(err);
        }
    }

    public handlePageChange = (page: number) => {
        this.setState({page: page-1})
    }

    public componentDidUpdate(prevProps: CouponListProps, prevState: CouponsListState) {
        if(this.state.category !== this.props.match.params.category && this.props.match.params.category !== undefined) {
            this.setState({
                category: this.props.match.params.category || '',
                page: 0,
                numOfPages: 0
            });
            this.getCoupons();
        } else if(this.state.page !== prevState.page) {
            this.getCouponsFromServer();
        }
    }

    public render(): JSX.Element {
        return (
            <div className="CouponsList">
                {this.state.category !== '' && <h3>{this.state.category}</h3>}
				{this.state.coupons.map(c => <CouponCard key={c.id} coupon={c} />)}
                {this.state.numOfPages > 1 && 
                <PagesToggle pageNumber={this.state.page+1} numberOfPages={this.state.numOfPages} handlePageChange={this.handlePageChange} />}
            </div>
        );
    }
}

export default withRouter(CouponsList);
