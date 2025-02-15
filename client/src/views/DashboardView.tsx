import { Link } from "react-router-dom";

export default function DashboardView() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className=" font-black text-3xl md:text-4xl">Mis Proyectos</h1>
      <p className="py-2 text-sm md:text-base">Maneja y administra tus proyectos</p>
      <nav className="mt-5">
        <Link to={'/projects/create'} className="py-3 px-3 text-sm md:py-3 md:px-5 md:text-base bg-purple-500 hover:bg-purple-400 transition-colors text-white font-bold rounded-sm">
          Nuevo Proyecto
        </Link>
      </nav>
    </div>
  )
}
