import { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { ProjectFormData } from "@/types/index";

type ProjectFormProps = {
    register: UseFormRegister<ProjectFormData>
    errors: FieldErrors<ProjectFormData>
}

export default function ProjectForm({register, errors } : ProjectFormProps) {
    return (
        <>
            <div className="mb-5 space-y-3">
                <label htmlFor="projectName" className="text-sm uppercase font-bold">
                    Nombre del Proyecto
                </label>
                <input
                    id="projectName"
                    className="w-full p-3 border border-gray-200 m-0 text-sm rounded-md"
                    type="text"
                    placeholder="Nombre del Proyecto"
                    {...register("projectName", {
                        required: "El Titulo del Proyecto es obligatorio",
                        validate: (value) => value.trim().length > 0 || "El titulo no puede estar vacío"
                    })}
                />
                {errors.projectName && (
                    <ErrorMessage>
                        {errors.projectName.message}
                    </ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="clientName" className="text-sm uppercase font-bold">
                    Nombre del Cliente
                </label>
                <input
                    id="clientName"
                    className="w-full p-3  border border-gray-200 m-0 text-sm rounded-md"
                    type="text"
                    placeholder="Nombre del Cliente"
                    {...register("clientName", {
                        required: "El Nombre del Cliente es obligatorio",
                        validate: (value) => value.trim().length > 0 || "El nombre no puede estar vacío"
                    })}
                />
                {errors.clientName && (
                    <ErrorMessage>
                        {errors.clientName.message}
                    </ErrorMessage>
                )}
            </div>

            <div className="mb-5 space-y-3">
                <label htmlFor="description" className="text-sm uppercase font-bold">
                    Descripción
                </label>
                <textarea
                    id="description"
                    className="w-full p-3  border border-gray-200 m-0 block text-sm rounded-md"
                    placeholder="Descripción del Proyecto"
                    {...register("description", {
                        required: "Una descripción del proyecto es obligatoria",
                        validate: (value) => value.trim().length > 0 || "La descripción no puede estar vacío"
                    })}
                />
                {errors.description && (
                    <ErrorMessage>
                        {errors.description.message}
                    </ErrorMessage>
                )}
            </div>
        </>
    )
}