import React from 'react'
import UserProfile from '../UserProfile'
import UserProfileGuard from '../UserProfileGuard'

const ProfilePage = () => {
  return (
    <>
       <UserProfileGuard>
          <UserProfile />
       </UserProfileGuard>
    </>
  )
}

export default ProfilePage