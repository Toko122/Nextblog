'use client'

import React, { useEffect, useRef, useState } from 'react'
import { IoIosNotifications } from "react-icons/io";
import { FaTimes, FaUser } from "react-icons/fa";
import axios from '@/lib/apiClient';
import Link from 'next/link';

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [requests, setRequests] = useState([]);

    const modalRef = useRef()

    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    useEffect(() => {
    if (!userId) return;

    const loadInitialCount = async () => {
        try {
            const res = await axios.get(`/friends/getAllFriends?userId=${userId}`);
            setRequests(res.data.requests || []);
        } catch (err) {
            console.log(err);
        }
    };

    loadInitialCount();
}, [userId]);

    useEffect(() => {
        if (!userId) return;
      const fetchRequests = async () => {
        try {
            const res = await axios.get(`/friends/getAllFriends?userId=${userId}`);
            setRequests(res.data.requests || []);
         } catch (err) {
            console.log(err);
         }
     };
        fetchRequests()

        const interval = setInterval(fetchRequests, 5000)

        return () => clearInterval(interval)

    }, [userId])

    const handleAccept = async (requestId) => {
        try {
            await axios.post('/friends/accept', {
                requestId,
                currentUserId: userId
            });
            setRequests(prev => prev.filter(req => req._id !== requestId));
            
            window.dispatchEvent(new Event('friends-updated'))

        } catch (err) {
            console.log(err);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post('/friends/reject', {
                requestId,
                currentUserId: userId
            });
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
      const handleClickOutside = (e) => {
         if(modalRef.current && !modalRef.current.contains(e.target)){
             setIsOpen(false)
         }
      }
      window.addEventListener('mousedown', handleClickOutside)
      return () => window.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const MessagePopup = () => (
        <div ref={modalRef} className='fixed bottom-24 right-12 w-80 h-96 bg-white shadow-2xl rounded-lg border border-gray-200 z-50'>
            <div className='flex justify-between items-center p-4 border-b border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-800'>Friend Requests</h3>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className='text-gray-500 hover:text-red-500 transition cursor-pointer'
                >
                    <FaTimes />
                </button>
            </div>

            <div className='p-4 overflow-y-auto h-[calc(100%-60px)]'>
                {requests.length === 0 && (
                    <p className='text-sm text-gray-500 text-center'>No new requests</p>
                )}

                {requests.map(req => (
                    <div 
                        key={req._id} 
                        className='flex flex-col gap-2 justify-between items-center p-3 mb-3 bg-gray-50 rounded-lg border'
                    >
                        <Link href={`/features/profile/${req.sender._id}`} className='flex gap-2 items-center'>
                            {req.sender?.imageUrl ? (
                                <img 
                                    src={req.sender.imageUrl} 
                                    className='w-10 h-10 rounded-full object-cover'
                                    alt=""
                                />
                            ) : (
                                <FaUser className='text-2xl rounded-full w-[40px] h-[40px] bg-black text-white p-2'/>
                            )}
                            <div className='font-medium'>
                                {req.sender?.username}
                            </div>
                        </Link>

                        <div className='flex gap-2'>
                            <button 
                                className='bg-green-500 text-white text-xs px-3 py-1 rounded cursor-pointer'
                                onClick={() => {handleAccept(req._id); setIsOpen(false)}}
                            >
                                Accept
                            </button>

                            <button 
                                className='bg-red-500 text-white text-xs px-3 py-1 rounded cursor-pointer'
                                onClick={() => {handleReject(req._id); setIsOpen(false)}}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );

    return (
        <>
            <div className='rounded-full w-[50px] h-[50px] bg-indigo-600 hover:bg-indigo-700 md:bottom-8 md:right-12 bottom-2 right-2 cursor-pointer fixed z-50 transition-colors shadow-xl'
                 onClick={() => setIsOpen(!isOpen)}>
                <div className='relative'>
                    <div className='absolute select-none -top-1 -right-1 text-white text-xs font-bold w-[20px] text-center h-[20px] bg-red-500 rounded-full flex items-center justify-center border-2 border-white'>
                        {requests.length || 0}
                    </div>
                </div>
                <div className='flex items-center justify-center w-full h-full'>
                    <IoIosNotifications className='text-2xl text-white'/>
                </div>
            </div>

            {isOpen && <MessagePopup />}
        </>
    );
};

export default Notification;
