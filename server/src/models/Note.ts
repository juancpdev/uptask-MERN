import mongoose, { Document, Schema, Types } from "mongoose";

export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}

export const NotesSchema : Schema = new Schema({
    content: {
        type: String,
        require
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        require
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        require
    }
}, {timestamps: true})

const Note = mongoose.model<INote>('Note', NotesSchema)
export default Note