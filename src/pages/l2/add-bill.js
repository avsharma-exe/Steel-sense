// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'


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
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

const AddBill = () => {
  const router = useRouter()
  const userDetails = useUserDetails()
  const [companyDetails, setCompanyDetails] = useState({})
  const [allSuppliers, setAllSuppliers] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [addNewSupplier, setAddNewSupplier] = useState({
    show: false
  })

  const [showLoader, setShowLoader] = useState(false)

  const [productList, setProductList] = useState([
    {
      product: {},
      qty: 0,
      pricePerPiece: 0,
      total: 0
    }
  ])

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
    await secureApi
      .get(api_configs.product.getAllProducts, {
        params: {
          company: userDetails.Co_ID
        }
      })
      .then(resp => {
        if (resp.status === 200) setAllProducts(resp.data.allProducts)
      })
  }

  const saveBill = async () => {
    setShowLoader(!showLoader)
    await secureApi
      .post(api_configs.billEntry.saveNewBill, {
        Co_ID: userDetails.Co_ID,
        supplier: selectedClient,
        products: productList
      })
      .then(resp => {
        if (resp.status === 200) {
          toast.success('Bill Created')
          setShowLoader(!showLoader)
          router.back()
        }
      })
  }

  useEffect(() => {
    Promise.all([getCompanyDetails(), getAllSuppliers(), getAllProducts()])
  }, [])

  return (
    <>
      <AddSupplier
        show={addNewSupplier.show}
        handleClose={() => {
          getAllSuppliers()
          setAddNewSupplier({ ...addNewSupplier, show: !addNewSupplier.show })
        }}
      />
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          <Add
            companyDetails={companyDetails}
            clients={allSuppliers}
            products={allProducts}
            setSelectedClient={setSelectedClient}
            selectedClient={selectedClient}
            handleAddNewCustomer={() => setAddNewSupplier({ ...addNewSupplier, show: !addNewSupplier.show })}
            productList={productList}
            setProductList={setProductList}
          />
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          {showLoader ? (
            <CircularProgress
              sx={{
                color: 'common.black',
                width: '20px !important',
                height: '20px !important',
                mr: theme => theme.spacing(2)
              }}
            />
          ) : (
            <Actions saveBill={() => saveBill()} updateLoader={false} />
          )}
        </Grid>
      </Grid>
      <AddSupplier />
    </>
  )
}

export default AddBill
