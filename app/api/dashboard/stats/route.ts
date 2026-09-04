import { NextResponse } from "next/server";

import connectToDB from "@/lib/db";
import Author from "@/models/author";
import Librarian from "@/models/librarian";

export async function GET() {
  try {
    await connectToDB();

    const authorCount = await Author.countDocuments();
    const librarianCount = await Librarian.countDocuments();

    return NextResponse.json({
      success: true,
      authorCount,
      librarianCount,
    });
  } catch (error: unknown) {
    console.error("DASHBOARD STATS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch dashboard statistics",
      },
      { status: 500 }
    );
  }
}