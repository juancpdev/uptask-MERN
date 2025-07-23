import { useDroppable } from "@dnd-kit/core"

type DropTaskProp = {
    status: string
}

export default function DropTask({status} : DropTaskProp) {

    const { isOver, setNodeRef} = useDroppable({
        id: status
    })

    const style = {
        opacity : isOver ? 0.3 : undefined,
        padding : isOver ? 40 : undefined
    }
        
    return (
        <div ref={setNodeRef} style={style} className="text-sm font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500 rounded-md">Soltar tarea aquí </div>
    )
}
