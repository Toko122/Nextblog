import React, { useEffect, useRef, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { Spinner } from './ui/spinner'
import { FaRegUserCircle } from 'react-icons/fa'
import axios from '@/lib/apiClient'

const EditProfile = ({ onClose }) => {

    const modalRef = useRef()

    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(URL.createObjectURL(file))
            setUploadedFile(file)
            setError('')
            setSuccess('')
        }
    }

    const handleUploadImage = async (e) => {
        e.preventDefault();
        if (!uploadedFile) {
            setError('Please select an image first');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('image', uploadedFile);

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            setError('Authentication required');
            setLoading(false);
            return;
        }

        try {
            const res = await axios.put(`/editProfile/image/${userId}`, formData);
            setSuccess('Profile image uploaded successfully!');
           
            setTimeout(() => {
                if (onClose) onClose();
                
                window.location.reload();
            }, 1500);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(modalRef.current && !modalRef.current.contains(e.target)){
              onClose()
            }
        }
        window.addEventListener('mousedown', handleClickOutside)
        return () => window.removeEventListener('mousedown', handleClickOutside)
    })


  return (
    <div className='fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50'>
      
      <form ref={modalRef} onSubmit={handleUploadImage} className='w-[450px] h-fit bg-white rounded-lg px-6 py-4 flex flex-col gap-8 pb-12'>
         <div className='flex justify-between items-center'>
             <h2 className='text-xl font-bold'>Profile Settings</h2>
             <span
               onClick={onClose}
               className='hover:text-red-500 transition duration-200 cursor-pointer text-[18px]'
               >
              <IoMdClose />
            </span>
         </div>

     <div className='flex flex-col gap-8 items-center justify-center'>
                {image ? (
                   <img src={image} className='w-[120px] h-[120px] rounded-full object-cover' />
                 ) : (
                   <FaRegUserCircle className='text-[130px]' />
                 )}

              <input onChange={handleFileChange} type="file" accept="image/*" className="hidden" id="fileInput" />
              <label htmlFor="fileInput" className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Choose File</label>

              {error && (
                <div className='text-red-500 text-sm text-center'>{error}</div>
              )}
              {success && (
                <div className='text-green-500 text-sm text-center'>{success}</div>
              )}

                 <button 
                   type='submit' 
                   disabled={loading || !uploadedFile}
                   className='w-full cursor-pointer py-2 px-4 rounded-lg bg-[#000] hover:bg-[#202020] transition duration-300 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
                         {loading ? <><Spinner /> Uploading...</> : 'Upload'}
                 </button>
               
            </div>

      </form>

    </div>
  )
}

export default EditProfile