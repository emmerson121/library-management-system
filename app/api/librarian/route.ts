import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectToDB from "@/lib/db";
import Librarian from "@/models/librarian";

// ============================================================
// GET ALL LIBRARIANS
// ============================================================
//
// GET /api/librarian
//
// Returns all librarians.
//
// Passwords are excluded from the response.
// Staff ID is included because it is used when borrowing books.
//
// Example response:
//
// {
//   success: true,
//   count: 2,
//   librarians: [
//     {
//       id: "...",
//       title: "John Doe",
//       email: "john@example.com",
//       staffId: "LIB001"
//     }
//   ]
// }
//

export async function GET() {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Get all librarians
    const librarians = await Librarian.find()
      .select("-password")
      .sort({ createdAt: -1 });

    // Format the response
    const formattedLibrarians = librarians.map(
      (librarian) => ({
        id: String(librarian._id),
        title: librarian.title,
        email: librarian.email,

        // Important:
        // This is the Staff ID used for borrowing.
        // Example: LIB001
        staffId: librarian.staffId,

        createdAt: librarian.createdAt,
        updatedAt: librarian.updatedAt,
      })
    );

    return NextResponse.json({
      success: true,
      count: formattedLibrarians.length,
      librarians: formattedLibrarians,
    });
  } catch (error: unknown) {
    console.error(
      "GET LIBRARIANS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch librarians",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// ADD LIBRARIAN
// ============================================================
//
// POST /api/librarian
//
// Body:
//
// {
//   "title": "John Doe",
//   "email": "john@example.com",
//   "password": "password123"
// }
//
// You DO NOT send staffId.
//
// The Librarian model automatically generates:
//
// LIB001
// LIB002
// LIB003
//
// ============================================================

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Get request body
    const body = await req.json();

    const {
      title,
      email,
      password,
    } = body;

    // --------------------------------------------------------
    // Validate required fields
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Validate password length
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Normalize email
    // --------------------------------------------------------

    const normalizedEmail = email
      .toLowerCase()
      .trim();

    // --------------------------------------------------------
    // Check if email already exists
    // --------------------------------------------------------

    const existingLibrarian =
      await Librarian.findOne({
        email: normalizedEmail,
      });

    if (existingLibrarian) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A librarian with this email already exists",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Hash password
    // --------------------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // --------------------------------------------------------
    // Create librarian
    // --------------------------------------------------------
    //
    // DO NOT provide staffId here.
    //
    // Your model generates it automatically:
    //
    // First librarian  → LIB001
    // Second librarian → LIB002
    // Third librarian  → LIB003
    //
    // --------------------------------------------------------

    const librarian = await Librarian.create({
      title: title.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // --------------------------------------------------------
    // Return created librarian
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Librarian created successfully",

        librarian: {
          id: String(librarian._id),
          title: librarian.title,
          email: librarian.email,

          // Automatically generated Staff ID
          // Example: LIB001
          staffId: librarian.staffId,

          createdAt: librarian.createdAt,
          updatedAt: librarian.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(
      "CREATE LIBRARIAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create librarian",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// UPDATE LIBRARIAN
// ============================================================
//
// PUT /api/librarian
//
// Body:
//
// {
//   "id": "MONGODB_ID",
//   "title": "John Updated",
//   "email": "johnupdated@example.com",
//   "password": "newpassword123"
// }
//
// You don't need to send all fields.
//
// Staff ID is NOT changed.
//
// Example:
//
// LIB001 remains LIB001.
//
// ============================================================

export async function PUT(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Get request body
    const body = await req.json();

    const {
      id,
      title,
      email,
      password,
    } = body;

    // --------------------------------------------------------
    // ID is required
    // --------------------------------------------------------

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Librarian ID is required",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Find librarian
    // --------------------------------------------------------

    const librarian =
      await Librarian.findById(id);

    if (!librarian) {
      return NextResponse.json(
        {
          success: false,
          message: "Librarian not found",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------------
    // Update title
    // --------------------------------------------------------

    if (title) {
      librarian.title = title.trim();
    }

    // --------------------------------------------------------
    // Update email
    // --------------------------------------------------------

    if (email) {
      const normalizedEmail = email
        .toLowerCase()
        .trim();

      // Check if another librarian already
      // uses this email.
      const existingLibrarian =
        await Librarian.findOne({
          email: normalizedEmail,
          _id: { $ne: id },
        });

      if (existingLibrarian) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another librarian already uses this email",
          },
          { status: 400 }
        );
      }

      librarian.email = normalizedEmail;
    }

    // --------------------------------------------------------
    // Update password
    // --------------------------------------------------------

    if (password) {
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

      librarian.password =
        await bcrypt.hash(password, 10);
    }

    // --------------------------------------------------------
    // IMPORTANT:
    //
    // We do NOT modify librarian.staffId.
    //
    // If the librarian has:
    //
    // LIB001
    //
    // it stays:
    //
    // LIB001
    // --------------------------------------------------------

    await librarian.save();

    // --------------------------------------------------------
    // Return updated librarian
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Librarian updated successfully",

      librarian: {
        id: String(librarian._id),
        title: librarian.title,
        email: librarian.email,

        // Staff ID remains unchanged
        staffId: librarian.staffId,

        createdAt: librarian.createdAt,
        updatedAt: librarian.updatedAt,
      },
    });
  } catch (error: unknown) {
    console.error(
      "UPDATE LIBRARIAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update librarian",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE LIBRARIAN
// ============================================================
//
// DELETE /api/librarian
//
// Body:
//
// {
//   "id": "MONGODB_ID"
// }
//
// ============================================================

export async function DELETE(
  req: NextRequest
) {
  try {
    // Connect to MongoDB
    await connectToDB();

    // Get request body
    const body = await req.json();

    const { id } = body;

    // --------------------------------------------------------
    // Validate ID
    // --------------------------------------------------------

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Librarian ID is required",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------------
    // Find librarian
    // --------------------------------------------------------

    const librarian =
      await Librarian.findById(id);

    if (!librarian) {
      return NextResponse.json(
        {
          success: false,
          message: "Librarian not found",
        },
        { status: 404 }
      );
    }

    // Save information before deleting
    const deletedLibrarian = {
      id: String(librarian._id),
      title: librarian.title,
      email: librarian.email,
      staffId: librarian.staffId,
    };

    // --------------------------------------------------------
    // Delete librarian
    // --------------------------------------------------------

    await Librarian.findByIdAndDelete(id);

    // --------------------------------------------------------
    // Return deleted librarian
    // --------------------------------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Librarian deleted successfully",
      librarian: deletedLibrarian,
    });
  } catch (error: unknown) {
    console.error(
      "DELETE LIBRARIAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete librarian",
      },
      { status: 500 }
    );
  }
}

