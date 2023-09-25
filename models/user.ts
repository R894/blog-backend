import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document{
    username: string;
    password: string;
    email: string;
    profilePicture: string;
    bio: string;
}

const userSchema: Schema<IUser> = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
    }
});

const User: Model<IUser> = mongoose.model('User', userSchema);

export default User;