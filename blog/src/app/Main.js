'use client'

import axios from '@/lib/apiClient'
import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Main(){
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const isInView = (element) => {
      const rect = element.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > 0
  }

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true)
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
        const seen = JSON.parse(localStorage.getItem(`seenPosts_${userId}`) || '[]')

        const res = await axios.get('/post/allPost')
        const filtered = res.data.posts
          .filter(post => !seen.includes(post._id))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        
        setPosts(filtered)

      } catch (err) {
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    getPosts()
  }, [])

    useEffect(() => {
         const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
         const key = `seenPosts_${userId}`;

         const handleScroll = () => {
            posts.forEach((post) => {
                const element = document.getElementById(post._id)

                if(element && isInView(element)){
                   const existing = JSON.parse(localStorage.getItem(key) || '[]')

                  if(!existing.includes(post._id)){
                      const updated = [...existing, post._id]
                      localStorage.setItem(key, JSON.stringify(updated));
                  }

                }
                
            })
         }

          window.addEventListener('scroll', handleScroll);
          handleScroll();
          return () => window.removeEventListener('scroll', handleScroll);

  }, [posts])

  const goToProfile = (userId) => {
    router.push(`/features/profile/${userId}`)
  }

  return (
    <div className='flex flex-col items-center justify-center p-4 gap-6 pt-24'>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length > 0 ? (
        posts.map(post => (
          <div
            key={post._id}
            id={post._id}
            className='bg-white rounded-lg py-5 px-5 flex flex-col gap-4 w-full md:w-[700px] border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300'
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
              <h2 className='text-lg font-medium text-gray-900'>{post.title}</h2>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt='Post'
                  className='rounded-lg w-full object-cover max-h-[500px]'
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <div className='flex flex-col gap-1'>
          <p className='text-gray-500 text-center w-full'>No new posts.</p>
          <Link href={'/features/post/allPosts'} className='text-indigo-500 hover:text-indigo-700 transition duration-200'>View All Posts</Link>
        </div>
      )}
    </div>
  )
}
