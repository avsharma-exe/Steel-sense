// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// ** Third Party Components

// **Components Imports

import ViewBillComponent from 'src/components/bill-entry/viewBill'
import Actions from 'src/components/bill-entry/download-action'
// import AddNewCustomers from 'src/views/apps/invoice/add/AddNewCustomer'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { secureApi } from 'src/helpers/apiGenerator'
import { useRouter } from 'next/router'

import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'
import CircularProgress from '@mui/material/CircularProgress'

const PrintBill = ({ context }) => {
  const router = useRouter()
  const { id, supplier } = router.query
  const userDetails = useUserDetails()

  // ** State
  const [viewBillData, setViewBillData] = useState({
    dueDate: new Date(),
    tax: 0,
    discount: 0,
    invoiceNumber: '',
    subTotal: 0,
    total: 0
  })
  const [addCustomerOpen, setAddCustomerOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [displayLoader, setDisplayLoader] = useState(false)
  const [updateLoader, setUpdateLoader] = useState(false)
  const [billDetails, setBillDetails] = useState({})
  const [billProducts, setBillProducts] = useState([])
  const [companyDetails, setCompanyDetails] = useState({})
  const [supplierDetails, setSupplierDetails] = useState({})

  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  const getBillDetails = async () => {
    setDisplayLoader(true)
    await secureApi
      .get(api_configs.billEntry.getBillEntryDetails, {
        params: {
          billEntry: id
        }
      })
      .then(resp => {
        if (resp.status === 200) {
          setBillDetails(resp.data.billEntryDetails)
          setBillProducts(resp.data.billEntryProducts)
          setDisplayLoader(!displayLoader)
        }
      })
  }

  const getCompanyDetails = async () => {
    await secureApi.get(api_configs.company.getCompanyDetails, { params: { Co_ID: userDetails.Co_ID } }).then(resp => {
      if (resp.status === 200) {
        setCompanyDetails(resp.data.companyDetails[0])
      }
    })
  }

  const getSupplierDetails = async () => {
    await secureApi.get(api_configs.company.getCompanyDetails, { params: { Co_ID: supplier } }).then(resp => {
      if (resp.status === 200) {
        setSupplierDetails(resp.data.companyDetails[0])
      }
    })
  }

  useEffect(() => {
    if (id && supplier) {
      Promise.all([getCompanyDetails(), getBillDetails(), getSupplierDetails()])
    }
  }, [id, supplier])

  useEffect(() => {}, [viewBillData])

  const saveBill = async () => {
    setUpdateLoader(true)
    await secureApi
      .patch(api_configs.billEntry.saveBill, {
        Bill_Entry_ID: id,
        Bill_Name: viewBillData.invoiceNumber,
        status: 49,
        Tax: viewBillData.tax,
        Discount: viewBillData.discount,
        Total: viewBillData.total,
        SubTotal: viewBillData.subTotal,
        InvoiceDate:
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
      <ViewBillComponent
        invoiceNumber={1}
        companyDetails={companyDetails}
        billDetails={billDetails.length != 0 ? billDetails[0] : {}}
        billProducts={billProducts}
        viewBillData={viewBillData}
        setViewBillData={() => setViewBillData()}
        supplierDetails={supplierDetails}
        toggleAddCustomerDrawer={toggleAddCustomerDrawer}
        billId={id}
      />
    </>
  )
}

export default PrintBill
