import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { Project, Task, TaskFormData } from "../types";

type TaskAPI = {
    projectId: Project['_id'],
    taskId: Task['_id'],
    formData: TaskFormData
} 

export async function createTask({projectId, formData} : Pick<TaskAPI, 'projectId' | 'formData'>) {
    try {
        const {data} = await api.post<string>(`/projects/${projectId}/tasks`, formData);
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getTaskById({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const {data} = await api(`/projects/${projectId}/tasks/${taskId}`)
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateTask({projectId, taskId, formData} : Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) {
    try {
        const {data} = await api.put(`/projects/${projectId}/tasks/${taskId}`, formData);
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteTask({projectId, taskId} : Pick<TaskAPI, 'projectId' | 'taskId'>) {
    try {
        const {data} = await api.delete<string>(`/projects/${projectId}/tasks/${taskId}`);
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}