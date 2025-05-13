import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import NotFound from '~/pages/NotFound'
import Login from '~/pages/Login'
import { AppContext } from '~/contexts/app.context'
import LoginLayout from '~/layouts/LoginLayout'
import { useContext } from 'react'
import ManagerLayout from '~/layouts/ManagerLayout'
import Profile from '~/pages/Profile'
import Blogs from '~/pages/Blogs'
import AddBlog from '~/pages/AddBlog'



const useRouteElements = () => {
  function ProtecedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    console.log(isAuthenticated);
    return !isAuthenticated ? <Outlet /> : <Navigate to='login' />
  }
  function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    console.log(isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to='/' />
  }

  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: 'login',
          element: (
            <LoginLayout>
              <Login />
            </LoginLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtecedRoute />,
      children: [
        {
          path: '/',
          index: true,
          element: (
            <ManagerLayout>
              <>Trang chủ</>
            </ManagerLayout>
          )
        },
        {
          path: '/profile',
          element: (
            <ManagerLayout>
              <Profile />
            </ManagerLayout>
          )
        },

        {
          path: '/blogs',
          element: (
            <ManagerLayout>
              <Blogs />
            </ManagerLayout>
          )
        },



        {
          path: '/blogs/create',
          element: (
            <ManagerLayout>
              <AddBlog />
            </ManagerLayout>
          )
        },

        {
          path: '/blogs/edit/:slug',
          element: (
            <ManagerLayout>
              <AddBlog />
            </ManagerLayout>
          )
        },


      ]
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return routeElements
}
export default useRouteElements
