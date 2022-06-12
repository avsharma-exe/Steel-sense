// ** React Imports
import { createContext, useEffect, useState } from 'react'

// icons
import Users from 'mdi-material-ui/AccountGroupOutline'
import Company from 'mdi-material-ui/Domain'
import HomeOutline from 'mdi-material-ui/HomeOutline'

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
          },

          {
            title: 'Update Company',
            path: '/admin/update-company',
            icon: Company
          }
        ]

      case 'SuperAdmin':
        return [
          {
            title: 'Dashboard',
            path: '/l1/dashboard',
            icon: HomeOutline
          },
          {
            title: 'Inventory',
            path: '/inventory',
            icon: Company
          },
          {
            title: 'Approve Voucher',
            path: '/l1/approve-voucher',
            icon: ShieldOutline
          },

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
