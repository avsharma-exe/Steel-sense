export default {
    auth: {
        "login": "/api/auth/login",
    },
    user: {
        create: "/user/create"
    },
    company: {
        createNew: "/company/create",
        getAll: "/company/get-all",
        updateCompany: "/company/update",
        getCompanyDetails: "/company/get-companyDetails"
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
