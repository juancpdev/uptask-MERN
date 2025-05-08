import Logo from '@/components/Logo'
import { Link, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function AuthLayout() {
  return (
    <>
      <div className='bg-gray-800 min-h-screen'>
        <div className='py-10 mx-auto w-[350px] md:w-[450px]'>
            <Link to={'/auth/login'}><Logo/></Link>
            <div className="mt-10">
                <Outlet/>
            </div>
        </div>
      </div>

      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </>
  )
}
