import { z } from "zod";

/** Projects */
export const projectShema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
})

export type Project = z.infer<typeof projectShema>;
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description'>;