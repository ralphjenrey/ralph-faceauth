import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { username, password } = req;
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.password !== password) {
      // Similarly, return a specific response instead of throwing an error
      return new NextResponse(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const userInfo = {
      username: user.username,
      faceID: user.faceID,
    };

    // Return user or some success message
    return NextResponse.json(userInfo);
  } catch (error) {
    // Handle any unexpected errors that occurred during the process
    // Log the error or return a generic error message
    console.error("An error occurred:", error);
    throw new Error("Failed to sign in. Network error.");
  }
}
