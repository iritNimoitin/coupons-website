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
import TablePagination from '@material-ui/core/TablePagination';

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
    itemsPerPage: number;
    totalElements: number;
}

class CouponsList extends Component<CouponListProps, CouponsListState> {

    public constructor(props: CouponListProps) {
        super(props);
        this.state = {
            coupons: [],
            category: this.props.match.params.category || "All",
            page: 0,
            numOfPages: 0,
            itemsPerPage: 8,
            totalElements: 0
        };
    }

    public componentDidMount() {
        this.getCoupons();
    }

    private getCoupons() {
        const category = this.props.match.params.category || "All";
        const index = this.state.page * this.state.itemsPerPage;
        if (getCategory(category).coupons.length === 0) {
            this.getCouponsFromServer();
        } else {
            this.setState({
                coupons: getCategory(category).coupons.filter((coupon, i) => i >= index && i < index + this.state.itemsPerPage),
                category: category,
                numOfPages: getCategory(category).numOfPages,
                totalElements: getCategory(category).totalElements
            });
        }
    }

    private async getCouponsFromServer() {
        try {
            let category = this.props.match.params.category || "";
            const headers = {
                'sortBy': 'price',
                'category': category
            }
            let url = globals.urls.coupons;
            if (category !== "") {
                url = url + "category/";
            } else {
                category = "All";
            }
            const response = await axios.get(url, { headers });
            this.setState({
                coupons: response.data.filter((coupon: CouponModel, i: number) => i >= 0 && i < this.state.itemsPerPage),
                numOfPages: Math.round(response.data.length / this.state.itemsPerPage),
                totalElements: response.data.length
            })
            store.dispatch(couponsDownloadedAction(response.data, category, this.state.numOfPages, response.data.length));
        } catch (err) {
            notify.error(err);
        }
    }

    public componentDidUpdate(prevProps: CouponListProps, prevState: CouponsListState) {
        const category = this.props.match.params.category || "All";
        if (prevProps.match.params.category !== category && this.props.match.params.category !== undefined) {
            this.getCoupons();
        } else if (this.state.page !== prevState.page) {
            this.getCoupons();
        } else if (this.state.itemsPerPage !== prevState.itemsPerPage) {
            this.getCoupons();
        }
    }

    public handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        this.setState({
            page: newPage
        })
    };

    public handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        this.setState({
            itemsPerPage: parseInt(event.target.value),
            page: 0
        })
    };

    public render(): JSX.Element {
        return (
            <div className="CouponsList">
                <TablePagination
                    component="div"
                    count={this.state.totalElements}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    rowsPerPage={this.state.itemsPerPage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    rowsPerPageOptions={[4, 8]}
                />
                <div className="couponsCards">
                    {this.state.coupons.map(c => c && <CouponCard key={c.id} coupon={c} />)}
                </div>
                <br />
                <br />
            </div>
        );
    }
}

export default withRouter(CouponsList);
