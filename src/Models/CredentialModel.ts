import AdminModel from "./AdminModel";
import CompanyModel from "./CompanyModel";
import CustomerModel from "./CustomerModel";

class CredentialModel{
    public email:string;
    public password: string;
    public clientType: "Company" | "Customer" | "Admin";
}
export default CredentialModel;