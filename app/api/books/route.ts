import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDB from "@/lib/db";

import "@/lib/registerModels"
import BookInfo from "@/models/books";


// ======================================================
// GET /api/books
// ======================================================

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    console.log("REGISTERED MODELS:", mongoose.modelNames());

    const books = await BookInfo.find()
      .populate("authors", "title")
      .populate("borrowedBy", "title email studentId")
      .populate("issuedBy", "title staffId")
      .lean();

    const formattedBooks = books.map((book: any) => ({
      id: String(book._id),

      title: book.title,
      isbn: book.isbn ?? "",
      authors: book.authors ?? [],
      genre: book.genre ?? "",
      year: book.year ?? null,
      cover: book.cover ?? "",
      description: book.description ?? book.desc ?? "",

      status: book.status,

      borrowedBy: book.borrowedBy
        ? {
            id: String(book.borrowedBy._id),
            title: book.borrowedBy.title,
            email: book.borrowedBy.email,
            studentId: book.borrowedBy.studentId,
          }
        : null,

      issuedBy: book.issuedBy
        ? {
            id: String(book.issuedBy._id),
            title: book.issuedBy.title,
            staffId: book.issuedBy.staffId,
          }
        : null,

      returnDate: book.returnDate
        ? book.returnDate
        : null,
    }));

    return NextResponse.json({
      success: true,
      totalBooks: formattedBooks.length,
      data: formattedBooks,
    });
  } catch (error: unknown) {
    console.error("GET BOOKS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch books",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// POST /api/books
// ======================================================

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      title,
      isbn,
      authors,
      genre,
      year,
      cover,
      description,
    } = body;

    // ------------------------------------------
    // Validate required fields
    // ------------------------------------------

    if (!title || !isbn) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and ISBN are required",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // Check duplicate book
    // ------------------------------------------

    const existingBook = await BookInfo.findOne({
      $or: [
        { title: title.trim() },
        { isbn: isbn.trim() },
      ],
    });

    if (existingBook) {
      return NextResponse.json(
        {
          success: false,
          message: "Book already exists with same title or ISBN",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // Create book
    // ------------------------------------------

    const book = await BookInfo.create({
      title: title.trim(),
      isbn: isbn.trim(),
      authors: authors ?? [],
      genre: genre ?? "",
      year: year ?? null,
      cover: cover ?? "",
      description: description ?? "",

      // Initial borrowing state
      status: "IN",
      borrowedBy: null,
      issuedBy: null,
      returnDate: null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Book added successfully",
        book: {
          id: String(book._id),
          title: book.title,
          isbn: book.isbn,
          authors: book.authors,
          genre: book.genre,
          year: book.year,
          cover: book.cover,
          description: book.description,
          status: book.status,
          borrowedBy: null,
          issuedBy: null,
          returnDate: null,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST BOOK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}


export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("id");

    if (!bookId) {
      return NextResponse.json(
        {
          success: false,
          message: "Book ID is required",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // Validate MongoDB ObjectId
    // ------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid book ID",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      title,
      isbn,
      authors,
      genre,
      year,
      cover,
      description,
    } = body;

    // ------------------------------------------
    // Validate required fields
    // ------------------------------------------

    if (!title || !isbn) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and ISBN are required",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // Check duplicate title / ISBN
    // Exclude the current book
    // ------------------------------------------

    const existingBook = await BookInfo.findOne({
      _id: { $ne: bookId },
      $or: [
        { title: title.trim() },
        { isbn: isbn.trim() },
      ],
    });

    if (existingBook) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another book already exists with the same title or ISBN",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // Update book
    // ------------------------------------------

   const updatedBook: any = await BookInfo.findByIdAndUpdate(
  bookId,
  {
    title: title.trim(),
    isbn: isbn.trim(),
    authors: authors ?? [],
    genre: genre ?? "",
    year: year ?? null,
    cover: cover ?? "",
    description: description ?? "",
  },
  {
    new: true,
    runValidators: true,
  }
)
      .populate("authors", "title")
      .populate("borrowedBy", "title email studentId")
      .populate("issuedBy", "title staffId")
      .lean();

    // ------------------------------------------
    // Book not found
    // ------------------------------------------

    if (!updatedBook) {
      return NextResponse.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    // ------------------------------------------
    // Format response
    // ------------------------------------------

    const formattedBook = {
  id: String(updatedBook._id),

  title: updatedBook.title,
  isbn: updatedBook.isbn ?? "",
  authors: updatedBook.authors ?? [],
  genre: updatedBook.genre ?? "",
  year: updatedBook.year ?? null,
  cover: updatedBook.cover ?? "",
  description: updatedBook.description ?? "",

  status: updatedBook.status,

  borrowedBy: updatedBook.borrowedBy
    ? {
        id: String(updatedBook.borrowedBy._id),
        title: updatedBook.borrowedBy.title,
        email: updatedBook.borrowedBy.email,
        studentId: updatedBook.borrowedBy.studentId,
      }
    : null,

  issuedBy: updatedBook.issuedBy
    ? {
        id: String(updatedBook.issuedBy._id),
        title: updatedBook.issuedBy.title,
        staffId: updatedBook.issuedBy.staffId,
      }
    : null,

  returnDate: updatedBook.returnDate ?? null,
};

    return NextResponse.json({
      success: true,
      message: "Book updated successfully",
      book: formattedBook,
    });
  } catch (error: unknown) {
    console.error("UPDATE BOOK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update book",
      },
      { status: 500 }
    );
  }
}

// delete a book
export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("id");

    // ------------------------------------------
    // Validate book ID
    // ------------------------------------------

    if (!bookId) {
      return NextResponse.json(
        {
          success: false,
          message: "Book ID is required",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid book ID",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // Find book first
    // ------------------------------------------

    const book = await BookInfo.findById(bookId);

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    // ------------------------------------------
    // Prevent deleting a borrowed book
    // ------------------------------------------

    if (book.status === "OUT") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This book cannot be deleted because it is currently borrowed.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------
    // Delete book
    // ------------------------------------------

    await BookInfo.findByIdAndDelete(bookId);

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
      bookId,
    });
  } catch (error: unknown) {
    console.error("DELETE BOOK ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete book",
      },
      { status: 500 }
    );
  }
}