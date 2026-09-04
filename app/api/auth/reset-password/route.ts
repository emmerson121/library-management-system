import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import connectToDB from "@/lib/db";

import Student from "@/models/student";
import Author from "@/models/author";
import Librarian from "@/models/librarian";

// ======================================================
// POST /api/auth/reset-password
// ======================================================

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      token,
      password,
      confirmPassword,
    } = body;

    // ==================================================
    // VALIDATE INPUT
    // ==================================================

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Token, password and confirm password are required.",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    // ==================================================
    // CLEAN TOKEN
    // ==================================================

    const cleanToken = String(token).trim();

    console.log(
      "RESET TOKEN RECEIVED:",
      cleanToken
    );

    // ==================================================
    // HASH TOKEN
    // ==================================================

    const hashedToken = crypto
      .createHash("sha256")
      .update(cleanToken)
      .digest("hex");

    console.log(
      "HASHED RESET TOKEN:",
      hashedToken
    );

    console.log(
      "CURRENT TIME:",
      new Date()
    );

    // ==================================================
    // FIND STUDENT
    // ==================================================

    const student = await Student.findOne({
      resetPasswordToken: hashedToken,
    });

    if (student) {
      console.log(
        "STUDENT RESET TOKEN FOUND"
      );

      console.log(
        "TOKEN EXPIRATION:",
        student.resetPasswordExpires
      );

      if (
        !student.resetPasswordExpires ||
        student.resetPasswordExpires <= new Date()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This password reset link has expired.",
          },
          { status: 400 }
        );
      }

      const hashedPassword =
        await bcrypt.hash(password, 12);

      student.password = hashedPassword;

      student.resetPasswordToken = null;
      student.resetPasswordExpires = null;

      await student.save();

      return NextResponse.json({
        success: true,
        message:
          "Password has been reset successfully.",
        accountType: "student",
      });
    }

    // ==================================================
    // FIND LIBRARIAN
    // ==================================================

    const librarian = await Librarian.findOne({
      resetPasswordToken: hashedToken,
    });

    if (librarian) {
      console.log(
        "LIBRARIAN RESET TOKEN FOUND"
      );

      console.log(
        "TOKEN EXPIRATION:",
        librarian.resetPasswordExpires
      );

      if (
        !librarian.resetPasswordExpires ||
        librarian.resetPasswordExpires <= new Date()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This password reset link has expired.",
          },
          { status: 400 }
        );
      }

      const hashedPassword =
        await bcrypt.hash(password, 12);

      librarian.password = hashedPassword;

      librarian.resetPasswordToken = null;
      librarian.resetPasswordExpires = null;

      await librarian.save();

      return NextResponse.json({
        success: true,
        message:
          "Password has been reset successfully.",
        accountType: "libraryAttendant",
      });
    }

    // ==================================================
    // FIND AUTHOR
    // ==================================================

    const author = await Author.findOne({
      resetPasswordToken: hashedToken,
    });

    if (author) {
      console.log(
        "AUTHOR RESET TOKEN FOUND"
      );

      console.log(
        "TOKEN EXPIRATION:",
        author.resetPasswordExpires
      );

      if (
        !author.resetPasswordExpires ||
        author.resetPasswordExpires <= new Date()
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This password reset link has expired.",
          },
          { status: 400 }
        );
      }

      const hashedPassword =
        await bcrypt.hash(password, 12);

      author.password = hashedPassword;

      author.resetPasswordToken = null;
      author.resetPasswordExpires = null;

      await author.save();

      return NextResponse.json({
        success: true,
        message:
          "Password has been reset successfully.",
        accountType: "author",
      });
    }

    // ==================================================
    // TOKEN NOT FOUND
    // ==================================================

    console.log(
      "NO ACCOUNT FOUND FOR RESET TOKEN"
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "This password reset link is invalid or expired.",
      },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}