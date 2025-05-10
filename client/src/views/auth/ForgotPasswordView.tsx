import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
        toast.dismiss();
        toast.error(error.message)
    },
    onSuccess: (data) => {
        toast.dismiss();
        toast.success(data)
        reset()
    }
  });

  const handleForgotPassword = (formData: ForgotPasswordForm) => {mutate(formData)};

  return (
    <>
      <h1 className="text-3xl font-black text-white">Olvide mi password</h1>
      <p className="text-lg font-light text-white mt-2">
        Coloca tu e-mail para recibir {""}
        <span className=" text-fuchsia-500 font-bold"> un nuevo código</span>
      </p>
      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="space-y-6 p-10  bg-white mt-5 rounded-lg"
        noValidate
      >
        <div className="flex flex-col">
          <label className="font-normal text-xl mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          value="Enviar Instrucciones"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 mt-3 text-white font-black  text-xl cursor-pointer rounded-lg"
        />
      </form>

      <nav className=" text-white text-center mt-5">
        <Link to={"/auth/register"}>¿No tienes cuenta? <strong className="text-fuchsia-500">Crear Una</strong></Link> <br/>
        <Link to={"/auth/login"}>¿Ya tienes cuenta? <strong className="text-fuchsia-500">Iniciar Sesion</strong></Link>
      </nav>
    </>
  );
}
