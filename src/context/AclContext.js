// ** React Imports
import { createContext, useEffect, useState } from 'react'

// icons
import Users from 'mdi-material-ui/AccountGroupOutline'
import Company from 'mdi-material-ui/Domain'
import DatabaseOutline from 'mdi-material-ui/DatabaseOutline'
import DatabaseArrowDownOutline from 'mdi-material-ui/DatabaseArrowDownOutline'
import DatabaseArrowUpOutline from 'mdi-material-ui/DatabaseArrowUpOutline'
import ClipboardListOutline from 'mdi-material-ui/ClipboardListOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'

import ShieldOutline from 'mdi-material-ui/ShieldOutline'
// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import api_configs from 'src/configs/api_configs'
import { useAuth } from 'src/hooks/useAuth'

// ** Defaults
const defaultProvider = {
  user: null,
  userMenu: () => []
}
const AclContext = createContext(defaultProvider)

const AclProvider = ({ children }) => {
  // ** States
  const { user } = useAuth()

  const getUserMenu = () => {
    switch (user.role) {
      case 'admin':
        return [
          {
            title: 'Dashboard',
            path: '/home',
            icon: HomeOutline
          },

          {
            title: 'Create Company',
            path: '/admin/add-company',
            icon: Company
          }
        ]

      case 'L1':
        return [
          {
            title: 'Dashboard',
            path: '/l1/dashboard',
            icon: HomeOutline
          },
          {
            title: 'Inventory',
            path: '/inventory',
            icon: DatabaseOutline
          },
          {
            title: 'Divisions',
            path: '/l1/divisions',
            icon: ShieldOutline
          },
          {
            title: 'Users',
            path: '/l1/users',
            icon: AccountOutline
          },
          {
            title: 'Approve Voucher',
            path: '/l1/approve-voucher',
            icon: ShieldOutline
          }
        ]
      case 'L2':
        return [
          {
            title: 'Dashboard',
            path: '/l2/dashboard',
            icon: HomeOutline
          },
          {
            title: 'Inventory',
            path: '/inventory',
            icon: DatabaseOutline
          },
          {
            title: 'Bill Entry',
            path: '/l2/bill-entry',
            icon: DatabaseArrowDownOutline
          },
          {
            title: 'Invoice Due',
            path: '/l2/invoice-due',
            icon: DatabaseArrowUpOutline
          },
          {
            title: 'Quotation',
            path: '/l2/quotation',
            icon: ClipboardListOutline
          },
          {
            title: 'Purchase Order',
            path: '/l2/purchase-order',
            icon: ClipboardListOutline
          }
        ]
      case 'L3':
        return [
          {
            title: 'Dashboard',
            path: '/l3/dashboard',
            icon: HomeOutline
          },
          {
            title: 'Inventory',
            path: '/inventory',
            icon: DatabaseOutline
          },
          {
            title: 'Stock Inward',
            path: '/l3/stockInward',
            icon: DatabaseArrowDownOutline
          },
          {
            title: 'Stock Usage',
            path: '/l3/stockOutward',
            icon: DatabaseArrowUpOutline
          },
          {
            title: 'Indent',
            path: '/l3/indent',
            icon: ClipboardListOutline
          }
        ]
    }
  }

  const values = {
    user,
    userMenu: getUserMenu
  }

  return <AclContext.Provider value={values}>{children}</AclContext.Provider>
}

export { AclContext, AclProvider }
