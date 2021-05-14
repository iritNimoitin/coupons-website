import jwtDecode, { JwtPayload } from 'jwt-decode';
import AdminModel from "../Models/AdminModel";
import CompanyModel from "../Models/CompanyModel";
import CustomerModel from "../Models/CustomerModel";

export default function getUserFromToken(token: string, clientType: string): CustomerModel | CompanyModel | AdminModel {
    const user = jwtDecode<JwtPayload>(token);
    switch(clientType) {
      case "Customer":
        return {
          id: +user.jti,
          firstName: (user as CustomerModel).firstName,
          lastName: (user as CustomerModel).lastName,
          email: user.sub,
          password: (user as CustomerModel).password,
          token: token
        };
      case "Company":
        return {
          id: +user.jti,
          name: (user as CompanyModel).name,
          email: user.sub,
          password: (user as CompanyModel).password,
          token: token
        };
      case "Administrator":
        return {
          id: +user.jti,
          email: user.sub,
          password: (user as AdminModel).password,
          token: token
        };
    }
  }