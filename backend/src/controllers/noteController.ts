import { Request, Response } from 'express'
import { Note, NoteModel } from '../models/Note'

export const createNote = async (req: Request, res: Response) => {
  try {
    const newNote: Note = req.body;
    const createdNote = await NoteModel.createNote(newNote);
    res.status(201).json(createdNote);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await NoteModel.getNotes();
    res.status(200).json(notes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await NoteModel.getNoteById(id);
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedFields: Partial<Note> = req.body;
    const updatedNote = await NoteModel.updateNote(id, updatedFields);
    if (updatedNote) {
      res.status(200).json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await NoteModel.deleteNote(id);
    if (success) {
      res.status(204).send(); // No content for successful deletion
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 