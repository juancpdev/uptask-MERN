import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { Project, Task, TaskFormData, taskSchema } from "../types";

type TaskAPI = {
    projectId: Project['_id'],
    taskId: Task['_id'],
    formData: TaskFormData,
    status: Task['status']
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
        console.log(data);
        return data
        const response = taskSchema.safeParse(data)
        if(response.success) {
            return response.data
        } 
        
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].msg)
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

export async function updateStatus({projectId, taskId, status} : Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) {
    try {
        const {data} = await api.post<string>(`/projects/${projectId}/tasks/${taskId}/status`, {status});
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}