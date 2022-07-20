export default {
    auth: {
        "login": "/api/auth/login",
    },
    user: {
        create: "/user/create",
        update: "/user/update",
        getAllCompanyUser: "user/get-all-companyuser",
        updateCompanyUser: "user/update-companyuser",
        getDivisions: "user/get-user-divisions"
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
        getAll: "/product/getAll",
        updateProductMaster: "/product/update-productMaster",
        updatePriceDetails: "/product/update-priceDetails",
        updateStockDetails: "/product/update-stockDetails",
        updateGSTDetails: "/product/update-gstDetails",
        getLowStockDetails: "/product/getLowStockDetails",
        getProductByID: "/product/getProductByID",
        getDivProducts: "/product/getDivProducts"
    },
    division: {
      getAll: "/division/get-all",
      createNew: "/division/create",
      update: "/division/update"
    },
    supplier: {
      getAll: "/supplier/getAll"
    },
    indent: {
      create: "/indent/create",
      getAll: "/indent/get-all",
    },
    stockInOut: {
      createStockInward: "stockInOut/createStockInward"
    }
}
