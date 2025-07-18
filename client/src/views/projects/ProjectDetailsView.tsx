import { getProjectById } from "@/api/ProjectAPI";
import NoteModalDetails from "@/components/notes/NoteModalDetail";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskList from "@/components/tasks/TaskList";
import TaskModalDetails from "@/components/tasks/TaskModalDetail";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function ProjectDetailsView() {
  const navigate = useNavigate();

  const params = useParams();

  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  });

  const { data : userAuth, isLoading: isLoadingAuth } = useAuth()

  const canEdit = useMemo(() => data?.manager === userAuth?._id, [data, userAuth])

  if (isLoading && isLoadingAuth) return "Cargando...";
  if (isError) return <Navigate to="/404" />;
  if (data && userAuth)
    return (
      <>
        <div className="flex justify-between">
          <h1 className="font-black text-3xl md:text-4xl lg:text-5xl">
            {data.projectName}
          </h1>
          <ArrowUturnLeftIcon className="w-8 h-8 p-2  cursor-pointer rounded-full bg-purple-500 text-white hover:bg-purple-400 transition"
            onClick={() => navigate('/')}
          />
        </div>
        <p className="text-gray-500 mt-5 text-sm md:text-base">
          {data.description}
        </p>
        
        <TaskList
          tasks={data.tasks}
          userAuth={userAuth}
          manager={data.manager}
          canEdit={canEdit}
        />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
        <NoteModalDetails />
      </>
    );
}
