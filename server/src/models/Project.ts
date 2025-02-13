import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import { ITask } from "./Task";

export interface IProject extends Document {
    projectName: string,
    clientName: string,
    description: string,
    tasks: PopulatedDoc<ITask & Document>[]
}

const ProjectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ]
}, { timestamps: true });

ProjectSchema.pre('deleteOne', { document: true }, async function() {
    const Task = mongoose.model('Task');
    await Task.deleteMany({ _id: { $in: this.tasks } });
});

const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project