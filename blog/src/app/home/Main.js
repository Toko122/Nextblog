'use client'

import React, { useEffect, useState } from 'react'
import axios from '../features/auth/axios'
import { useRouter } from 'next/navigation'
import { FaUser } from 'react-icons/fa'
import Link from 'next/link'

export default function MainComp() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true)
      try {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
        const seen = JSON.parse(localStorage.getItem(`seenPosts_${userId}`) || '[]')
        const res = await axios.get('/post/allPost')
        const filtered = res.data.posts
          .sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt))
          .filter(post => !seen.includes(post._id))
        setPosts(filtered)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    getPosts()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 pt-24">
      {loading ? <p>Loading...</p> : posts.length > 0 ? (
        posts.map(post => (
          <div key={post._id} className="bg-white rounded-lg py-5 px-5 w-full md:w-[700px] border shadow-md hover:shadow-lg">
            <div className="flex items-center gap-3 cursor-pointer" onClick={()=>router.push(`/features/profile/${post.userId?._id}`)}>
              {post.userId?.imageUrl ? (
                <img src={post.userId.imageUrl} alt="profile" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center">
                  <FaUser className="text-white text-xl"/>
                </div>
              )}
              <div>
                <span className="font-semibold">{post.userId?.username || 'Unknown'}</span>
                <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <h2 className="text-lg font-medium mt-2">{post.title}</h2>
            {post.imageUrl && <img src={post.imageUrl} alt="post" className="w-full max-h-[500px] object-cover rounded-lg mt-2" />}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">
          <p>No new posts</p>
          <Link href="/features/post/allPosts" className="text-indigo-500 hover:text-indigo-700">View All Posts</Link>
        </div>
      )}
    </div>
  )
}
