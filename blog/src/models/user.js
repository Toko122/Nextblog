import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    phone: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        default: 'user'
    },
    imageUrl: {type: String},
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: []}],
    bio: {type:String},
    resetToken: {type: String},
    resetTokenExpire: {type: Date},
}, { timestamps: true })

export default mongoose.models.User || mongoose.model("User", userSchema)