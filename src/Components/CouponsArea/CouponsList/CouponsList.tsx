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

interface RouteParam {
    category: string;
}

interface CouponListProps extends RouteComponentProps<RouteParam> {

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

    private getCoupons() {
        const category = this.props.match.params.category || "";
        const index = this.state.page * 8;
        if (!getCategory(category).coupons[index]) {
            this.getCouponsFromServer();
        } else {
            this.setState({
                coupons: getCategory(category).coupons.slice(index, index + 8),
                category: category,
                numOfPages: getCategory(category).numOfPages,
                totalElements: getCategory(category).totalElements
            });
        }
    }

    private async getCouponsFromServer() {
        try {
            const category = this.props.match.params.category || "";
            const itemsPerPage = this.state.page !== this.state.numOfPages - 1 ? 8 : this.state.totalElements - (this.state.page * 8);
            const headers = {
                'pageNumber': this.state.page,
                'itemsPerPage': itemsPerPage,
                'sortBy': 'price',
                'category': category
            }
            let url = globals.urls.coupons;
            if (category !== '') {
                url = url + "category/";
            }
            const response = await axios.get(url, { headers });
            this.setState({
                coupons: response.data.content,
                totalElements: response.data.totalElements
            });
            let pages = this.state.numOfPages;
            if (this.state.page !== this.state.numOfPages - 1) {
                pages = response.data.totalPages;
                this.setState({
                    numOfPages: response.data.totalPages
                })
            }
            console.log(response.data.content);
            store.dispatch(couponsDownloadedAction(response.data.content, category, this.state.page * 8, itemsPerPage, pages, response.data.totalElements));
        } catch (err) {
            notify.error(err);
        }
    }

    public handlePageChange = (page: number) => {
        this.setState({ page: page - 1 });
    }

    public componentDidUpdate(prevProps: CouponListProps, prevState: CouponsListState) {
        const category = this.props.match.params.category || '';
        if (prevProps.match.params.category !== category && this.props.match.params.category !== undefined) {
            this.getCoupons();
        } else if (this.state.page !== prevState.page) {
            this.getCoupons();
        }
    }

    public render(): JSX.Element {
        return (//some coupons came as null!
            <div className="CouponsList">
                {this.state.coupons.map(c => c && <CouponCard key={c.id} coupon={c} />)}
                {this.state.numOfPages >= 1 &&
                    <PagesToggle pageNumber={this.state.page + 1} numberOfPages={this.state.numOfPages} handlePageChange={this.handlePageChange} />}
                <br />
                <br />
            </div>
        );
    }
}

export default withRouter(CouponsList);
