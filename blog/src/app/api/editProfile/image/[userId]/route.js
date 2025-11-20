import connectDb from "@/lib/config";
import cloudinary from "@/models/cloudinary";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import User from '@/models/user';

export async function PUT(req, { params }) {
  await connectDb();

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    const userId = decoded.id;

    const formData = await req.formData();
    const imageFile = formData.get('image');
    if (!imageFile) return NextResponse.json({ message: 'No image provided' }, { status: 400 });

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'uploads/' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
      stream.end(buffer);
    });

    const user = await User.findByIdAndUpdate(userId, { imageUrl: uploaded.secure_url }, { new: true });

    return NextResponse.json({ message: 'Image uploaded', user }, { status: 200 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'Error uploading profile image' }, { status: 500 });
  }
}

