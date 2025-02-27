import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { deleteProject, getProjects } from "@/api/ProjectAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import { Project } from "../types";

export default function DashboardView() {

  // Obtiene datos
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  
  // Fuerza un nuevo refecht y obtiene datos nuevos
  const queryClient = useQueryClient()

  // Modifica datos
  const {mutate} = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => { 
      toast.success(data)
      queryClient.invalidateQueries({queryKey: ["projects"]})
    }
  })

  const confirmDelete = (projectId: Project['_id']) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Eliminado!",
          text: "Tu proyecto ha sido eliminado.",
          icon: "success"
        });
        mutate(projectId);
      }
    });
  };
  

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
            className=" w-full md:max-w-xl xl:max-w-6xl divide-y divide-gray-100 border rounded-2xl border-gray-100 my-10 bg-white shadow-lg"
          >
            {data.map((project) => (
              <li
                key={project._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-gray-600 cursor-pointer hover:underline text-2xl md:text-3xl font-bold"
                    >
                      {project.projectName}
                    </Link>
                    <p className="text-sm text-gray-400 mt-2">
                      Cliente: {project.clientName}
                    </p>
                    <p className="text-sm text-gray-400 line-clamp-2">
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
                            to={`/projects/${project._id}`}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                          >
                            Ver Proyecto
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            to={`/projects/${project._id}/edit`}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                          >
                            Editar Proyecto
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <button
                            type="button"
                            className="block px-3 py-1 text-sm leading-6 text-red-500 w-full hover:bg-gray-50 text-start cursor-pointer"
                            onClick={() => confirmDelete(project._id)}
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
