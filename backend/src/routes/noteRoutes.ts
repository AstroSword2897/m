import { Router } from 'express'
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from '../controllers/noteController'

const router = Router()

router.post('/', createNote)
router.get('/', getNotes)
router.get('/:id', getNoteById)
router.put('/:id', updateNote)
router.delete('/:id', deleteNote)

export default router 