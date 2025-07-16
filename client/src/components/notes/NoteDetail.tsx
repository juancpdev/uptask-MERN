import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { formatDate } from "@/utils/utils";
import { useEffect } from "react";
import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import { deleteNote } from "@/api/NoteAPI";
import { NotesPanelProp } from "./NotesPanel";
const pastelColors = [
  "bg-pink-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-orange-100",
];

export default function NoteDetail({ notes }: NotesPanelProp) {
  const { data } = useAuth();

  const params = useParams();
  const projectId = params.projectId!;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewNote")!;
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    slides: {
      perView: 1.5,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 3.5,
          spacing: 20,
        },
      },
    },
  });

  useEffect(() => {
    instanceRef.current?.update();
  }, [notes.length]);

  function getColor(index: number) {
    return pastelColors[index % pastelColors.length];
  }

  return (
    <div className="mt-6">
      <div ref={sliderRef} className="keen-slider">
        {[...notes].reverse().map((note, index) => {
          const canDelete = data?._id === note.createdBy._id;

          return (
            <div
              key={note._id}
              className={`keen-slider__slide relative rounded-lg shadow-md ${getColor(
                index
              )} p-4 grid min-h-[160px] grid-rows-[auto_1fr_auto] text-slate-700 font-medium`}
            >
              {/* Menú de opciones */}
              {canDelete && (
                <Menu as="div" className="absolute top-3 right-3 z-10">
                  <MenuButton className="text-gray-600 hover:text-black focus:outline-none">
                    <EllipsisVerticalIcon className="w-5 h-5 cursor-pointer" />
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
                    <MenuItems className="absolute right-0 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                      <MenuItem>
                        {
                          <button
                            className="bg-gray-100 block w-full px-4 py-2 text-sm text-red-600 text-left rounded-md cursor-pointer"
                            onClick={() =>
                              setTimeout(() => {
                                mutate({
                                projectId,
                                taskId,
                                noteId: note._id,
                              })
                              }, 500)
                            }
                          >
                            Eliminar
                          </button>
                        }
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              )}

              {/* Contenido de la nota */}
              <p className="text-gray-500 text-sm">
                {formatDate(note.createdAt)}
              </p>
              <p className="break-words max-w-42">{note.content}</p>
              <p className="text-gray-500 mt-5 text-sm text-end">
                {note.createdBy.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
