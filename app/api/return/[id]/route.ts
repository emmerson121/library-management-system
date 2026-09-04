import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectToDB from "@/lib/db";
import BookInfo from "@/models/books";
import Student from "@/models/student";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    // ==========================================
    // CONNECT TO DATABASE
    // ==========================================

    await connectToDB();

    // ==========================================
    // GET BOOK ID FROM URL
    // ==========================================

    const { id: bookId } = await params;

    if (!bookId) {
      return NextResponse.json(
        {
          success: false,
          message: "Book ID is required",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // GET AUTHORIZATION TOKEN
    // ==========================================

    const authHeader =
      req.headers.get("authorization");

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // ==========================================
    // VERIFY JWT
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as {
      id: string;
      studentId?: string;
      role?: string;
    };

    // ==========================================
    // MAKE SURE USER IS A STUDENT
    // ==========================================

    if (decoded.role !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Only students can return books",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // FIND LOGGED-IN STUDENT
    // ==========================================

    const student = await Student.findById(
      decoded.id
    );

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student account not found",
        },
        { status: 404 }
      );
    }

    // ==========================================
    // FIND BOOK
    // ==========================================

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

    // ==========================================
    // CHECK BOOK STATUS
    // ==========================================

    if (book.status === "IN") {
      return NextResponse.json(
        {
          success: false,
          message: "Book is already returned",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // CHECK BORROWER
    // ==========================================

    if (!book.borrowedBy) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This book is not currently borrowed",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // MAKE SURE THIS STUDENT BORROWED THE BOOK
    // ==========================================

    if (
      String(book.borrowedBy) !==
      String(student._id)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You did not borrow this book",
        },
        { status: 403 }
      );
    }

    // ==========================================
    // RETURN BOOK
    // ==========================================

    book.status = "IN";

    book.borrowedBy = null;

    book.issuedBy = null;

    book.returnDate = new Date();

    await book.save();

    // ==========================================
    // REMOVE BOOK FROM STUDENT'S BORROWED BOOKS
    // ==========================================

    student.borrowedBooks =
      student.borrowedBooks.filter(
        (id) =>
          String(id) !== String(book._id)
      );

    await student.save();

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message: "Book returned successfully",
        book,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "RETURN BOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while returning the book",
      },
      { status: 500 }
    );
  }
}