import { isAxiosError } from "axios";
import { Note, NoteFormData, Project, Task } from "../types";
import api from "@/lib/axios";

type NoteAPIType = {
    projectId: Project['_id']
    taskId: Task['_id'],
    formData: NoteFormData,
    noteId: Note['_id']
} 

export async function createNote({projectId, taskId, formData} : Pick<NoteAPIType, 'projectId' | 'taskId' | 'formData'>) {
    try {
        const {data} = await api.post<string>(`/projects/${projectId}/tasks/${taskId}/notes`, formData);
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteNote({projectId, taskId, noteId} : Pick<NoteAPIType, 'projectId' | 'taskId' | 'noteId'>) {
    try {
        const {data} = await api.delete<string>(`/projects/${projectId}/tasks/${taskId}/notes/${noteId}`);
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}