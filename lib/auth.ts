import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  role: "student" | "author" | "libraryAttendant";
}

export function getAuthenticatedUser(
  req: NextRequest
): AuthUser | null {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return null;
    }

    if (!authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
      throw new Error(
        "JWT_SECRET_KEY is not configured"
      );
    }

    const decoded = jwt.verify(
      token,
      secret
    ) as AuthUser;

    return decoded;
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return null;
  }
}