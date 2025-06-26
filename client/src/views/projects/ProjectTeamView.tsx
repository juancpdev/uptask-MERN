import { getProjectTeam, removeUserFromProject } from "@/api/TeamAPI";
import AddMemberModal from "@/components/team/AddMemberModal";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ArrowUturnLeftIcon, EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react"
import { toast } from "react-toastify";

export default function ProjectTeamView() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient()

  const { data, isLoading, isError} = useQuery({
    queryKey: ["projectTeam", projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false
  })

  const { mutate } = useMutation({
    mutationFn: removeUserFromProject,
    onError: (error) => {
      toast.dismiss();
      toast(error.message)
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(data);
      queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
    }
  })

  if(isLoading) return <p>Cargando...</p>
  if(isError) return <Navigate to={'/404'} />

  if(data) return (
    <>
      <div className="flex justify-between">
        <h1 className="font-black text-3xl md:text-4xl lg:text-5xl">
          Administrar Equipo
        </h1>
        <ArrowUturnLeftIcon
          className="w-8 h-8 p-2  cursor-pointer rounded-full bg-purple-500 text-white hover:bg-purple-400 transition"
          onClick={() => navigate(`/projects/${projectId}`)}
        />
      </div>
      <p className="text-gray-500 mt-5 text-sm md:text-base">
        Administra el equipo de trabajo para este proyecto
      </p>
      <div className="w-full px-4 md:px-6 lg:px-8 overflow-x-hidden">
        <div className="flex items-center justify-center gap-5 ">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold my-10  lg:my-12">
            Miembros
          </h2>
          <PlusIcon
            className="w-8 h-8 p-1.5 cursor-pointer rounded-full bg-purple-500 text-white hover:bg-purple-400 transition"
            onClick={() => navigate(location.pathname + "?addMember=true")}
          />
        </div>
      </div>


            {data.length ? (
                <ul role="list" className="divide-y divide-gray-100 border border-gray-100 bg-white m-auto max-w-[50rem] shadow-lg rounded-2xl">
                    {data?.map((member) => (
                        <li key={member._id} className="flex justify-between gap-x-6 px-5 py-8">
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto space-y-2">
                                    <p className="text-2xl font-black text-gray-600">
                                        {member.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                       {member.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-x-6 ">
                                <Menu as="div" className="relative flex-none">
                                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 cursor-pointer">
                                            <span className="sr-only">opciones</span>
                                            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
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
                                        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none cursor-pointer">
                                            <MenuItem>
                                                <button
                                                    type='button'
                                                    className='block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer'
                                                    onClick={() => mutate({projectId, userId: member._id})}
                                                >
                                                    Eliminar del Proyecto
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
                <p className='text-center py-20'>No hay miembros en este equipo</p>
            )}

      <AddMemberModal />
    </>
  );
}
