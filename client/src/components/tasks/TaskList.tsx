import { Task } from "@/types/index";
import TaskCard from "./TaskCard";

type TaskListProps = {
  tasks: Task[];
};

type GrupedTask = {
  [key: string]: Task[];
};

const initialStatusGruops: GrupedTask = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

const TranslateStatus : {[key: string] : string} = {
  pending: "Pendiente",
  onHold: "En espera",
  inProgress: "En Progreso",
  underReview: "Bajo Revisión",
  completed: "Completado",
}

const ColorizeStatus : {[key: string] : string} = {
  pending: "border-t-slate-500",
  onHold: "border-t-red-500",
  inProgress: "border-t-blue-500",
  underReview: "border-t-amber-500",
  completed: "border-t-emerald-500",
}

export default function TaskList({ tasks }: TaskListProps) {
  // Acceder correctamente al array de tareas
  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGruops);

  return (
    <>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
            <div className={`capitalize flex justify-between bg-white rounded-t-lg p-3 border font-semibold border-slate-50 shadow ${ColorizeStatus[status]} border-t-10`}>
              <p>{TranslateStatus[status]}</p>
            </div>
            <ul className="mt-5 space-y-5">
              {tasks.length === 0 ? (
                <li className="text-gray-500 text-center pt-3">
                  No Hay tareas
                </li>
              ) : (
                tasks.map((task) => <TaskCard key={task._id} task={task} />)
              )}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
