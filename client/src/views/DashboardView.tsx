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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/types/policies";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import { toast } from "react-toastify";
import { leaveProject } from "@/api/TeamAPI";
import Swal from "sweetalert2";

export default function DashboardView() {
  // Obtiene datos
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // Fuerza un nuevo refecht y obtiene datos nuevos
  const navigate = useNavigate();
  const location = useLocation();

  const { data: userAuth, isLoading: isLoadingAuth } = useAuth();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: leaveProject,
    onError: (error) => {
      toast.dismiss();
      toast(error.message);
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  if (isLoading && isLoadingAuth) return <div>Cargando...</div>;

  if (data && userAuth) {
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
                className="relative flex justify-between gap-x-6 px-5 py-10"
              >
                {userAuth && (
                  <>
                    {isManager(project.manager, userAuth._id) ? (
                      <p className="absolute bg-gray-700 p-2 rounded-br-2xl top-0 left-0 text-sm bg- font-semibold">
                        👑
                      </p>
                    ) : (
                      <p className="absolute bg-gray-300 p-2 rounded-br-2xl top-0 left-0 text-sm font-semibold">
                        👥
                      </p>
                    )}
                  </>
                )}
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
                        {isManager(project.manager, userAuth._id) && (
                          <>
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
                                onClick={() =>
                                  navigate(
                                    location.pathname +
                                      `?deleteProject=${project._id}`
                                  )
                                }
                              >
                                Eliminar Proyecto
                              </button>
                            </MenuItem>
                          </>
                        )}
                        {!isManager(project.manager, userAuth._id) && (
                          <MenuItem>
                            <button
                              type="button"
                              className="block px-3 py-1 text-sm leading-6 text-red-500 w-full hover:bg-gray-50 text-start cursor-pointer"
                              onClick={async () => {
                                const result = await Swal.fire({
                                  title: "¿Estás seguro?",
                                  text: "Vas a abandonar el proyecto y ya no tendrás acceso",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Sí, salir",
                                  cancelButtonText: "Cancelar",
                                  confirmButtonColor: "#d33",
                                  cancelButtonColor: "#3085d6",
                                });

                                if (result.isConfirmed) {
                                  mutate(project._id);
                                }
                              }}
                            >
                              Abandonar Proyecto
                            </button>
                          </MenuItem>
                        )}
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

        <DeleteProjectModal />
      </div>
    );
  }
}
