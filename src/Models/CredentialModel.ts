import AdminModel from "./AdminModel";
import CompanyModel from "./CompanyModel";
import CustomerModel from "./CustomerModel";

class CredentialModel{
    public email:string;
    public password: string;
    public clientType?: CompanyModel | CustomerModel | AdminModel;
}
export default CredentialModel;