import { isAxiosError } from "axios";
import { dashboardProjectSchema, ProjectFormData } from "../types";
import api from "@/lib/axios";

export async function createProject(formData : ProjectFormData) {
    try {
        const {data} = await api.post('/projects', formData);
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjects() {
    try {
        const {data} = await api('/projects');
        const response = dashboardProjectSchema.safeParse( data )
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}