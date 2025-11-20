'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import axios from '../../axios'

   const ResetPassword= () => {

    const { id } = useParams()
    const navigate = useRouter()

    const [form, setForm] = useState({ password: '' })
    const [confirm, setConfirm] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (form.password !== confirm) {
            setError('❌ Passwords do not match')
            setLoading(false)
            return
        }

        if (form.password.length < 6) {
            setError('🔐 Password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            const res = await axios.put(`/auth/resetPassword/${id}`, form)
            setTimeout(() => navigate.push('/features/auth/login'), 1000)
        } catch (err) {
            console.log('error resetting password', err)
            setError(err.response?.data?.message || 'Something went wrong')
            setTimeout(() => setError(''), 3000)
        } finally {
            setLoading(false)
        }
    }


  return (
    <div className='w-full h-screen bg-[#F3F4F6] flex justify-center items-center'>
            <form
                onSubmit={handleSubmit}
                className='flex flex-col shadow-xl gap-6 items-center py-10 px-12 bg-white rounded-md w-[400px]'
            >
                <h1 className='text-3xl font-semibold'>Enter New Password</h1>

                <input
                    value={form.password}
                    onChange={handleChange}
                    name='password'
                    type='password'
                    placeholder='New password'
                    className='border outline-none py-2 px-2 w-full mt-2'
                />

                <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type='password'
                    placeholder='Confirm new password'
                    className='border outline-none py-2 px-2 w-full'
                />

                {error && (
                    <div className='bg-red-400 py-2 px-4 text-white text-center rounded w-full'>
                        {error}
                    </div>
                )}

                <button
                    type='submit'
                    disabled={loading}
                    className='cursor-pointer py-2 w-full text-white px-4 font-semibold bg-orange-700 hover:bg-orange-800 transition duration-300 rounded'
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
  )
}

export default ResetPassword