// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import api_configs from 'src/configs/api_configs'
import useUserDetails from 'src/hooks/useUserDetails'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState(defaultProvider.isInitialized)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    setUser(localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null)
    // const initAuth = async () => {
    //   setIsInitialized(true)
    //   const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    //   if (storedToken) {
    //     setLoading(true)
    //     await axios
    //       .get(authConfig.meEndpoint, {
    //         headers: {
    //           Authorization: storedToken
    //         }
    //       })
    //       .then(async response => {
    //         setLoading(false)
    //         setUser({ ...response.data.userData })
    //       })
    //       .catch(() => {
    //         localStorage.removeItem('userData')
    //         localStorage.removeItem('accessToken')
    //         setUser(null)
    //         setLoading(false)
    //       })
    //   } else {
      // setLoading(false)
    //   }
    // }
    // initAuth()
    setLoading(false)
  }, [])

  const handleLogin = (params, errorCallback) => {
    axios
      .post(api_configs.auth.login, params)
      .then(async res => {
        if (res.data && !res.data.error) {
          console.log(res)
          await window.localStorage.setItem('accessToken', res.data.token);
          // storing user divisions as array
          await window.localStorage.setItem('userDivisions', res.data.companyDivisionDetails.map(div => div.Div_ID));
          await window.localStorage.setItem('userData', JSON.stringify(res.data.user));

          setUser({ ...res.data.user })
          
          switch(res.data.user.role){
            case "L1":
              router.replace("/l1/dashboard")
              break;

            case "L2":
              router.replace("/l2/dashboard")
              break;

            case "L3":
              router.replace("/l3/dashboard")
              break;
          }
          
          const returnUrl = router.query.returnUrl
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          
          
          router.replace(redirectURL)
        }

        return errorCallback(res.data)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
