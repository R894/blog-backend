import mongoose, { Document, Model, Schema } from 'mongoose';

interface IComment extends Document{
    user: Schema.Types.ObjectId;
    content: string;
}

const commentSchema = new Schema<IComment>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        required: true,
    },
});

const Comment: Model<IComment> = mongoose.model('Comment', commentSchema);
export default Comment;