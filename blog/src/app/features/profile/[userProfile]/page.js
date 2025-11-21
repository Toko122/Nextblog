'use client'

import { useParams, useRouter } from 'next/navigation'
import axios from '../../../../lib/apiClient'
import React, { useEffect, useMemo, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import AddPost from '@/components/AddPost'
import Post from '../../../../components/Post'
import EditProfile from '@/components/EditProfile'
import { Button } from '@/components/ui/button'
import Friends from '@/components/Friends'

const UserProfile = () => {

     const { userProfile  } = useParams()
     const [userData, setUserData] = useState(null)
     const [loading, setLoading] = useState(true)
     const router = useRouter()
     const [editProfile, setEditProfile] = useState(false)

     const [profileImage, setProfileImage] = useState(null)

     const [openPostPopup, setOpenPostPopup] = useState(false)
     const [openFriends, setOpenFriends] = useState(false)

     const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
     const [isSendingRequest, setIsSendingRequest] = useState(false);

     const [friendError, setFriendError] = useState('')

     
useEffect(() => {
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`/friends/getAllFriends?userId=${userId}`);
      setPendingRequests(res.data.requests);
    } catch (err) {
      console.log(err);
    }
  };

  fetchRequests();
}, [userId]);

      useEffect(() => {
         const getProfileImage = async() => {
            try{
              const res = await axios.get(`/editProfile/image/getImage/${userProfile}`)
              setProfileImage(res.data.imageUrl)
            }catch(err){
              console.log(err);
            }
         }
         getProfileImage()
      }, [userProfile])

     useEffect(() => {

         const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
         if (!token) {
      
          router.replace('/features/auth/login')
          return
        }

         if (!userProfile ) return

         const fetchUser = async() => {
            try{
               const res = await axios.get(`/auth/${userProfile}`)
               setUserData(res.data.user)
            }catch(err){
              console.log(err);
            } finally {
              setLoading(false)
            }
         }

         fetchUser()
   
     }, [userProfile])

     const handleAddFriend = async(e) => {
         e.preventDefault()
         setLoading(true)
         try{
           const res = await axios.post(`/friends/addFriend`, {
              currentUserId: userId,
              targetUserId: userProfile
           })
           setIsSendingRequest(true)
         }catch(err){
          console.log(err);
         }finally{
            setLoading(false)
         }
     }

      const handleRemoveFriend = async () => {
    setLoading(true)
    try {
      await axios.delete('/friends/delete', { 
      data: { userId: userId, friendId: userProfile } 
    })
    setUserData(prev => ({
      ...prev,
      friends: prev.friends.filter(id => id !== userId)
    }))
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }


        const isFriend = useMemo(() => {
           if(userData && userData.friends){
            return userData.friends.includes(userId)
           }
           return false
        }, [userData, userId])
      

     useEffect(() => {
        const fetchFriends = async () => {
           try{
             const res = await axios.get(`friends/getAllFriends?userId=${userId}`)
           }catch(err){
            console.log(err)
           }
        }
        fetchFriends()
     }, [])

  if (loading) return <p className="w-full pt-24 text-center text-lg">Loading...</p>
  if (!userData) return <p className="w-full pt-24 text-center text-lg">User not found</p>

  return (
    <>
    <div className='w-full min-h-screen bg-gray-100 md:pt-28 pt-24 pb-14 flex justify-center px-4 md:px-8 lg:px-16'>
            <div className='flex flex-col gap-6 md:gap-8 w-full max-w-4xl'>

                <div className='flex flex-col md:flex-row md:justify-between items-center bg-white rounded-xl shadow-xl p-6 md:p-8 gap-4 md:gap-0 w-full transition-shadow duration-300 hover:shadow-2xl'>
                    
                    <div className='flex justify-start md:w-fit w-full items-center gap-5 md:px-0 px-4'>
                        
                        {profileImage ? (
                            <img 
                                src={profileImage} 
                                className='w-[80px] h-[80px] rounded-full object-cover border-4 border-white shadow-md' 
                                alt="Profile"
                            />
                        ) : (
                            <div className='rounded-full p-5 bg-gray-300 flex items-center justify-center w-[80px] h-[80px]'>
                                <FaUser className='text-gray-700 text-3xl md:text-4xl'/>
                            </div>
                        )}
                        
                        <div className='flex flex-col'>
                            <div className='text-xl md:text-2xl font-bold text-gray-900 select-none'>{userData?.username}</div>
                            
                            <span 
                                onClick={() => {
                                   if(userId !== userProfile){
                                    setOpenFriends(false)
                                    setFriendError("You can't open other users friends list")
                                    setTimeout(() => setFriendError(''), 2000)
                                   }else{
                                    setOpenFriends(true)
                                   }
                                }} 
                                className='text-base cursor-pointer font-medium text-blue-600 hover:text-blue-700 transition-colors'
                            >
                                {userData?.friends.length} friends
                            </span>

                              {
                                friendError && <div className='bg-red-500 mt-2 rounded-md py-1 px-2 text-white'>{friendError}</div>
                              }

                        </div>
                    </div>

                    
                    <div className='flex flex-col md:flex-row gap-3 md:gap-4 mt-4 md:mt-0 md:w-fit w-full'>
                        
                        {userProfile === userId ? (
                            <>
                                <button onClick={() => setOpenPostPopup(true)} className='flex items-center gap-2 justify-center text-white cursor-pointer font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-2 rounded-lg shadow-md hover:shadow-lg w-full md:w-auto'>
                                    <IoMdAdd className='text-lg md:text-xl' />
                                    <span>Add Post</span>
                                </button>

                                <button onClick={() => setEditProfile(true)} className='flex items-center gap-2 justify-center cursor-pointer text-white font-semibold bg-gray-700 hover:bg-gray-800 transition-colors px-4 py-2 rounded-lg shadow-md hover:shadow-lg w-full md:w-auto'>
                                    <MdEdit className='text-lg md:text-xl' />
                                    <span>Edit Profile</span>
                                </button>
                            </>
                        ) : (
              
                         <>
                            <Button 
                                 onClick={isFriend ? handleRemoveFriend : handleAddFriend}
                                  
                                 disabled={loading} 
                                 className={`
                                    cursor-pointer py-2 px-6 text-white text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300 w-full md:w-auto
                                    ${loading ? 'bg-gray-400' : 
                                       isFriend ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
                                `}
                               >
                                 {isSendingRequest
                                     ? "Sent"
                                     : loading
                                     ? "Loading..."
                                     : isFriend
                                     ? <Button onClick={() => handleRemoveFriend(userData._id)}>Remove Friend</Button>
                                     : "Add Friend"}
                              </Button>
                     </>
              )}
                        
                    </div>

                </div>
                <Post userProfile={userProfile} />
                
            </div>
        </div>

     {
      openPostPopup && (
        <AddPost onClose={() => setOpenPostPopup(false)} />
      )
     }


      {
        editProfile && (
          <EditProfile onClose={() => setEditProfile(false)}/>
        )
      }
    
      {
        openFriends && (
          <Friends profileId={userProfile}  onClose={() => setOpenFriends(false)} />
        )
      }

    </>
  )
}

export default UserProfile
