import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { NoteFormData } from "@/types/index";
import { createNote } from "@/api/NoteAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import NotesPanel, { NotesPanelProp } from "./NotesPanel";

export default function AddNoteForm({notes} : NotesPanelProp) {
  const params = useParams();
  const projectId = params.projectId!;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewNote")!;
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createNote,
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

  const initialValues: NoteFormData = {
    content: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const handleAddNote = (formData: NoteFormData) => {
    mutate({ projectId, taskId, formData });
    reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleAddNote)}
        className="space-y-3"
        noValidate
      >
        <div className="flex flex-col ">
          <label className="font-bold mb-2" htmlFor="content">
            Crear Nota
          </label>
          <input
            id="content"
            type="text"
            placeholder="Contenido de la nota"
            className="w-full p-3 border border-gray-300 rounded-md"
            {...register("content", {
              required: "Este contenido de la nota es obligatorio",
            })}
          />
          {errors.content && (
            <ErrorMessage>{errors.content.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Crear Nota"
          className="bg-fuchsia-700 text-white w-full p-3 mt-2 rounded-md font-bold hover:bg-fuchsia-500 transition-all cursor-pointer"
        />
      </form>

      <NotesPanel notes={notes}/>
    </>
  );
}
