import { Request, Response } from "express"
import Note, { INote } from "../models/Note"
import { Types } from "mongoose"

type NoteParam = {
    noteId: Types.ObjectId
}

export class NoteController {

    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body
        const note = new Note()
        note.content = content
        note.createdBy = req.user.id
        note.task = req.task.id

        req.task.notes.push(note.id)

        Promise.allSettled([note.save(), req.task.save()])

        try {
            res.send('Nota creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskNote = async (req: Request, res: Response) => {
        try {
            const note = await Note.find({task : req.task.id})
            res.json(note)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static deleteNote = async (req: Request<NoteParam>, res: Response) => {

        const { noteId } = req.params
        const note = await Note.findById(noteId)

        
        if(!note) {
            res.status(404).json({error: 'Nota no encontrada'})
            return 
        }

        if(note.createdBy.toString() !== req.user.id.toString()) {
            res.status(401).json({error: 'Accion no valida'})
            return 
        }

        req.task.notes = req.task.notes.filter( note => note.toString() !== noteId.toString())

        try {
            await Promise.allSettled([note.deleteOne(), req.task.save()])
            res.send('Nota Eliminada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}