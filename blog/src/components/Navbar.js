'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { HiMenuAlt3 } from "react-icons/hi";
import { useAuth } from '@/app/features/auth/AuthProvider';
import { FaUser } from "react-icons/fa";
import axios from '@/lib/apiClient';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState(false)
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const navRef = useRef(null)
  const { loggedIn, logout } = useAuth()
  
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenUserMenu(false)
        setSearchOpen(false)
        setOpenMenu(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get('/auth/allUsers')
        setUsers(res.data.users)
      } catch (err) {
        console.error('Error fetching users:', err)
      }
    }
    getUsers()
  }, [])

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredUsers([])
      setSearchOpen(false)
      return
    }

    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(inputValue.toLowerCase())
    )
    setFilteredUsers(filtered)
    setSearchOpen(true)
  }, [inputValue, users])

  const handleLogout = () => {
    logout()
    setOpenMenu(false)
    setOpenUserMenu(false)
    router.push('/features/auth/login')
  }

  return (
    <nav ref={navRef} className="h-[70px] fixed w-full px-6 md:px-8 lg:px-24 xl:px-32 flex items-center justify-between z-30 bg-gradient-to-r from-indigo-700 to-violet-500 transition-all">

      <Link onClick={() => { setOpenMenu(false); setOpenUserMenu(false) }} href='/' className='select-none cursor-pointer text-2xl text-white'>
        NextBlog
      </Link>

      <div className='relative md:flex hidden'>
        <input
          className='border-white text-white border outline-none rounded-[20px] w-[400px] py-1.5 px-3 bg-transparent placeholder-white'
          placeholder='Search user...'
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => inputValue && setSearchOpen(true)}
        />
        {searchOpen && filteredUsers.length > 0 && (
          <div className="absolute pt-1 top-[101%] left-0 bg-white w-full rounded-md shadow-md max-h-[250px] overflow-y-auto z-40">
            {filteredUsers.map((user) => (
              <Link
                key={user._id}
                href={`/features/profile/${user._id}`}
                onClick={() => {
                  if(!loggedIn){
                    router.push('/auth/login')
                  }
                  setInputValue('')
                  setSearchOpen(false)
                }}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <div className='flex gap-2 items-center'>
                   {user.imageUrl ? (
                    <img src={user.imageUrl} className='w-[35px] h-[35px] rounded-full object-cover' />
                  ) : (
                    <FaUser className='w-[35px] h-[35px] rounded-full object-cover text-sm'/>
                  )}
                
                <div className=''>{user.username}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {searchOpen && filteredUsers.length === 0 && inputValue.trim() !== '' && (
          <div className="absolute top-[110%] left-0 bg-white w-full rounded-md shadow-md p-2 text-gray-500 z-40">
            No users found
          </div>
        )}
      </div>

      {loggedIn ? (
        <div onClick={() => setOpenUserMenu(!openUserMenu)} className='cursor-pointer md:flex hidden rounded-full p-2.5 relative'>
         
          {(() => {
            const currentUser = users.find(u => u._id === userId)
         if (currentUser?.imageUrl) {
          return (
             <img
                src={currentUser.imageUrl}
                alt='profile'
                className='w-11 h-11 rounded-full object-cover'
               />
              )
           }

             return (
              <div className='bg-white p-2.5 rounded-full'>
                <FaUser className='text-black text-[20px]' />
              </div>
             )
          })()}
     
        {openUserMenu && (
  <div
    className= "absolute top-13 -left-12 right-0 w-40 bg-white shadow-lg border border-gray-100 rounded-xl py-2 animate-dropdown flex flex-col overflow-hidden z-50">
    <Link
      href={`/features/profile/${userId}`}
      onClick={() => { setOpenMenu(false); setOpenUserMenu(false) }}
      className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition select-none text-center cursor-pointer"
    >
      Profile
    </Link>

    <button
      onClick={handleLogout}
      className="px-4 py-2 text-center cursor-pointer text-gray-700 hover:bg-red-50 hover:text-red-600 transition select-none"
    >
      Logout
    </button>
  </div>
)}
        </div>
      ) : (
        <Link
          onClick={() => { setOpenMenu(false); setOpenUserMenu(false) }}
          href="/features/auth/login"
          className="bg-white select-none cursor-pointer text-gray-700 md:flex hidden py-2.5 h-fit text-sm hover:opacity-90 active:scale-95 transition-all w-30 rounded-full items-center justify-center"
        >
          Get started
        </Link>
      )}

      <div
        onClick={() => setOpenMenu(!openMenu)}
        className="inline-block md:hidden active:scale-90 transition"
      >
        <HiMenuAlt3 className='text-2xl text-white cursor-pointer' />
      </div>

      {openMenu && (
        <div className="absolute top-[70px] left-0 w-full bg-gradient-to-r from-indigo-700 to-violet-500 p-6 flex md:hidden z-20">
          <div className='w-full flex flex-col gap-4'>
           
            <div className='relative md:hidden flex'>
              <input
                className='border-white text-white border outline-none rounded-[20px] w-full py-1.5 px-3 bg-transparent placeholder-white'
                placeholder='Search user...'
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => inputValue && setSearchOpen(true)}
              />
              {searchOpen && filteredUsers.length > 0 && (
                <div className="absolute pt-1 top-[101%] left-0 bg-white w-full rounded-md shadow-md max-h-[250px] overflow-y-auto z-40">
                  {filteredUsers.map((user) => (
                     <Link
                     key={user._id}
                     href={loggedIn ? `/features/profile/${user._id}` : '/features/auth/login'}
                     onClick={() => {
                       setInputValue('')
                       setSearchOpen(false)
                       setOpenMenu(false)
                     }}
                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                   >
                <div className='flex gap-2 items-center'>
                   {user.imageUrl ? (
                    <img src={user.imageUrl} className='w-[30px] h-[30px] rounded-full object-cover' />
                  ) : (
                    <FaUser className='w-[30px] h-[30px] rounded-full object-cover text-sm'/>
                  )}
                
                <div className=''>{user.username}</div>
                </div>
              </Link>
                  ))}
                </div>
              )}
            </div>

            {loggedIn ? (
              <div onClick={() => setOpenUserMenu(!openUserMenu)} className='md:hidden flex flex-col gap-2 relative'>
                <Link href={`/features/profile/${userId}`} onClick={() => { setOpenMenu(false); setOpenUserMenu(false) }} className='w-full select-none bg-white rounded-[20px] py-2 px-2 text-center '>Profile</Link>
                <Link href='/features/auth/login' onClick={handleLogout} className='w-full select-none bg-white rounded-[20px] py-2 px-2 text-center'>Logout</Link>
              </div>
            ) : (
              <Link
                onClick={() => { setOpenMenu(false); setOpenUserMenu(false) }}
                href="/features/auth/login"
                className="bg-white cursor-pointer select-none text-gray-700 md:hidden flex w-full py-2.5 h-fit text-sm hover:opacity-90 active:scale-95 transition-all rounded-full items-center justify-center"
              >
                Get started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
