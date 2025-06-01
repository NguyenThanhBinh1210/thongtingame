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
import GameGaming from '~/pages/GameGaming'
import CreatePCBuild from '~/pages/CreatePCBuild'
import SearchHistoryMatch from '~/pages/SearchHistoryMatch'
import Accounts from '~/pages/Accounts'
import Champions from '~/pages/Champions'
import Comment from '~/pages/Comment'
import TFTChampions from '~/pages/TFTChampions'
import WRChampions from '~/pages/WRChampions'
import CreateChampion from '~/pages/CreateChampion'



const useRouteElements = () => {
  function ProtecedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return isAuthenticated ? <Outlet /> : <Navigate to='login' />
  }
  function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
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
              <Blogs />
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
          path: '/gameming',
          element: (
            <ManagerLayout>
              <GameGaming />
            </ManagerLayout>
          )
        },
        {
          path: '/accounts',
          element: (
            <ManagerLayout>
              <Accounts />
            </ManagerLayout>
          )
        },
        {
          path: '/champions',
          element: (
            <ManagerLayout>
              <Champions />
            </ManagerLayout>
          )
        },
        {
          path: '/champions/create',
          element: (
            <ManagerLayout>
              <CreateChampion />
            </ManagerLayout>
          )
        },
        {
          path: '/tft-champions',
          element: (
            <ManagerLayout>
              <TFTChampions />
            </ManagerLayout>
          )
        },
        {
          path: '/wr-champions',
          element: (
            <ManagerLayout>
              <WRChampions />
            </ManagerLayout>
          )
        },
        {
          path: '/:any/comments',
          element: (
            <ManagerLayout>
              <Comment />
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
          path: '/gameming/create',
          element: (
            <ManagerLayout>
              <CreatePCBuild />
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
        {
          path: '/gameming/edit/:slug',
          element: (
            <ManagerLayout>
              <CreatePCBuild />
            </ManagerLayout>
          )
        },
        {
          path: '/gameming/lol-history',
          element: (
            <ManagerLayout>
              <SearchHistoryMatch />
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
