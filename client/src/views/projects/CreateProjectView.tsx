import {createProject} from "@/api/ProjectAPI";
import ProjectForm from "@/components/projects/ProjectForm";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ProjectFormData } from "types";

export default function CreateProjectView() {

    const navigate = useNavigate()

    const initialValues : ProjectFormData = {
        projectName: '',
        clientName: '',
        description: ''
    }

    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues});

    const {mutate} = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.dismiss();
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.dismiss();
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = async (formData : ProjectFormData) => mutate(formData)

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className=" font-black text-3xl md:text-4xl">Crear Proyectos</h1>
            <p className="py-2 text-sm md:text-base">Llena el siguiente formulario para crear un proyecto</p>
            <nav className="mt-5">
                <Link to={'/'} className="py-3 px-3 text-sm md:py-3 md:px-5 md:text-base bg-purple-500 hover:bg-purple-400 transition-colors text-white font-bold rounded-sm">
                Volver a proyectos
                </Link>
            </nav>

            <form
                className="bg-white rounded-md shadow-sm lg:w-2xl lg:mx-auto p-7 md:p-10 my-15"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
                <ProjectForm
                    register={register}
                    errors={errors}
                />
                <input 
                    type="submit" 
                    value='Crear Proyecto'
                    className="bg-fuchsia-700 text-white w-full p-3 mt-3 rounded-md font-bold hover:bg-fuchsia-500 transition-all cursor-pointer"
                />
            </form>
        </div>
    )
}
