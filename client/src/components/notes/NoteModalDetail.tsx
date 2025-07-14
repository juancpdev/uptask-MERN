import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/TaskAPI";
import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid";
import AddNoteForm from "./AddNotesForm";

export default function NoteModalDetails() {
  const params = useParams();
  const projectId = params.projectId!;
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewNote")!;
  const show = taskId ? true : false;

  const { data } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false,
  });

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
                  <DialogPanel className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-10 md:p-16 ">
                    <DialogTitle
                      as="h3"
                      className="font-black text-2xl md:text-4xl my-2"
                    >
                      Notas
                    </DialogTitle>

                    <p className="text-md md:text-xl mb-5">
                      Tarea: {""}
                      <span className="text-fuchsia-600 font-bold">
                        {data.name}
                      </span>
                    </p>

                    <AddNoteForm notes={data.notes} />

                    <ArrowUturnLeftIcon
                      className="absolute right-0 top-0 mt-3 mr-3 w-8 h-8 p-1.5 cursor-pointer rounded-full bg-purple-500 text-white hover:bg-purple-400 transition"
                      onClick={() =>
                        navigate(`${location.pathname}?viewTask=${taskId}`, {
                          replace: true,
                        })
                      }
                    />
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
