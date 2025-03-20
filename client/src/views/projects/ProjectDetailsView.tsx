import { getProjectById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function ProjectDetailsView() {
  const navigate = useNavigate();

  const params = useParams();

  const projectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["editProject", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  });

  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to="/404" />;
  if (data)
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
        />
        <AddTaskModal />
      </>
    );
}
