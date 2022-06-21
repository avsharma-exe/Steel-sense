export default {
    auth: {
        "login": "/api/auth/login",
    },
    user: {
        create: "/user/create",
        update: "/user/update",
        getAllCompanyUser: "user/get-all-companyuser"
    },
    company: {
        createNew: "/company/create",
        getAll: "/company/get-all",
        updateCompany: "/company/update",
        getCompanyDetails: "/company/get-companyDetails",
        updateCompanyDetails : "/company/updateDetails"
    },
    role: {
        create: "/role/create",
        getAll: "/role/get-all",
        updateRole: '/role/update'
    },
    locality: {
      getCountries: "/locality/get-countries",
      getStates: "/locality/get-states",
      getCities: "/locality/get-cities",
    },
    product: {
        create: "/product/create",
        getAll: "/product/getAll"
    }
}
