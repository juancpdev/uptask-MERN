import { Task } from "@/types/index"
import NoteDetail from "./NoteDetail"

export type NotesPanelProp = {
  notes: Task['notes']
}

export default function NotesPanel({notes} : NotesPanelProp) {
  return (
    <>
      {notes.length ? 
      <>
        <NoteDetail notes={notes} />
      </> : 
      <p className="text-gray-500 text-center pt-10">No hay notas</p>}
    </>
  )
}
