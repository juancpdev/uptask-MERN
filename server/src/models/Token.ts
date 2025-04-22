import mongoose, {Schema, Document, Types} from "mongoose";

export interface Token extends Document {
    token: string;
    user: Types.ObjectId;
    createdAt: string
}

const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: '10m'
    }
})

const Token = mongoose.model<Token>('token', tokenSchema)
export default Token