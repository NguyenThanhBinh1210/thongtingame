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
import CreateTFTChampion from '~/pages/CreateTFTChampion'
import TFTItems from '~/pages/TFTItems'
import TFTItemCreate from '~/pages/TFTItemCreate'
import CreateWRChampion from '~/pages/CreateWRChampion'
import Counters from '~/pages/Counters'
import CreateCounter from '~/pages/CreateCounter'
import WRBuilds from '~/pages/WRBuilds'
import CreateWRBuild from '~/pages/CreateWRBuild'



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
          path: '/champions/edit/:slug',
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
          path: '/tft-champions/create',
          element: (
            <ManagerLayout>
              <CreateTFTChampion />
            </ManagerLayout>
          )
        },
        {
          path: '/tft-items',
          element: (
            <ManagerLayout>
              <TFTItems />
            </ManagerLayout>
          )
        },
        {
          path: '/tft-items/create',
          element: (
            <ManagerLayout>
              <TFTItemCreate />
            </ManagerLayout>
          )
        },
        {
          path: '/tft-items/edit/:slug',
          element: (
            <ManagerLayout>
              <TFTItemCreate />
            </ManagerLayout>
          )
        },
        {
          path: '/tft-champions/edit/:slug',
          element: (
            <ManagerLayout>
              <CreateTFTChampion />
            </ManagerLayout>
          )
        },
        {
          path: '/wr-champions/edit/:slug',
          element: (
            <ManagerLayout>
              <CreateWRChampion />
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
          path: '/counters',
          element: (
            <ManagerLayout>
              <Counters />
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
          path: '/wr-builds',
          element: (
            <ManagerLayout>
              <WRBuilds />
            </ManagerLayout>
          )
        },
        {
          path: '/wr-builds/create',
          element: (
            <ManagerLayout>
              <CreateWRBuild />
            </ManagerLayout>
          )
        },
        {
          path: '/wr-builds/edit/:slug',
          element: (
            <ManagerLayout>
              <CreateWRBuild />
            </ManagerLayout>
          )
        },
        {
          path: '/counters/create',
          element: (
            <ManagerLayout>
              <CreateCounter />
            </ManagerLayout>
          )
        },
        {
          path: '/counters/edit/:slug',
          element: (
            <ManagerLayout>
              <CreateCounter />
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
