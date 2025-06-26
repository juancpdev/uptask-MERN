import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task, TaskFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import TaskForm from './TaskForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';

type EditTaskModalProps = {
    data : Task,
    taskId: Task['_id']
}

export default function EditTaskModal({data, taskId} : EditTaskModalProps) {
    const navigate = useNavigate()

    const initialValues = {
        name: data.name,
        description: data.description
    }

    const {register, handleSubmit, reset, formState: {errors}} = useForm<TaskFormData>({defaultValues: initialValues})

    const params = useParams()

    /** Obtener projectId */
    const projectId = params.projectId!

    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn : updateTask,
        onError : (error) => {
            toast.dismiss();
            toast.error(error.message)
        },
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
            toast.dismiss();
            toast.success(data)
            navigate(location.pathname, {replace: true})
            reset()
        }
    })

    const handleEditTask = (formData: TaskFormData) => {
        const data = {
            projectId,
            taskId,
            formData
        }
        mutate(data)
    }

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true}) }>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6 md:p-12">
                                <DialogTitle
                                    as="h3"
                                    className="font-black text-2xl md:text-4xl my-2"                                >
                                    Editar Tarea
                                </DialogTitle>

                                <p className="text-md md:text-xl ">Llena el formulario y crea  {''}
                                        <span className="text-fuchsia-600 font-bold">una tarea</span>
                                </p>

                                <form
                                    className='mt-6 md:mt-10 space-y-3 flex flex-col gap-2'
                                    onSubmit={handleSubmit(handleEditTask)}
                                    noValidate
                                >
                    
                                    <TaskForm 
                                        register={register}
                                        errors={errors}
                                    />
                    
                                    <input
                                        type="submit"
                                        className="bg-fuchsia-700 text-white w-full p-3 mt-3 rounded-md font-bold hover:bg-fuchsia-500 transition-all cursor-pointer"
                                        value='Actualizar Tarea'
                                    />
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}