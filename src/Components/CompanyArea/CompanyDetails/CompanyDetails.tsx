import React, { useEffect } from "react";
import CompanyModel from "../../../Models/CompanyModel";
import store from "../../../Redux/Stores";
import "./CompanyDetails.css";

function CompanyDetails(): JSX.Element {
    const [company, setCompany] = React.useState<CompanyModel>(null);

    useEffect(() => {
        setCompany((store.getState().AuthState.user as CompanyModel))
    }, []);

    return (
        <div className="CompanyDetails">
			{company && 
                <>
                    <h2>{company.name}</h2>
                    <h5>{company.email}</h5>
                </>
            }
        </div>
    );
}

export default CompanyDetails;
