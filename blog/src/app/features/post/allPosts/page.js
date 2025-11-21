'use client'

import axios from '../../../../lib/apiClient'
import { FaUser } from 'react-icons/fa'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AllPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const userId = typeof window !== 'undefined'
    ? localStorage.getItem('userId')
    : null

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/post/allPost')
        setPosts(res.data.posts)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const goToProfile = (userId) => {
    router.push(`/features/profile/${userId}`)
  }

  return (
    <div className='flex flex-col items-center justify-center p-4 gap-6 pt-24'>

      {loading ? (
        <p className='text-gray-600 text-lg'>Loading...</p>
      ) : posts.length > 0 ? (
        posts.map(post => (
          <div
            key={post._id}
            className='bg-white rounded-xl p-6 flex flex-col gap-6 w-full md:w-[750px] 
                       border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300'
          >

            <div className='flex items-center gap-3 cursor-pointer w-fit' onClick={() => goToProfile(post.userId?._id)}>
                          {post.userId?.imageUrl ? (
                            <img
                              src={post.userId.imageUrl}
                              alt='profile'
                              className='w-12 h-12 rounded-full object-cover border border-gray-300'
                            />
                          ) : (
                            <div className='w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center'>
                              <FaUser className='text-white text-xl' />
                            </div>
                          )}
                          <div className='flex flex-col'>
                            <span className='font-semibold text-gray-800'>
                              {post.userId?.username || 'Unknown'}
                            </span>
                            <span className='text-sm text-gray-500 select-none'>
                              {new Date(post.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

          
            <div className='flex flex-col gap-3'>
              <h2 className='text-lg font-semibold text-gray-900'>{post.title}</h2>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt='post'
                  className='rounded-lg w-full object-cover max-h-[600px]'
                />
              )}

              {post.caption && (
                <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
                  {post.caption}
                </p>
              )}
            </div>

          </div>
        ))
      ) : (
        <p className='text-gray-500 text-center w-full text-lg'>No posts yet.</p>
      )}

    </div>
  )
}

export default AllPosts
