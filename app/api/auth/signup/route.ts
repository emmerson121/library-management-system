import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/db";
import Student from "@/models/student";

// ======================================================
// POST /api/auth/signup
// Creates a new Student account
// ======================================================

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Get signup information from frontend
    const { title, email, password } = await req.json();

    // ==================================================
    // Validate required fields
    // ==================================================

    if (!title || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, email and password are required",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // Clean input values
    // ==================================================

    const cleanTitle = title.trim();
    const cleanEmail = email.toLowerCase().trim();

    // ==================================================
    // Check if email already exists
    // ==================================================

    const existingStudent = await Student.findOne({
      email: cleanEmail,
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // Generate the next Student ID
    //
    // First student  -> STU001
    // Second student -> STU002
    // Third student  -> STU003
    // ==================================================

    const lastStudent = await Student.findOne()
      .sort({ studentId: -1 })
      .select("studentId")
      .lean();

    let nextNumber = 1;

    if (lastStudent?.studentId) {
      const lastNumber = parseInt(
        lastStudent.studentId.replace("STU", ""),
        10
      );

      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const studentId = `STU${String(nextNumber).padStart(3, "0")}`;

    // ==================================================
    // Hash password before saving
    // ==================================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==================================================
    // Create Student
    // ==================================================

    const student = await Student.create({
      title: cleanTitle,
      email: cleanEmail,
      password: hashedPassword,
      studentId,
      borrowedBooks: [],
    });

    // ==================================================
    // Return successful response
    // ==================================================

    return NextResponse.json(
      {
        success: true,
        message: "Student account created successfully",

        student: {
          id: String(student._id),
          title: student.title,
          email: student.email,
          studentId: student.studentId,

          // Role is always Student
          role: "student",
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("SIGNUP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong during signup",
      },
      { status: 500 }
    );
  }
}