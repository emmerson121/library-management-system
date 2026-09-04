import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectToDB from "@/lib/db";
import Author from "@/models/author";

// =====================================================
// GET ALL AUTHORS
// GET /api/author
// =====================================================

export async function GET() {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Get all authors
    const authors = await Author.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: authors.length,
        authors,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET AUTHORS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get authors",
      },
      { status: 500 }
    );
  }
}


// =====================================================
// CREATE AUTHOR
// POST /api/author
// =====================================================

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Get data from request
    const { title, email, password } = await req.json();

    // =================================================
    // VALIDATE INPUT
    // =================================================

    if (!title || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, email and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // =================================================
    // CHECK DUPLICATE EMAIL
    // =================================================

    const existingAuthor = await Author.findOne({
      email: normalizedEmail,
    });

    

    if (existingAuthor) {
      return NextResponse.json(
        {
          success: false,
          message: "An author with this email already exists",
        },
        { status: 400 }
      );
    }

    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // =================================================
    // CREATE AUTHOR
    // =================================================

    const author = await Author.create({
      title: title.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });


    // =================================================
    // RETURN AUTHOR
    // Don't return password
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message: "Author created successfully",

        author: {
          id: String(author._id),
          title: author.title,
          email: author.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("CREATE AUTHOR ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create author",
      },
      { status: 500 }
    );
  }
}


// =====================================================
// UPDATE AUTHOR
// PUT /api/author?id=AUTHOR_MONGO_ID
// =====================================================

export async function PUT(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Get author ID from URL
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Author ID is required",
        },
        { status: 400 }
      );
    }

    // Get updated information
    const { title, email, password } = await req.json();

    // =================================================
    // FIND AUTHOR
    // =================================================

    const author = await Author.findById(id);

    if (!author) {
      return NextResponse.json(
        {
          success: false,
          message: "Author not found",
        },
        { status: 404 }
      );
    }

    // =================================================
    // UPDATE TITLE
    // =================================================

    if (title !== undefined) {
      author.title = title.trim();
    }

    // =================================================
    // UPDATE EMAIL
    // =================================================

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      // Check if another author already uses this email
      const existingAuthor = await Author.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (existingAuthor) {
        return NextResponse.json(
          {
            success: false,
            message: "Another author already uses this email",
          },
          { status: 400 }
        );
      }

      author.email = normalizedEmail;
    }

    // =================================================
    // UPDATE PASSWORD
    // =================================================

    if (password !== undefined && password.trim() !== "") {
      if (password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            message: "Password must be at least 6 characters",
          },
          { status: 400 }
        );
      }

      // Hash the new password
      author.password = await bcrypt.hash(password, 10);
    }

    // Save changes
    await author.save();

    // =================================================
    // RETURN UPDATED AUTHOR
    // =================================================

    return NextResponse.json(
      {
        success: true,
        message: "Author updated successfully",

        author: {
          id: String(author._id),
          title: author.title,
          email: author.email,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("UPDATE AUTHOR ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update author",
      },
      { status: 500 }
    );
  }
}


// =====================================================
// DELETE AUTHOR
// DELETE /api/author?id=AUTHOR_MONGO_ID
// =====================================================

export async function DELETE(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Get author ID from URL
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Author ID is required",
        },
        { status: 400 }
      );
    }

    // =================================================
    // FIND AND DELETE AUTHOR
    // =================================================

    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return NextResponse.json(
        {
          success: false,
          message: "Author not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Author deleted successfully",

        author: {
          id: String(deletedAuthor._id),
          title: deletedAuthor.title,
          email: deletedAuthor.email,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DELETE AUTHOR ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete author",
      },
      { status: 500 }
    );
  }
}
