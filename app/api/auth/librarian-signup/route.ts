import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectToDB from "@/lib/db";
import Librarian from "@/models/librarian";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { title, email, password } = await req.json();

    // ==========================================
    // VALIDATE INPUT
    // ==========================================

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

    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail = email.toLowerCase().trim();

    // ==========================================
    // CHECK IF LIBRARIAN ALREADY EXISTS
    // ==========================================

    const existingLibrarian = await Librarian.findOne({
      email: normalizedEmail,
    });

    if (existingLibrarian) {
      return NextResponse.json(
        {
          success: false,
          message: "A librarian with this email already exists",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==========================================
    // CREATE LIBRARIAN
    //
    // staffId is NOT supplied here.
    //
    // The Mongoose model automatically generates:
    //
    // LIB001
    // LIB002
    // LIB003
    // ==========================================

    const librarian = await Librarian.create({
      title: title.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message: "Library attendant created successfully",

        librarian: {
          id: String(librarian._id),
          title: librarian.title,
          email: librarian.email,
          staffId: librarian.staffId,
          role: "libraryAttendant",
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("LIBRARIAN SIGNUP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating librarian",
      },
      { status: 500 }
    );
  }
}