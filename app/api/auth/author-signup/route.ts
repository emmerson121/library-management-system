import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectToDB from "@/lib/db";
import Author from "@/models/author";

export async function POST(req: NextRequest) {
  try {
    // ==========================================
    // CONNECT TO DATABASE
    // ==========================================

    await connectToDB();

    // ==========================================
    // GET REQUEST DATA
    // ==========================================

    const { title, email, password } = await req.json();

    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (!title || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Title, email and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail =
      email.toLowerCase().trim();

    // ==========================================
    // CHECK IF AUTHOR ALREADY EXISTS
    // ==========================================

    const existingAuthor =
      await Author.findOne({
        email: normalizedEmail,
      });

    if (existingAuthor) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An author with this email already exists",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ==========================================
    // CREATE AUTHOR
    // ==========================================
console.log(
  "AUTHOR MODEL PATHS:",
  Object.keys(Author.schema.paths)
);

console.log(
  "AUTHOR INPUT:",
  {
    title: title.trim(),
    email: normalizedEmail,
    passwordExists: !!hashedPassword,
  }
);

    const author = await Author.create({
      title: title.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

     console.log("CREATED AUTHOR:", {
  id: String(author._id),
  title: author.title,
  email: author.email,
  passwordExists: !!author.password,
});

    // ==========================================
    // RETURN AUTHOR
    // Never return the password
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message: "Author created successfully",

        author: {
          id: String(author._id),
          title: author.title,
          email: author.email,
          role: "author",
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "AUTHOR SIGNUP ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating author",
      },
      { status: 500 }
    );
  }
}

