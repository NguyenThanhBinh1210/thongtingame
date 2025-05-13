import { Tabs, Tab } from '@nextui-org/react'
import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import TabPassword from '~/components/Profile/TabPassword'
import TabProfileSetting from '~/components/Profile/TabProfileSetting'
import { AppContext } from '~/contexts/app.context'
const Profile = () => {
  const { isSecurity } = useContext(AppContext)
  const location = useLocation()
  const tabValue = (location.state as { tabValue: string | null })?.tabValue

  return (
    <div>
      <div className='flex w-full flex-col'>
        <Tabs defaultSelectedKey={tabValue || 'profile-settings'} aria-label='Options' variant='underlined'>
          <Tab key='profile-settings' title='Profile Settings'>
            <TabProfileSetting />
          </Tab>
          <Tab key='password' href={!isSecurity ? 'security-code' : ''} title='Password'>
            <TabPassword />
          </Tab>

        </Tabs>
      </div>
    </div>
  )
}

export default Profile
