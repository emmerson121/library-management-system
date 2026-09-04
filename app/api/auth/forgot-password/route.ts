import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer"

import connectToDB from "@/lib/db";

import Student from "@/models/student";
import Author from "@/models/author";
import Librarian from "@/models/librarian";

// ======================================================
// POST /api/auth/forgot-password
// ======================================================

export async function POST(req: NextRequest) {
  try {
    // ==================================================
    // CONNECT TO DATABASE
    // ==================================================

    await connectToDB();

    // ==================================================
    // GET EMAIL
    // ==================================================

    const body = await req.json();

    const email = body.email;

    // ==================================================
    // VALIDATE EMAIL
    // ==================================================

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();

    // ==================================================
    // FIND ACCOUNT
    // ==================================================

    let account:
      | typeof Student.prototype
      | typeof Librarian.prototype
      | typeof Author.prototype
      | null = null;

    let accountType = "";

    // --------------------------------------------------
    // 1. CHECK STUDENT
    // --------------------------------------------------

    const student = await Student.findOne({
      email: normalizedEmail,
    });

    if (student) {
      account = student;
      accountType = "student";
    }

    // --------------------------------------------------
    // 2. CHECK LIBRARIAN
    // --------------------------------------------------

    if (!account) {
      const librarian = await Librarian.findOne({
        email: normalizedEmail,
      });

      if (librarian) {
        account = librarian;
        accountType = "libraryAttendant";
      }
    }

    // --------------------------------------------------
    // 3. CHECK AUTHOR
    // --------------------------------------------------

    if (!account) {
      const author = await Author.findOne({
        email: normalizedEmail,
      });

      if (author) {
        account = author;
        accountType = "author";
      }
    }

    // ==================================================
    // ACCOUNT NOT FOUND
    // ==================================================

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          message: "No account found with this email address.",
        },
        { status: 404 }
      );
    }

    // ==================================================
    // GENERATE RESET TOKEN
    // ==================================================

    const resetToken = crypto.randomBytes(32).toString("hex");

    // ==================================================
    // HASH TOKEN BEFORE STORING
    // ==================================================

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // ==================================================
    // TOKEN EXPIRATION
    // 15 MINUTES
    // ==================================================

    const resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // ==================================================
    // SAVE RESET TOKEN
    // ==================================================

    account.resetPasswordToken = hashedToken;
    account.resetPasswordExpires = resetPasswordExpires;

    await account.save();

    // ==================================================
    // CREATE RESET URL
    // ==================================================

    const resetUrl =
      `${req.nextUrl.origin}/reset-password?token=${resetToken}`;

   // =====================================================
    // CREATE EMAIL TRANSPORTER
    // =====================================================

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // =====================================================
    // SEND EMAIL
    // =====================================================

    await transporter.sendMail({
      from: `"Meridian Library" <${process.env.EMAIL_USER}>`,
      to: account.email,
      subject: "Meridian Library - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          
          <h2 style="color: #0093cde3;">
            Password Reset
          </h2>

          <p>
            Hello ${account.title},
          </p>

          <p>
            We received a request to reset your Meridian Library password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <div style="margin: 30px 0; text-align: center;">
            <a
              href="${resetUrl}"
              style="
                background: #0093cde3;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 8px;
                display: inline-block;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </div>

          <p>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

          <p>
            Regards,<br />
            Meridian Library
          </p>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,

      message:
        "Password reset link generated successfully.",

      accountType,

      // ------------------------------------------------
      // DEVELOPMENT ONLY
      // Remove this before production.
      // ------------------------------------------------

      resetUrl,
    });
  } catch (error: unknown) {
    console.error(
      "FORGOT PASSWORD ERROR:",
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