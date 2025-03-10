import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { Project, TaskFormData } from "../types";

type taskAPI = {
    projectId: Project['_id'],
    formData: TaskFormData
} 

export async function createTask({projectId, formData} : Pick<taskAPI, 'projectId' | 'formData'>) {
    try {
        const {data} = await api.post<string>(`/projects/${projectId}/tasks`, formData);
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}