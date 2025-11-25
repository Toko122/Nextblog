'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const UserProfileGuard = ({ children }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/features/auth/login')
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return <p className="text-center pt-24">Loading...</p>

  return <>{children}</>
}

export default UserProfileGuard
