import { Project, TeamMember } from ".";

export const isManager = (managerId : Project['manager'], userId : TeamMember['_id'] ) => managerId === userId