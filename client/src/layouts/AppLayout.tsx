import { Outlet } from "react-router-dom";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { ToastContainer } from "react-toastify";

export default function AppLayout() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <header className="bg-gray-800 p-5">
        <div className=" max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center">     
          <div className="w-64">
            <Logo/>
          </div>
          <NavMenu/>
        </div>    
      </header>
      
      <div className="m-5 p-2 md:m-10 md:p-5 2xl:max-w-screen-2xl 2xl:mx-auto 2xl:w-full">
        <Outlet/>
      </div>

      <footer className="bg-gray-800 py-10 text-sm md:text-base text-white">
        <p className="text-center">Todos los derechos reservador por UpTask - {new Date().getFullYear()}</p>
      </footer>

      <ToastContainer
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </div>
  )
}
