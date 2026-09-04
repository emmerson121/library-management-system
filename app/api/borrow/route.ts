import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDB from "@/lib/db";
import BookInfo from "@/models/books";
import Student from "@/models/student";
import Librarian from "@/models/librarian";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    // Get token
    const authHeader =
      req.headers.get("authorization");

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as {
      id: string;
    };

    // Find logged-in student
    const student = await Student.findById(
      decoded.id
    );

    if (!student) {
      return NextResponse.json(
        {
          message:
            "Student account not found",
        },
        { status: 404 }
      );
    }

    const body = await req.json();

    const {
      bookId,
      staffId,
      returnDate,
    } = body;

    if (!bookId || !staffId || !returnDate) {
      return NextResponse.json(
        {
          message:
            "Book, Staff ID and Return Date are required",
        },
        { status: 400 }
      );
    }

    // Find book
    const book = await BookInfo.findById(bookId);

    if (!book) {
      return NextResponse.json(
        {
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    // Check availability
    if (book.status === "OUT") {
      return NextResponse.json(
        {
          message: "Book is already out!",
        },
        { status: 400 }
      );
    }

    // Find librarian
    const librarian = await Librarian.findOne({
      staffId: String(staffId).trim(),
    });

    if (!librarian) {
      return NextResponse.json(
        {
          message:
            `Staff with ID "${staffId}" was not found`,
        },
        { status: 404 }
      );
    }

    // Borrow book
    book.status = "OUT";
    book.borrowedBy = student._id;
    book.issuedBy = librarian._id;
    book.returnDate = new Date(returnDate);

    // Reset reminder tracking for this borrowing
book.reminders = {
  twoDaysBefore: {
    sent: false,
    sentAt: null,
  },
  oneDayBefore: {
    sent: false,
    sentAt: null,
  },
  dueDate: {
    sent: false,
    sentAt: null,
  },
  overdue: {
    lastSentAt: null,
  },
};
    
    // Add book to student's borrowedBooks
    if (
      !student.borrowedBooks.some(
        (id) => id.toString() === book._id.toString()
      )
    ) {
      student.borrowedBooks.push(book._id);
      await student.save();
    }

    // Save the updated book
    await book.save();


    return NextResponse.json(
      {
        message: "Book borrowed successfully",
        book,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error(
      "BORROW BOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while borrowing the book",
      },
      { status: 500 }
    );
  }
}