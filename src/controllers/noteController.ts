import { Request, Response } from "express";
import Note from "../models/noteModel";
import PDFDocument from "pdfkit";
import slugify from "slugify";
import { format } from "date-fns";
import mongoose from "mongoose";

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.userId;

    const note = await Note.create({ title, content, tags, userId });
    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    // res.status(500).json({ message: "Server error", error });
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Note.countDocuments({ userId });

    const notes = await Note.find({ userId, isArchived: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!notes) {
      res.status(404).json({ message: "NO notes found!" });
      return;
    }
    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      notes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const noteId = req.params.noteId;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      req.body,
      { new: true }
    );

    if (!note) {
      res.status(404).json({ message: "Note not found!" });
      return;
    }
    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const noteId = req.params.noteId;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) {
      res.status(404).json({ message: "Note not found!" });
      return;
    }
    res.status(200).json({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const searchNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const query = req.query.query as string;
    if (!query) {
      res.status(400).json({ message: "Query required!" });
      return;
    }

    const regex = new RegExp(query, "i");

    const notes = await Note.find({
      userId,
      isArchived: false,
      $or: [{ title: regex }, { content: regex }],
    }).lean();
    res.status(200).json(notes);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
};

export const getNotesByTag = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tag = req.params.tagName;

    const notes = await Note.find({
      userId,
      isArchived: false,
      tags: tag,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};

export const archiveNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { noteId } = req.params;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { isArchived: true },
      { new: true }
    );

    if (!note) {
      res.status(404).json({ message: "Note not found!" });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const getArchivedNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const notes = await Note.find({ userId, isArchived: true }).sort({
      createdAt: -1,
    });
    if (!notes) {
      res.status(404).json({ message: "NO notes found!" });
      return;
    }
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const exportNoteAsPdf = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const noteId = req.params.noteId;

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      res.status(404).json({ message: "Note not found!" });
      return;
    }

    // Create a PDF
    const doc = new PDFDocument();

    // Set response headers so browser treats it like a file download
    const safeFileName = slugify(note.title, { lower: true, strict: true });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFileName}.pdf"`
    );

    //Pipe the PDF into response
    doc.pipe(res);

    // Add content to the PDF
    // Title
    doc.fontSize(20).text(note.title, { underline: true, align: "center" });
    doc.moveDown();

    // Created At Date
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Created: ${format(note.createdAt, "PPPpp")}`, { align: "center" });
    doc.moveDown();

    // Tags
    if (note.tags && note.tags.length > 0) {
      doc
        .fontSize(12)
        .fillColor("blue")
        .text(`Tags: ${note.tags.join(", ")}`, { align: "center" });
      doc.moveDown();
    }

    // Content
    doc.fillColor("black").fontSize(14).text(note.content, { align: "left" });
    doc.moveDown();

    // Footer / Watermark
    doc.moveDown(4);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Generated by SkillSail Notes", { align: "center" });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Server error while exporting note" });
  }
};

export const getNoteAnalytics = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const totalNotes = await Note.countDocuments({ userId });
    const archivedNotes = await Note.countDocuments({
      userId,
      isArchived: true,
    });
    const activeNotes = totalNotes - archivedNotes;

    // get top 5 most used tags
    const tagAgg = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const mostUsedTags = tagAgg.map((tag) => tag._id);

    res.json({ totalNotes, archivedNotes, activeNotes, mostUsedTags });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
