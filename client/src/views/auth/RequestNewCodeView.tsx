import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { requestConfirmationCode } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RequestNewCodeView() {
    const initialValues: RequestConfirmationCodeForm = {
        email: ''
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const {mutate} = useMutation({
        mutationFn: requestConfirmationCode,
        onError: (error) => {
            toast.dismiss();
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.dismiss();
            toast.success(data)
            reset()
        }
    })

    const handleRequestCode = (formData: RequestConfirmationCodeForm) => mutate(formData)

    return (
        <>
            <h1 className="text-3xl font-black text-white">Solicitar Código de Confirmación</h1>
            <p className="text-lg font-light text-white mt-2">
                Coloca tu e-mail para recibir {''}
                <span className=" text-fuchsia-500 font-bold"> un nuevo código</span>
            </p>

            <form
                onSubmit={handleSubmit(handleRequestCode)}
                className="space-y-6 p-10 rounded-lg bg-white mt-10"
                noValidate
            >
                <div className="flex flex-col">
                    <label
                        className="font-normal text-2xl mb-2"
                        htmlFor="email"
                    >Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full p-3 rounded-lg border-gray-300 border"
                        {...register("email", {
                            required: "El Email de registro es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Enviar Código'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
                />
            </form>

            <nav className=" text-white text-center mt-5">
                <Link to={"/auth/login"}>¿Ya tienes cuenta? <strong className="text-fuchsia-500">Iniciar Sesion</strong></Link><br/>
                <Link to={"/auth/forgot-password"}>¿Olvidaste tu password? <strong className="text-fuchsia-500">Reestablecer</strong></Link>
            </nav>
        </>
    )
}