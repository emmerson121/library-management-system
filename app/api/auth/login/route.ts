import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import connectToDB from "@/lib/db";
import Student from "@/models/student";
import Author from "@/models/author";
import Librarian from "@/models/librarian";

export async function POST(req: NextRequest) {
  try {
    // =====================================================
    // CONNECT TO DATABASE
    // =====================================================

    await connectToDB();

    // Get login details
    const { email, password } = await req.json();

    // =====================================================
    // VALIDATE INPUT
    // =====================================================

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // =====================================================
    // 1. CHECK STUDENT
    // =====================================================

    const student = await Student.findOne({
      email: normalizedEmail,
    });

    if (student) {
      // Check student password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        student.password
      );

      if (!isPasswordCorrect) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email or password",
          },
          { status: 401 }
        );
      }

      // Create JWT
      const token = jwt.sign(
        {
          id: String(student._id),

          // Example: STU001
          studentId: student.studentId,

          role: "student",
        },
        process.env.JWT_SECRET_KEY!,
        {
          expiresIn: "1h",
        }
      );

      // Return student information
      return NextResponse.json({
        success: true,
        message: "Login successful",

        token,

        user: {
          id: String(student._id),

          // Example: STU001
          studentId: student.studentId,

          title: student.title,
          email: student.email,
          role: "student",
        },
      });
    }

    // =====================================================
    // 2. CHECK LIBRARY ATTENDANT
    // =====================================================

    const librarian = await Librarian.findOne({
      email: normalizedEmail,
    });

    if (librarian) {
      // Check librarian password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        librarian.password
      );

      if (!isPasswordCorrect) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email or password",
          },
          { status: 401 }
        );
      }

      // Create JWT
      const token = jwt.sign(
        {
          id: String(librarian._id),

          // Example: LIB001
          staffId: librarian.staffId,

          role: "libraryAttendant",
        },
        process.env.JWT_SECRET_KEY!,
        {
          expiresIn: "1h",
        }
      );

      // Return librarian information
      return NextResponse.json({
        success: true,
        message: "Login successful",

        token,

        user: {
          id: String(librarian._id),

          // Example: LIB001
          staffId: librarian.staffId,

          title: librarian.title,
          email: librarian.email,
          role: "libraryAttendant",
        },
      });
    }

   
// =====================================================
// 3. CHECK AUTHOR
// =====================================================

const author = await Author.findOne({
  email: normalizedEmail,
});

if (author) {
  // Check author password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    author.password
  );

  if (!isPasswordCorrect) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid email or password",
      },
      { status: 401 }
    );
  }

  // ===================================================
  // CREATE AUTHOR JWT
  // ===================================================

  const token = jwt.sign(
    {
      id: String(author._id),
      role: "author",
    },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: "1h",
    }
  );

  // ===================================================
  // RETURN AUTHOR INFORMATION
  // ===================================================

  return NextResponse.json({
    success: true,
    message: "Login successful",

    token,

    user: {
      id: String(author._id),
      title: author.title,
      email: author.email,
      role: "author",
    },
  });
}



    // =====================================================
    // NO ACCOUNT FOUND
    // =====================================================

    return NextResponse.json(
      {
        success: false,
        message: "Invalid email or password",
      },
      { status: 401 }
    );
  } catch (error: unknown) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

