import mongoose, { Document, Model, Schema } from 'mongoose';

interface ITag extends Document{
    name: string;
    description: string;
}

const tagSchema = new Schema<ITag>({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String
    },
});

const Tag: Model<ITag> = mongoose.model('Tag', tagSchema);

export default Tag;