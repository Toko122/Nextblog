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
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []}],
    bio: {type:String},
    resetToken: {type: String},
    resetTokenExpire: {type: Date},
}, { timestamps: true })

const User = mongoose.models?.User || mongoose.model("User", userSchema)
export default User
