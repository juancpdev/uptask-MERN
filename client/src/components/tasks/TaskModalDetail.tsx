import { ChangeEvent, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateStatus } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utils";
import { TranslateStatus } from "@/locales/es";
import { TaskStatus } from "@/types/index";
import { ClipboardDocumentListIcon } from "@heroicons/react/20/solid"

export default function TaskModalDetails() {
  const params = useParams();
  const projectId = params.projectId!;
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const show = taskId ? true : false;

  const { data, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.dismiss();
      toast.success(data);
      navigate(location.pathname, { replace: true });
    },
  });

  const handleUpdateStatus = (e: ChangeEvent<HTMLSelectElement>) => {
    const data = {
      projectId,
      taskId,
      status: e.target.value as TaskStatus,
    };
    mutate(data);
  };

  if (isError) {
    setTimeout(() => {
      toast.error(error.message, { toastId: "error" });
    }, 0);
    return <Navigate to={`/projects/${projectId}`} />;
  }

  if (data)
    return (
      <>
        <Transition appear show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => navigate(location.pathname, { replace: true })}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-10 md:p-16">

                    <ClipboardDocumentListIcon 
                      className="absolute right-0 top-0 mt-3 mr-3 w-8 h-8 p-1.5 cursor-pointer rounded-full bg-purple-500 text-white hover:bg-purple-400 transition"
                      onClick={() =>
                        navigate(`${location.pathname}?viewNote=${taskId}`, { replace: true })
                      }
                    />

                    <p className="text-sm text-slate-400">
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>
                    <DialogTitle
                      as="h3"
                      className="font-black text-4xl text-slate-600 my-5"
                    >
                      {data.name}
                    </DialogTitle>
                    <p className="text-lg text-slate-500 mb-2">
                      Descripción: {data.description}
                    </p>
                    <p className="font-bold">Historial de cambios: </p>

                    {data.completedBy.length > 0 ? (
                      <select
                        className="p-2 mt-2 border border-gray-300 rounded-md bg-gray-100 text-slate-600 cursor-pointer"
                        defaultValue={data.completedBy.at(-1)?._id}
                      >
                        {data.completedBy.map((log, index) => (
                          <option key={log._id} value={log._id}>
                            {index + 1}. {TranslateStatus[log.status]} por:{" "}
                            {log.user.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-slate-400">Sin historial de cambios</p>
                    )}

                    <div className="my-5 space-y-3">
                      <label className="font-bold">Estado Actual: </label>

                      <select
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md cursor-pointer"
                        defaultValue={data.status}
                        onChange={handleUpdateStatus}
                      >
                        {Object.entries(TranslateStatus).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
