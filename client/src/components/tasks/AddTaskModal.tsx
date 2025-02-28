import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import TaskForm from './TaskForm';
import { TaskFormData } from '@/types/index';

export default function AddTaskModal() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalTask = queryParams.get('newTask')
    const show = modalTask ? true : false

    const initialValues : TaskFormData = {
        name: '',
        description: ''
    }

    const { register, handleSubmit, formState: { errors } } = useForm({defaultValues: initialValues})

    const handleCreateTask = ((formData : TaskFormData) => {
        console.log(formData);
    })
    
    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
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
                                        className="font-black text-2xl md:text-4xl my-2"
                                    >
                                        Nueva Tarea
                                    </DialogTitle>

                                    <p className="text-md md:text-xl ">Llena el formulario y crea  {''}
                                        <span className="text-fuchsia-600 font-bold">una tarea</span>
                                    </p>

                                    <form 
                                        className='mt-6 md:mt-10 space-y-3 flex flex-col gap-2'
                                        onSubmit={handleSubmit(handleCreateTask)}
                                        noValidate
                                    >
                                        <TaskForm
                                            register={register}
                                            errors={errors}
                                        />
                                        <input 
                                            type="submit" 
                                            className="bg-fuchsia-700 text-white w-full p-3 mt-3 rounded-md font-bold hover:bg-fuchsia-500 transition-all cursor-pointer"
                                            value='Guardar Tarea'
                                        />
                                    </form>

                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}