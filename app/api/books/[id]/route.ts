import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import BookInfo from "@/models/books";
import connectToDB from "@/lib/db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/books/:id
export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    await connectToDB();

    const { id } = await context.params;

    const book = await BookInfo.findById(id)
      .populate("authors")
      .populate("borrowedBy")
      .populate("issuedBy");

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/books/:id
// PUT /api/books/:id
export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  try {
    await connectToDB();

    const { id } = await context.params;

    // Get Authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as {
      id: string;
      email: string;
      role: string;
    };

    // Check library attendant role
    if (decoded.role !== "libraryAttendant") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    // Get only the book data from the request body
    const body = await req.json();

    // Don't allow user data to be passed into MongoDB
    delete body.user;

const existingBook = await BookInfo.findById(id);

    const updatedBook = await BookInfo.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      return NextResponse.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Book updated",
        updatedBook,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("UPDATE BOOK ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/books/:id
export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    await connectToDB();

    const { id } = await context.params;

    // TODO:
    // Replace this with your real JWT authentication.
    const body = await req.json().catch(() => ({}));
    const user = body.user;

    if (!user || user.role !== "libraryAttendant") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    const deletedBook = await BookInfo.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json(
        {
          success: false,
          message: "Book not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Book deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}