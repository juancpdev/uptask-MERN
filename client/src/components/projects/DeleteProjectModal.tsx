import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { CheckPasswordForm } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkPassword } from '@/api/AuthAPI';
import { toast } from 'react-toastify';
import { deleteProject } from '@/api/ProjectAPI';

export default function DeleteProjectModal() {
    const initialValues : CheckPasswordForm = {
        password: ''
    }
    const location = useLocation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const queryParams = new URLSearchParams(location.search);
    const deleteProjectId = queryParams.get('deleteProject')!;
    const show = deleteProjectId ? true : false

    const { register, reset, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

    const checkUserPasswordMutation = useMutation({
        mutationFn: checkPassword,
        onError: (error) => {
            toast.dismiss();
            toast.error(error.message)
            reset()
        },
    })

    const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
        toast.dismiss();
        toast.error(error.message)
    },
    onSuccess: (data) => { 
        toast.dismiss();
        toast.success(data)
        queryClient.invalidateQueries({queryKey: ["projects"]})
        reset()
        navigate(location.pathname, { replace: true })
    }
    })

    const handleForm = async (formData : CheckPasswordForm) => {
        try {
            await checkUserPasswordMutation.mutateAsync(formData)
        } catch (error) {
            return // ⛔ Detiene la ejecución si la password fue incorrecta
        }

        await deleteProjectMutation.mutateAsync(deleteProjectId)
    }


    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
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
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-10 xl:p-16">

                                <DialogTitle
                                    as="h3"
                                    className="font-black text-3xl xl:text-4xl my-5"
                                >Eliminar Proyecto </DialogTitle>

                                <p className="text-xl font-bold">Confirma la eliminación del proyecto {''}
                                    <span className="text-fuchsia-600">colocando tu password</span>
                                </p>

                                <form
                                    className="mt-6 md:mt-10 space-y-3 flex flex-col gap-2"
                                    onSubmit={handleSubmit(handleForm)}
                                    noValidate
                                >

                                    <div className="flex flex-col">
                                        <label
                                            className="text-sm uppercase font-bold mb-1"
                                            htmlFor="password"
                                        >Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Password Inicio de Sesión"
                                            className="w-full p-3  border-gray-300 border rounded-md"
                                            {...register("password", {
                                                required: "El password es obligatorio",
                                            })}
                                        />
                                        {errors.password && (
                                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                                        )}
                                    </div>

                                    <input
                                        type="submit"
                                        className="bg-fuchsia-700 text-white w-full p-3 mt-3 rounded-md font-bold hover:bg-fuchsia-500 transition-all cursor-pointer"
                                        value='Eliminar Proyecto'
                                    />
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}