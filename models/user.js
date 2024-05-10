import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    emailId: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
