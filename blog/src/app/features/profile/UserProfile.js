'use client'

import { useParams, useRouter } from 'next/navigation'
import axios from '../../../lib/apiClient'
import React, { useEffect, useMemo, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import AddPost from '@/components/AddPost'
import Post from '../../../components/Post'
import EditProfile from '@/components/EditProfile'
import { Button } from '@/components/ui/button'
import Friends from '@/components/Friends'

const UserProfile = () => {

  const { userProfile } = useParams()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [friendLoading, setFriendLoading] = useState(false)
  const router = useRouter()

  const [editProfile, setEditProfile] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [openPostPopup, setOpenPostPopup] = useState(false)
  const [openFriends, setOpenFriends] = useState(false)
  const [friendError, setFriendError] = useState('')
  const [requestSent, setRequestSent] = useState(false)
  const [pendingRequest, setPendingRequest] = useState(false)

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

   useEffect(() => {
      const checkPending = async() => {
         try{
           const res = await axios.get(`/friends/addFriend?senderId=${userId}&targetUserId=${userProfile}`)
           if(res.data.pending){
              setPendingRequest(true)
           }
         }catch(err){
          console.log(err);
         }
      }
      if (userId && userProfile) checkPending()
   }, [userId, userProfile])

  useEffect(() => {
    const getProfileImage = async () => {
      try {
        const res = await axios.get(`/editProfile/image/getImage/${userProfile}`)
        setProfileImage(res.data.imageUrl)
      } catch (err) {
        console.log(err)
      }
    }
    getProfileImage()
  }, [userProfile])

  const fetchUser = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
         if (!token) {
           router.replace("/features/auth/login")
           return
         }
         
        const res = await axios.get(`/auth/${userProfile}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserData(res.data.user)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    if (userProfile) fetchUser()
  }, [userProfile])

  const isFriend = useMemo(() => {
    if (!userData || !userData.friends) return false
    return userData.friends.map(String).includes(String(userId))
  }, [userData, userId])

  const handleAddFriend = async () => {
    setFriendLoading(true)
    try {
      await axios.post(`/friends/addFriend`, {
        currentUserId: userId,
        targetUserId: userProfile,
      })
      setRequestSent(true)
      setPendingRequest(true)
    } catch (err) {
      console.log(err)
    } finally {
      setFriendLoading(false)
    }
  }

  const handleRemoveFriend = async () => {
    setFriendLoading(true)
    try {
      await axios.delete("/friends/delete", {
        data: { userId, friendId: userProfile },
      })

      setUserData((prev) => ({
        ...prev,
        friends: prev.friends.filter((id) => String(id) !== String(userId)),
      }))
      setPendingRequest(false)
    } catch (err) {
      console.log(err)
    } finally {
      setFriendLoading(false)
    }
  }

  const handleCancelRequest = async () => {
      setFriendLoading(true);
        try {
          await axios.delete("/friends/addFriend", {
            data: { senderId: userId, targetUserId: userProfile },
          });

          setPendingRequest(false);
        } catch (err) {
          console.log(err);
        } finally {
          setFriendLoading(false);
        }      
    }

    useEffect(() => {
      const refresh = () => {
          fetchUser()
      }
      window.addEventListener('friends-updated', refresh)
      return () => window.removeEventListener('friends-updated', refresh)
    }, [])

  if (loading) return <p className="text-center pt-24 text-lg">Loading...</p>
  if (!userData) return <p className="text-center pt-24 text-lg">User not found</p>

  return (
    <>
      <div className="w-full min-h-screen bg-gray-100 md:pt-28 pt-24 pb-14 flex justify-center px-4 md:px-8 lg:px-16">
        <div className="flex flex-col gap-6 md:gap-8 w-full max-w-4xl">

          <div className="flex flex-col md:flex-row md:justify-between items-center bg-white rounded-xl shadow-xl p-6 md:p-8 gap-4 md:gap-0 w-full">

            <div className="flex items-center gap-5">
              {profileImage ? (
                <img
                  src={profileImage}
                  className="w-[80px] h-[80px] rounded-full object-cover border-4 border-white shadow-md"
                  alt="Profile"
                />
              ) : (
                <div className="rounded-full p-5 bg-gray-300 flex items-center justify-center w-[80px] h-[80px]">
                  <FaUser className="text-gray-700 text-3xl" />
                </div>
              )}

              <div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">{userData.username}</div>

                <span
                  onClick={() => {
                    if (userId !== userProfile) {
                      setFriendError("You can't open other users friends list")
                      setTimeout(() => setFriendError(""), 2000)
                    } else {
                      setOpenFriends(true)
                    }
                  }}
                  className="text-base cursor-pointer font-medium text-blue-600 hover:text-blue-700"
                >
                  {userData.friends.length} friends
                </span>

                {friendError && (
                  <div className="bg-red-500 mt-2 rounded-md py-1 px-2 text-white">
                    {friendError}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4 md:mt-0">
              {userProfile === userId ? (
                <>
                  <Button
                    onClick={() => setOpenPostPopup(true)}
                    className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white"
                  >
                    <IoMdAdd />
                    Add Post
                  </Button>

                  <Button
                    onClick={() => setEditProfile(true)}
                    className="bg-gray-700 cursor-pointer hover:bg-gray-800 text-white"
                  >
                    <MdEdit />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  {isFriend ? (
                    <Button
                      onClick={handleRemoveFriend}
                      disabled={friendLoading}
                      className="bg-red-500 cursor-pointer hover:bg-red-600 text-white"
                    >
                      {friendLoading ? "Removing..." : "Remove Friend"}
                    </Button>
                  ) : pendingRequest ? (
                    <Button
                      onClick={handleCancelRequest}
                      disabled={friendLoading}
                      className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white"
                    >
                      {friendLoading ? "Canceling..." : "Cancel Request"}
                    </Button>
                          ) : (
                          <Button
                           onClick={handleAddFriend}
                           disabled={friendLoading}
                      className="bg-green-500 cursor-pointer hover:bg-green-600 text-white"
                    >
                      {friendLoading ? "Sending..." : "Add Friend"}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          <Post userProfile={userProfile} />
        </div>
      </div>

      {openPostPopup && <AddPost onClose={() => setOpenPostPopup(false)} />}
      {editProfile && <EditProfile onClose={() => setEditProfile(false)} />}
      {openFriends && (
        <Friends profileId={userProfile} onClose={() => setOpenFriends(false)} />
      )}
    </>
  )
}

export default UserProfile
