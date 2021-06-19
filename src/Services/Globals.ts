class Globals {

}

class DevelopmentGlobals extends Globals {
    public urls = {
        admin: {
            shutDown: "http://localhost:8080/api/Admin/shutdown/",
            company: "http://localhost:8080/api/Admin/companies/one/",
            customer: "http://localhost:8080/api/Admin/customer/one/",
            companies: "http://localhost:8080/api/Admin/companies/",
            customers: "http://localhost:8080/api/Admin/customers/",
            companyCoupons: "http://localhost:8080/api/Admin/companies/one/coupons/",
            customerCoupons: "http://localhost:8080/api/Admin/customers/one/coupons/"
        },
        company: {
            details: "http://localhost:8080/api/Company/details/",
            coupons: "http://localhost:8080/api/Company/coupons/",
            couponsByMaxPrice: "http://localhost:8080/api/Company/max-price/",
            couponsByCategory: "http://localhost:8080/api/Company/coupons/category/"
        },
        customer: {
            details: "http://localhost:8080/api/Customer/details/",
            coupons: "http://localhost:8080/api/Customer/coupons/",
            couponsByMaxPrice: "http://localhost:8080/api/Customer/max-price/",
            couponsByCategory: "http://localhost:8080/api/Customer/coupons/category/"
        },
        auth: {
            register: "http://localhost:8080/Auth/register/",
            login: "http://localhost:8080/Auth/login/",
            token: "http://localhost:8080/Auth/token/"
        },
        images: "http://localhost:8080/pics/",
        coupons: "http://localhost:8080/App/coupons/",
        coupon: "http://localhost:8080/App/coupons/one/"
    };

}

class productionGlobal extends Globals {
    public urls = {
        admin: {
            shutDown: "http://localhost:8080/api/Admin/shutdown/",
            company: "http://localhost:8080/api/Admin/companies/one/",
            customer: "http://localhost:8080/api/Admin/customer/one/",
            companies: "http://localhost:8080/api/Admin/companies/",
            customers: "http://localhost:8080/api/Admin/customers/",
            companyCoupons: "http://localhost:8080/api/Admin/companies/one/coupons/",
            customerCoupons: "http://localhost:8080/api/Admin/customers/one/coupons/"
        },
        company: {
            details: "http://localhost:8080/api/Company/details/",
            coupons: "http://localhost:8080/api/Company/coupons/",
            couponsByMaxPrice: "http://localhost:8080/api/Company/max-price/",
            couponsByCategory: "http://localhost:8080/api/Company/coupons/category/"
        },
        customer: {
            details: "http://localhost:8080/api/Customer/details/",
            coupons: "http://localhost:8080/api/Customer/coupons/",
            couponsByMaxPrice: "http://localhost:8080/api/Customer/max-price/",
            couponsByCategory: "http://localhost:8080/api/Customer/coupons/category/"
        },
        auth: {
            register: "http://localhost:8080/Auth/register/",
            login: "http://localhost:8080/Auth/login/",
            token: "http://localhost:8080/Auth/token/"

        },
        images: "http://localhost:8080/pics/",
        coupons: "http://localhost:8080/App/coupons/",
        coupon: "http://localhost:8080/App/coupons/one/"
    };
}
const globals = process.env.NODE_ENV === "development" ? new DevelopmentGlobals() : new productionGlobal();

export default globals;