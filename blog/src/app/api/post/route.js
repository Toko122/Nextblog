import { NextResponse } from 'next/server';
import Post from '../../../models/post';
import connectDb from '@/lib/config';
import jwt from 'jsonwebtoken';
import cloudinary from '../../../models/cloudinary';

export async function POST(req) {
  try {
    await connectDb();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT);
      userId = decoded.id;
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const imageFile = formData.get('image');
    let imageUrl = null;

     if(imageFile && typeof imageFile.arrayBuffer === 'function'){
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const uploaded = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({folder: 'uploads/'}, (err, result) => {
               if(err) reject(err)
               else resolve(result)
            })
          stream.end(buffer)
        })
        imageUrl = uploaded.secure_url
     }

    if (!title && !imageUrl) {
      return NextResponse.json({ message: "Post must have at least a title and an image" }, { status: 400 });
    }

    const post = await Post.create({ title, imageUrl, userId });

    return NextResponse.json({ message: 'Post added', post }, { status: 200 });
  } catch (err) {
    console.error('Error adding post', err);
    return NextResponse.json({ message: 'Error adding post', error: err.message }, { status: 500 });
  }
}
