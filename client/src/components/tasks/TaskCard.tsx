import { deleteTask } from "@/api/TaskAPI";
import { Task } from "@/types/index";
import { Menu, MenuButton, Transition, MenuItems, MenuItem } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {Fragment} from "react"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {

  const navigate = useNavigate()

  const params = useParams()

    /** Obtener projectId */
    const projectId = params.projectId!

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn : deleteTask,
        onError : (error) => {
            toast.error(error.message)
        },
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            toast.success(data)
            navigate(location.pathname, {replace: true})
        }
    })

      const confirmDelete = (taskId: Task['_id']) => {
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
            mutate({projectId, taskId});
          }
        });
      };

  return (
    <li className="flex justify-between bg-white rounded-b-lg p-5 shadow-md">
      <div className="flex flex-col items-start gap-5">
        <button className="font-bold uppercase text-start">
          {task.name}
        </button>
        <p className="text-gray-500">{task.description}</p>
      </div>

      <div className="flex shrink-0  gap-x-6">
        <Menu as="div" className="relative flex-none">
          <MenuButton className="-m-2.5 block p-1 text-gray-500 hover:text-gray-900 cursor-pointer">
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-7 w-7" aria-hidden="true" />
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
            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none ">
              <MenuItem>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer"
                >
                  Ver Tarea
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer"
                  onClick={() => navigate(location.pathname + "?editTask=" + task._id)}
                >
                  Editar Tarea
                </button>
              </MenuItem>

              <MenuItem>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer"
                  onClick={() => confirmDelete(task._id)}
                >
                  Eliminar Tarea
                </button>
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </li>
  );
}
