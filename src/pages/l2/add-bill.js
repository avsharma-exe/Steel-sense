// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Components Import
import Add from 'src/components/add-bill/add'
import Actions from 'src/components/add-bill/actions'
import AddSupplier from 'src/components/add-bill/addSupplier'

// ** Helper Import
import { secureApi } from 'src/helpers/apiGenerator'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'

const AddBill = () => {
  const userDetails = useUserDetails()
  const [companyDetails, setCompanyDetails] = useState({})
  const [allSuppliers, setAllSuppliers] = useState([])
  const [allProducts , setAllProducts] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)

  const getCompanyDetails = async () => {
    await secureApi.get(api_configs.company.getCompanyDetails, { params: { Co_ID: userDetails.Co_ID } }).then(resp => {
      if (resp.status === 200) {
        setCompanyDetails(resp.data.companyDetails[0])
      }
    })
  }

  const getAllSuppliers = async () => {
    await secureApi
      .get(api_configs.supplier.getAll, {
        params: {
          coid: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) setAllSuppliers(resp.data.allCompanies)
      })
  }

  const getAllProducts = async () => {
    await secureApi.get(api_configs.product.getAll, {
      params: {
        company: userDetails.Co_ID,
        div_id: userDetails.Div_ID
      }
    }).then(resp => {
      if(resp.status === 200) setAllProducts(resp.data.allProducts)

    })
  }

  useEffect(() => {
    Promise.all([getCompanyDetails(), getAllSuppliers(), getAllProducts()])
  }, [])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <Add
            companyDetails={companyDetails}
            clients={allSuppliers}
            products={allProducts}
            setSelectedClient={setSelectedClient}
            selectedClient={selectedClient}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <Actions saveBill={() => {}} updateLoader={false} />
        </Grid>
      </Grid>
      <AddSupplier />
    </>
  )
}

export default AddBill
