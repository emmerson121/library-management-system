import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/db";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { title, email, password, role } = await req.json();
    console.log("Received data:", { title, email, password, role });

    // Validation
    if (!title || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      title,
      email,
      password: hashedPassword,
      role,
    });
    //   email,
    //   password: hashedPassword,
    //   role,
    // });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          title: user.title,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}