import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authenticateUser } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function LoginView() {

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ defaultValues: initialValues })

  const {mutate} = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message)
      setValue('password', ''); 
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Iniciando Sesion')
    }
  })

  const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
      <h1 className="text-3xl font-black text-white">Iniciar Sesion</h1>
      <p className="text-lg font-light text-white mt-2">
        Comienza a planear {""}
        <span className=" text-fuchsia-500 font-bold"> tus proyectos</span>
      </p>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-6 p-10 mt-5 bg-white rounded-lg"
        noValidate
      >
        <div className="flex flex-col">
          <label
            className="font-normal text-xl mb-2"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("email", {
              required: "El Email es obligatorio",
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

        <div className="flex flex-col">
          <label
            className="font-normal text-xl mb-2"
          >Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 mt-3 text-white font-black  text-xl cursor-pointer rounded-lg"
        />
      </form>
      <nav className=" text-white text-center mt-5">
        <Link to={"/auth/register"}>¿No tienes cuenta? <strong className="text-fuchsia-500">Crear Una</strong></Link> <br/>
        <Link to={"/auth/forgot-password"}>¿Olvidaste tu password? <strong className="text-fuchsia-500">Reestablecer</strong></Link>
      </nav>
    </>
  )
}