import {createProject} from "@/api/ProjectAPI";
import ProjectForm from "@/components/projects/ProjectForm";
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

    const handleForm = async (formData : ProjectFormData) => {
        const data = await createProject(formData)
        toast.success(data)
        navigate('/')
    }

    return (
        <>
            <h1 className=" font-black text-4xl">Crear Proyectos</h1>
            <p className="py-2">Llena el siguiente formulario para crear un proyecto</p>
            <nav className="mt-3">
                <Link to={'/'} className="bg-purple-500 hover:bg-purple-400 transition-colors text-white font-bold py-3 px-5 rounded-sm text-md">
                Volver a proyectos
                </Link>
            </nav>

            <form
                className="bg-white rounded-md shadow-sm lg:w-2xl lg:mx-auto p-10 my-15"
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
        </>
    )
}
