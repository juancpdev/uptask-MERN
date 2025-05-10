import { validateToken } from '@/api/AuthAPI';
import { ConfirmToken } from '@/types/index';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

type NewPasswordTokenProps = {
    token: ConfirmToken['token'],
    setToken: React.Dispatch<React.SetStateAction<string>>,
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NewPasswordToken({token, setToken, setIsValidToken} : NewPasswordTokenProps) {
    const firstInputRef = useRef<HTMLInputElement>(null);

    const {mutate} = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.dismiss();
            toast.error(error.message)
            setToken('')

            setTimeout(() => {
                firstInputRef.current?.focus();
            }, 0);
        },
        onSuccess: (data) => {
            toast.dismiss();
            toast.success(data)
            setIsValidToken(true)
        }
    })

    const handleChange = (token : ConfirmToken['token']) => {
        setToken(token)
    }

    const handleComplete = (token : ConfirmToken['token']) => mutate({token})

    return (
        <>
      <h1 className="text-3xl font-black text-white">Reestablecer Password</h1>
      <p className="text-lg font-light text-white mt-5">
        Ingresa el código que recibiste {''}
        <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
      </p>
      <form
        className="space-y-8 p-10 bg-white mt-10 rounded-lg"
      >
        <label
          className="font-normal text-2xl text-center block"
        >Código de 6 dígitos</label>
        <div className="flex justify-center gap-3">
            <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                <PinInputField ref={firstInputRef} className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
                <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            </PinInput>
        </div>

      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/forgot-password'
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>

        </>
    )
}