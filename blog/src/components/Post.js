'use client'

import axios from '../app/features/auth/axios'
import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { Spinner } from './ui/spinner'

const Post = ({ userProfile }) => {
  const [userData, setUserData] = useState(null)
  const [postsData, setPostsData] = useState([])
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
  const [deletingId, setDeletingId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(`/auth/${userProfile}`)
        setUserData(res.data.user)
      } catch (err) {
        console.error('Error fetching user data:', err)
      }
    }
    if (userProfile) getUserData()
  }, [userProfile])

  useEffect(() => {
    const getPosts = async () => {
       setLoading(true)
      try {
        const res = await axios.get(`/post/userPost/${userProfile}`)
        const filteredPost = res.data.posts.filter(post => post.userId  === userProfile)
        setPostsData(filteredPost)
      } catch (err) {
        console.error('Error fetching posts:', err)
      }finally{
        setLoading(false)
      }
    }
    if (userProfile) getPosts()
  }, [userProfile])

  
     const handleDelete = async(postId) => {
         try{
           setDeletingId(postId)
           const token = typeof window !== "undefined" ? localStorage.getItem('token') : null
           const res = await axios.delete(`/post/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
           })
           setPostsData(postsData.filter(post => post._id !== postId))
         }catch(err){
          console.log(err);
         }finally{
            setDeletingId(null)
         }
     }
  

  return (
    <div className='flex flex-col items-center justify-center gap-6'>
        {
          loading ? (
            <>Loading</>
          ) : (
            postsData.length > 0 ? (
        postsData.map((post) => (
          <div
            key={post._id}
            className='bg-white max-h-[800px] rounded-lg py-5 px-5 flex flex-col gap-6 items-center w-full md:w-[750px] border border-gray-200 shadow-sm'
          >
           
            {userData ? (
              <div className='flex justify-between items-center w-full'>
                <div className='flex items-center gap-4'>
                  {userData.imageUrl ? (
                    <img
                      src={userData.imageUrl}
                      alt='profile'
                      className='w-14 h-14 rounded-full object-cover border border-gray-200'
                    />
                  ) : (
                    <div className='md:w-14 md:h-14 w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center'>
                      <FaUser className='text-white text-1xl md:text-2xl' />
                    </div>
                  )}

                  <div className='flex flex-col'>
                    <span className='text-lg font-semibold'>{userData.username}</span>
                    <span className='text-sm text-gray-500 select-none'>
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                 {post.userId === userId && (
                     deletingId === post._id ? (
                       <Spinner />
                     ) : (
                       <MdDelete
                         onClick={() => handleDelete(post._id)}
                         className='text-red-500 cursor-pointer hover:text-red-600 transition duration-300 text-2xl'
                       />
                     )
                  )}
                   

              </div>
            ) : (
              <p className='text-gray-500 text-center'>Loading user...</p>
            )}

       
            <div className='flex flex-col gap-3 w-full'>
              <h2 className='text-lg font-medium px-2'>{post.title}</h2>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt='Post'
                  className='rounded-lg w-full object-cover h-full'
                />
              )}

              
            </div>
          </div>
        ))
      ) : (
        <p className='text-gray-500 text-center w-full'>No posts yet.</p>
      )
          )
        }
    </div>
  )
}

export default Post
