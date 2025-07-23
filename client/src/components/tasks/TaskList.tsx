import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { Project, TaskProject, TaskStatus, User } from "@/types/index";
import TaskCard from "./TaskCard";
import { PlusIcon, UserGroupIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TranslateStatus } from "@/locales/es";
import { isManager } from "@/types/policies";
import DropTask from "./DropTask";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "@/api/TaskAPI";

type TaskListProps = {
  tasks: TaskProject[];
  userAuth: User
  manager: string
  canEdit: boolean
};

type GrupedTask = {
  [key: string]: TaskProject[];
};

const initialStatusGruops: GrupedTask = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

const ColorizeStatus: { [key: string]: string } = {
  pending: "border-t-slate-500",
  onHold: "border-t-red-500",
  inProgress: "border-t-blue-500",
  underReview: "border-t-amber-500",
  completed: "border-t-emerald-500",
};

export default function TaskList({ tasks, userAuth, manager, canEdit }: TaskListProps) {
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      // queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.dismiss();
      toast.success(data);
      navigate(location.pathname, { replace: true });
    },
  });

  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Actualizar el número de slides cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Agrupar tareas por estado
  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGruops);

    const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
 
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);
 
  const handleDragEnd = (e: DragEndEvent) => { 
    const { over, active} = e

    if(over && over.id) {
      const taskId = active.id.toString()
      const status = over.id as TaskStatus
      mutate({projectId, taskId, status})

      queryClient.setQueryData(['project', projectId], (prevData: Project) => {
        const updateTask = prevData.tasks.map((task) => {
          if(task._id === taskId) {
            return {...task, status}
          }
          return task
        })
        return {...prevData, tasks: updateTask}
      })

    }
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 overflow-x-hidden">
      <div className="flex items-center justify-center gap-5 mb-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold my-6 md:my-8 lg:my-10">
          Tareas
        </h2>
        {isManager(manager, userAuth._id) && (
          <>
            <PlusIcon
              className="w-8 h-8 p-1.5 cursor-pointer rounded-full bg-purple-500 text-white hover:bg-purple-400 transition"
              onClick={() => navigate(location.pathname + "?newTask=true")}
            />
            <Link to={`team`}>
              <UserGroupIcon
                className="w-8 h-8 p-1.5 cursor-pointer rounded-full bg-purple-500 text-white hover:bg-purple-400 transition"
                onClick={() => navigate(location.pathname + "?addMember=true")}
              />
            </Link>
          </>
        )}
      </div>

      {/* Modo móvil: uso de acordeón */}
      {windowWidth < 1550 ? (
        <div className="block pb-5 space-y-10">
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="bg-gray-50 rounded-lg shadow-md ">
              <div
                className={`capitalize flex justify-between items-center p-4 font-semibold border-t-8 ${ColorizeStatus[status]}`}
              >
                <p className="">{TranslateStatus[status]}</p>
                <span className="text-gray-500 text-sm">
                  {tasks.length} tareas
                </span>
              </div>
              <div className="p-4">
                {tasks.length === 0 ? (
                  <p className="text-gray-500 text-center">No hay tareas</p>
                ) : (
                  <ul className="space-y-4">
                    {tasks.slice().reverse().map((task) => (
                      <TaskCard key={task._id} task={task} canEdit={canEdit}/>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
          <DndContext onDragEnd={handleDragEnd} sensors={sensors} >
            {Object.entries(groupedTasks).map(([status, tasks]) => (
              <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
                <div
                  className={`capitalize flex justify-between bg-white rounded-t-lg p-3 border font-semibold border-slate-50 shadow ${ColorizeStatus[status]} border-t-10`}
                >
                  <p>{TranslateStatus[status]}</p>
                  {tasks.length === 1 ? (
                    <span className="text-gray-500 text-sm">
                      {tasks.length} tarea
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      {tasks.length} tareas
                    </span>
                  )}
                </div>

                <DropTask status={status}/>

                <ul className="mt-5 space-y-5">
                  {tasks.length === 0 ? (
                    <li className="text-gray-500 text-center pt-3">
                      No Hay tareas
                    </li>
                  ) : (
                    tasks.slice().reverse().map((task) => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                  )}
                </ul>
              </div>
            ))}
          </DndContext>
        </div>
      )}
    </div>
  );
}
