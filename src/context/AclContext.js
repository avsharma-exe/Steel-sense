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
    if (user.role === 'admin') {
      return [
        {
            title: 'Dashboard',
            path: '/home',
            icon: HomeOutline
          },
         
        {
          title: 'Create Company',
          path: '/add-company',
          icon: Company
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
