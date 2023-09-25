import mongoose, { Document, Model, Schema } from 'mongoose';

interface IPost extends Document {
    title: string;
    content: string;
    published: boolean;
    author: Schema.Types.ObjectId;
    pubDate: Date;
    tags: Schema.Types.ObjectId[];
}

const postSchema = new Schema<IPost>({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    published: {
        type: Boolean,
        default: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    pubDate: {
        type: Date,
        default: Date.now,
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
    }],
});

const Post: Model<IPost> = mongoose.model('Post', postSchema);

export default Post;