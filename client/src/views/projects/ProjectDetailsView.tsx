import { getProjectById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
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
        <h1 className="font-black text-3xl md:text-4xl lg:text-5xl">
          {data.projectName}
        </h1>
        <p className="text-gray-500 mt-5 text-sm md:text-base">
          {data.description}
        </p>

        <nav className="my-5 flex gap-3">
          <button
            className="py-3 px-3 text-sm md:py-3 md:px-5 md:text-base bg-purple-500 hover:bg-purple-400 transition-colors text-white font-bold rounded-sm cursor-pointer"
            onClick={() => navigate(location.pathname + "?newTask=true")}
          >
            Agregar Tarea
          </button>
        </nav>
        
        <TaskList
          tasks={data.tasks}
        />
        <AddTaskModal />
      </>
    );
}
