import React, { useEffect } from "react";
import CustomerModel from "../../../Models/CustomerModel";
import store from "../../../Redux/Stores";
import "./CustomerDetails.css";

function CustomerDetails(): JSX.Element {
    const [customer, setCustomer] = React.useState<CustomerModel>(null);

    useEffect(() => {
        setCustomer((store.getState().AuthState.user as CustomerModel))
    }, []);

    return (
        <div className="CustomerDetails">
			{customer && 
                <>
                    <h2>{customer.firstName} {customer.lastName}</h2>
                    <h5>{customer.email}</h5>
                </>
            }
        </div>
    );
}

export default CustomerDetails;
