// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// **Components Imports
import Edit from 'src/components/bill-entry/edit'
import Actions from 'src/components/bill-entry/actions'
// import AddNewCustomers from 'src/views/apps/invoice/add/AddNewCustomer'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { secureApi } from 'src/helpers/apiGenerator'
import { useRouter } from 'next/router'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import CircularProgress from '@mui/material/CircularProgress'

const EditBill = () => {
  const router = useRouter()
  const { id, company } = router.query
  const userDetails = useUserDetails()

  // ** State
  const [viewBillData, setViewBillData] = useState({
    dueDate: new Date(),
    tax: 0,
    discount: 0
  })
  const [addCustomerOpen, setAddCustomerOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [displayLoader, setDisplayLoader] = useState(false)
  const [updateLoader, setUpdateLoader] = useState(false)
  const [billDetails, setBillDetails] = useState({})
  const [companyDetails, setCompanyDetails] = useState({})

  // const [clients, setClients] = useState(apiClientData)
  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  const getBillDetails = async () => {
    setDisplayLoader(true)
    await secureApi
      .get(api_configs.stockInOut.getBillDetails, {
        params: {
          stockInward: id
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          setBillDetails(resp.data.allInwards[0])
          setDisplayLoader(false)
        }
      })
  }

  const getCompanyDetails = async () => {
    await secureApi.get(api_configs.company.getCompanyDetails, { params: { Co_ID: company } }).then(resp => {
      if (resp.status === 200) {
        setCompanyDetails(resp.data.companyDetails[0])
      }
    })
  }

  useEffect(() => {
    if (id && company) {
      getCompanyDetails()
      getBillDetails()
    }
  }, [id, company])

  useEffect(() => {}, [viewBillData])

  const saveBill = async () => {
    setUpdateLoader(true)
    await secureApi
      .patch(api_configs.stockInOut.updateBillEntry, {
        TaxPercent: viewBillData.tax,
        DiscountPercent: viewBillData.discount,
        BillAmount:
          billDetails.TotalAmount -
          (billDetails.TotalAmount * viewBillData.tax) / 100 -
          (billDetails.TotalAmount * viewBillData.discount) / 100,
        P_Stock_In_ID: billDetails.P_Stock_In_ID,
        user_id: userDetails.User_ID,
        DueOn:
          viewBillData.dueDate.getDate() +
          '-' +
          (parseInt(viewBillData.dueDate.getMonth()) + 1) +
          '-' +
          viewBillData.dueDate.getFullYear()
      })
      .then(resp => {
        if (resp.status === 200) {
          setUpdateLoader(false)
          router.back()
        }
      })
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xl={9} md={8} xs={12}>
          {!displayLoader ? (
            <Edit
              // clients={clients}
              invoiceNumber={1}
              companyDetails={companyDetails}
              billDetails={billDetails}
              viewBillData={viewBillData}
              setViewBillData={setViewBillData}
              // selectedClient={selectedClient}
              // setSelectedClient={setSelectedClient}
              toggleAddCustomerDrawer={toggleAddCustomerDrawer}
            />
          ) : null}
        </Grid>
        <Grid item xl={3} md={4} xs={12}>
          <Actions
            toggle={toggleAddCustomerDrawer}
            setSelectedClient={setSelectedClient}
            updateLoader={updateLoader}
            saveBill={() => saveBill()}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default EditBill
