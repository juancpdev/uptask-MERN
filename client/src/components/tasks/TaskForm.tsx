import { FieldErrors, UseFormRegister } from "react-hook-form"
import { TaskFormData } from "@/types/index";
import ErrorMessage from "../ErrorMessage";

type TaskFormProps = {
    errors: FieldErrors<TaskFormData>
    register: UseFormRegister<TaskFormData>
}

export default function TaskForm({errors, register} : TaskFormProps) {
    return (
        <>
            <div className="flex flex-col">
                <label
                    className="text-sm uppercase font-bold mb-1"
                    htmlFor="name"
                >Nombre de la tarea</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Nombre de la tarea"
                    className="w-full p-3  border-gray-300 border rounded-md"
                    {...register("name", {
                        required: "El nombre de la tarea es obligatorio",
                        validate: (value) => value.trim().length > 0 || "El nombre no puede estar vacío"
                    })}
                />
                {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
            </div>

            <div className="flex flex-col">
                <label
                    className="text-sm uppercase font-bold mb-1"
                    htmlFor="description"
                >Descripción de la tarea</label>
                <textarea
                    id="description"
                    placeholder="Descripción de la tarea"
                    className="w-full p-3  border-gray-300 border rounded-md"
                    {...register("description", {
                        required: "La descripción de la tarea es obligatoria",
                        validate: (value) => value.trim().length > 0 || "La descripción no puede estar vacía"
                    })}
                />
                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}