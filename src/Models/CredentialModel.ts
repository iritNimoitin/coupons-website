
class CredentialModel {
    public email: string;
    public password: string;
    public clientType: "Company" | "Customer" | "Admin";
}
export default CredentialModel;