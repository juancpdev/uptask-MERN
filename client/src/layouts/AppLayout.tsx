import { Outlet } from "react-router-dom";
import Logo from "@/components/Logo";

export default function AppLayout() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <header className="bg-gray-800 py-5 ">
        <div className=" max-w-screen-2xl mx-auto">     
          <div className="w-64">
            <Logo/>
          </div>
        </div>    
      </header>
      
      <div className="my-10 p-5 max-w-screen-2xl mx-auto bg-amber-200">
        <Outlet/>
      </div>

      <footer className="bg-gray-800 py-10 text-white">
        <p className="text-center">Todos los derechos reservador por UpTask - {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
