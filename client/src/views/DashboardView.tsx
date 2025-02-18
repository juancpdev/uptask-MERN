import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { getProjects } from "@/api/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function DashboardView() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  console.log(data);
  if (isLoading) return <div>Cargando...</div>;

  if (data)
    return (
      <div className="flex flex-col justify-center items-center">
        <h1 className=" font-black text-3xl md:text-4xl">Mis Proyectos</h1>
        <p className="py-2 text-sm md:text-base">
          Maneja y administra tus proyectos
        </p>
        <nav className="m-5">
          <Link
            to={"/projects/create"}
            className="py-3 px-3 text-sm md:py-3 md:px-5 md:text-base bg-purple-500 hover:bg-purple-400 transition-colors text-white font-bold rounded-sm"
          >
            Nuevo Proyecto
          </Link>
        </nav>

        {data.length ? (
          <ul
            role="list"
            className="divide-y divide-gray-100 border rounded-2xl border-gray-100 my-10 bg-white shadow-lg"
          >
            {data.map((project) => (
              <li
                key={project._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <Link
                      to={``}
                      className="text-gray-600 cursor-pointer hover:underline text-2xl md:text-3xl font-bold"
                    >
                      {project.projectName}
                    </Link>
                    <p className="text-sm text-gray-400 mt-2">
                      Cliente: {project.clientName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9 cursor-pointer"
                        aria-hidden="true"
                      />
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <MenuItem>
                          <Link
                            to={``}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                          >
                            Ver Proyecto
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            to={``}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                          >
                            Editar Proyecto
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <button
                            type="button"
                            className="block px-3 py-1 text-sm leading-6 text-red-500 w-full hover:bg-gray-50 text-start cursor-pointer"
                            onClick={() => {}}
                          >
                            Eliminar Proyecto
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center h-50 md:h-100">
            <p className="">
              Aún no hay proyectos{" "}
              <Link
                to={"/projects/create"}
                className="text-purple-500 font-bold"
              >
                Crear Proyecto
              </Link>
            </p>
          </div>
        )}
      </div>
    );
}
