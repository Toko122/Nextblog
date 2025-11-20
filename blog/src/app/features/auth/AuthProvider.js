'use client'

import { jwtDecode } from 'jwt-decode'
import React, { createContext, useContext, useEffect, useState } from 'react'

const authContext = createContext()

const AuthProvider = ({children}) => {

    const [userId, setUserId] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)

    const login = (token, id) => {
        localStorage.setItem('token', token)
        localStorage.setItem('userId', id)
        setUserId(id)
        setLoggedIn(true)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        setUserId(null)
        setLoggedIn(false)
    }

    
       const autoLogout = (token) => {
          const decode = jwtDecode(token)
          const currentTime = Date.now() / 1000
          if(decode.exp < currentTime){
            logout()
          }else{
            setLoggedIn(true)
          }
       }
       
       useEffect(() => {
          const token = localStorage.getItem('token')
            if (token) {
            autoLogout(token)
          } 
       }, [])

  return (
    <authContext.Provider value={{login, logout, loggedIn, userId, autoLogout}}>
        {children}
    </authContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => useContext(authContext)