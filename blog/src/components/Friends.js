'use client'

import axios from '@/lib/apiClient'
import React, { useEffect, useRef, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { Spinner } from './ui/spinner'
import Link from 'next/link'

const Friends = ({onClose}) => {

      const [friends, setFriends] = useState([])

      const [loading, setLoading] = useState(false)

      const modalRef = useRef()

      useEffect(() => {
         const fetchFriends = async() => {
             setLoading(true)
             try{ 
               const userId = localStorage.getItem('userId');
               const res = await axios.get(`/friends/getAllFriends?userId=${userId}`)
               setFriends(res.data.friends)
             }catch(err){
                
                 console.log(err);
                
             }finally{
                setLoading(false)
             }
         }
         fetchFriends()
      }, [])

      useEffect(() => {
         const handleClickOutside = (e) => {
            if(modalRef.current && !modalRef.current.contains(e.target)){
                onClose()
            }
         }
         window.addEventListener('mousedown', handleClickOutside)
         return () => window.removeEventListener('mousedown', handleClickOutside)
      }, [])

  return (
    <div className='fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4'> 
        <div ref={modalRef} className='bg-white rounded-2xl p-6 flex flex-col w-full max-w-md shadow-2xl gap-5 transform transition-all duration-300'>
            
            <div className='flex w-full items-center justify-between border-b pb-3 border-gray-200'>
                <h1 className='text-2xl font-semibold text-gray-800'>All Friends ({friends.length})</h1>
                <IoMdClose 
                    onClick={onClose} 
                    className='text-gray-500 hover:text-red-500 transition duration-200 cursor-pointer text-2xl'
                />
            </div>

            <div className='flex flex-col space-y-3 overflow-y-auto max-h-[60vh] pr-2'>
                {loading ? (
                    <div className='flex justify-center items-center gap-3 py-6'>
                        <Spinner />
                        <span className='text-gray-600 font-medium'>Loading...</span>
                    </div>
                ) : friends.length > 0 ? (
                    friends.map((friend) => (
                        <Link href={`/features/profile/${friend._id}`} 
                            key={friend._id} 
                            className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 cursor-pointer border border-gray-100' 
                        >
                            {friend.imageUrl ? (
                                <img
                                    src={friend.imageUrl}
                                    alt='profile'
                                    className={`rounded-full object-cover border-2 border-indigo-400`}
                                />
                            ) : (
                                <div className={`rounded-full bg-indigo-500 p-2 flex items-center justify-center`}> 
                                    <FaUser className={`text-white text-2xl`} />
                                </div>
                            )}
                            <h1 className='text-lg font-medium text-gray-700'>{friend.username}</h1>
                        </Link>
                    ))
                ) : (
                    <p className='text-center text-gray-500 py-6'>Friends Not Found.</p>
                )}
            </div>

        </div>
    </div>
  )
}

export default Friends