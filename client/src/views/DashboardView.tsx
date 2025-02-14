import { Link } from "react-router-dom";

export default function DashboardView() {
  return (
    <>
      <h1 className=" font-black text-4xl">Mis Proyectos</h1>
      <p className="py-2">Maneja y administra tus proyectos</p>
      <nav className="mt-3">
        <Link to={'/projects/create'} className="bg-purple-500 hover:bg-purple-400 transition-colors text-white font-bold py-3 px-5 rounded-sm text-md">
          Nuevo Proyecto
        </Link>
      </nav>
    </>
  )
}
