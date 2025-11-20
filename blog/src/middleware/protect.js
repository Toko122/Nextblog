import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function protect(req){
    const authHeader = req.headers.get('authorization')
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return NextResponse.redirect(new URL('/features/auth/login', req.url))
    }

    const token = authHeader.split(' ')[1]

    try{
       jwt.verify(token, process.env.JWT)
       return NextResponse.next()
    }catch(err){
    return NextResponse.redirect(new URL('/features/auth/login', req.url))
    }
}

export const config = {
    matcher: ['/features/profile/:path*']
}