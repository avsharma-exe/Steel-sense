// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// acl
import { useAcl } from 'src/hooks/useAcl'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

export const getHomeRoute = (role, homeURL) => {
  console.log(homeURL);
  if (role === 'client') return '/acl'
  else return '/home'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const acl = useAcl()
  console.log(acl.userMenu())
  const menu = acl ? acl.userMenu().find(item => item.title === 'Dashboard') : null
  const homeURL = menu.path

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (auth.user && auth.user.role) {
      // const homeRoute = getHomeRoute(auth.user.role, homeURL)
      // console.log(homeRoute);

      // Redirect user to Home URL
      router.replace(homeURL)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default Home
