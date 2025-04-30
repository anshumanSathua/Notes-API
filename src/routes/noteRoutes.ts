import { Router } from "express";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  searchNotes,
  getNotesByTag,
  archiveNotes,
  getArchivedNotes,
  exportNoteAsPdf,
  getNoteAnalytics,
} from "../controllers/noteController";
import { requireAuth } from "../middlewares/authMiddleware";
import { exportNotesAsZip } from "../controllers/exportNoteAsZip";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: Note management (CRUD, archive, export, etc)
 */

// SEARCH
/**
 * @swagger
 * /notes/search:
 *   get:
 *     summary: Search notes by title or content
 *     tags: [Notes]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of matching notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get("/search", searchNotes);

/**
 * @swagger
 * /notes/tag/{tagName}:
 *   get:
 *     summary: Get notes by tag
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: tagName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notes with given tag
 */
router.get("/tag/:tagName", getNotesByTag);

// CRUD
/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 *       500:
 *         description: Server error
 */
router.post("/", createNote);

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all active (non-archived) notes of the user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *         description: Page number (pagination)
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         description: Number of notes per page
 *     responses:
 *       200:
 *         description: A list of notes
 *       500:
 *         description: Server error
 */
router.get("/", getNotes);

/**
 * @swagger
 * /notes/{noteId}:
 *   put:
 *     summary: Update a note by ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.put("/:noteId", updateNote);

/**
 * @swagger
 * /notes/{noteId}:
 *   delete:
 *     summary: Delete a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note deleted
 */
router.delete("/:noteId", deleteNote);

// Soft delete / Archive
/**
 * @swagger
 * /notes/archive/{noteId}:
 *   patch:
 *     summary: Archive a note (soft delete)
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note archived
 */
router.patch("/archive/:noteId", archiveNotes);

/**
 * @swagger
 * /notes/archived:
 *   get:
 *     summary: Get all archived notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of archived notes
 */
router.get("/archived", getArchivedNotes);

// Export the note as PDF
/**
 * @swagger
 * /notes/{noteId}/export:
 *   get:
 *     summary: Export a single note as PDF
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF file stream
 */
router.get("/:noteId/export", exportNoteAsPdf);

// Export all the notes as zip
/**
 * @swagger
 * /notes/export/zip:
 *   get:
 *     summary: Export all notes as ZIP of PDFs
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: ZIP file stream
 */
router.get("/export/zip", exportNotesAsZip);

// Get you notes analytics
/**
 * @swagger
 * /notes/analytics:
 *   get:
 *     summary: Get analytics on user notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get("/analytics", getNoteAnalytics);

export default router;
