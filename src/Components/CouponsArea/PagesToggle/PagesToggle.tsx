import Pagination from "@material-ui/lab/Pagination";
import { Component } from "react";
import "./PagesToggle.css";

interface PagesToggleProps {
    pageNumber: number;
    numberOfPages: number;
    handlePageChange: (page: number) => void;
}

class PagesToggle extends Component<PagesToggleProps> {

    public constructor(props: PagesToggleProps) {
        super(props);
    }

    public render(): JSX.Element {

        const handleClick = (event: object, page: number) => {
            this.props.handlePageChange(page)
        }

        return (
            <div className="PagesToggle">
				<Pagination color='primary' variant='outlined' style={{ color: 'blue' }} count={this.props.numberOfPages} page={this.props.pageNumber} onChange={handleClick} />
            </div>
        );
    }
}

export default PagesToggle;
