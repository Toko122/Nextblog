'use client'

import axios from '../../../../lib/apiClient'
import React, { useState } from 'react'

const ForgotPassword = () => {

      const [form, setForm] = useState({email: ''})
      const [loading, setLoading] = useState(false)
      const [success, setSuccess] = useState('')
      const [error, setError] = useState('')       

      const handleSubmit = async(e) => {
          e.preventDefault()

          setError('')
          setSuccess('')
          
          if (!form.email) {
              setError('Please enter your email.')
              setTimeout(() => setError(''), 3000)
              return
          }
          
          setLoading(true)

          try{
              const res = await axios.post('/auth/sendEmail', form)
              setSuccess('Success! A reset link has been sent to your email.')
              setForm({ email: '' });
          }catch(err){
             console.error(err);
             const errorMessage = err.response?.data?.message || 'Error: Invalid email or server problem.'; // წარწერა შეცვლილია
             setError(errorMessage)
          }finally{
             setLoading(false)
             setTimeout(() => setError(''), 3000)
             setTimeout(() => setSuccess(''), 3000)
          }
      }
    

  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-100'> 
      <form 
        onSubmit={handleSubmit} 
        className='flex flex-col gap-6 items-center bg-white p-12 rounded-xl shadow-2xl w-full max-w-sm transition duration-300 transform hover:shadow-3xl'
      >
        <h1 className='font-extrabold text-gray-800 text-3xl mb-2 text-center'>Reset Password</h1> 
        <p className='text-sm text-gray-500 text-center'>Enter your email to receive a reset link.</p>

        <input 
          onChange={(e) => setForm({ email: e.target.value })} 
          value={form.email}
          type='email' 
          placeholder='example@mail.com' 
          className='w-full border border-gray-300 outline-none py-3 px-4 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-300'
          required
        />

        {
          success && 
          <p className='p-3 text-center font-medium bg-green-100 text-green-700 w-full rounded-md border border-green-300 animate-fadeIn'>
            {success}
          </p>
        }

        {
          error && 
          <p className='p-3 text-center font-medium bg-red-100 text-red-700 w-full rounded-md border border-red-300 animate-fadeIn'>
            {error}
          </p>
        }

        <button 
          type='submit' 
          className='w-full cursor-pointer py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed'
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Send Link'}
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword