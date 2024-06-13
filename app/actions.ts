"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Create a new account
export async function createAccount(formData: FormData) {
  try {
    const username = formData.get("username");
    const password = formData.get("password");
    const faceID = formData.get("faceID");

    if (typeof username !== "string" || typeof password !== "string") {
      throw new Error("Username and password must be strings");
    }

    if (typeof faceID !== "string") {
      throw new Error("FaceID not found");
    }

    const user = await prisma.user.create({
      data: {
        username: username,
        password: password,
        faceID: JSON.parse(faceID),
      },
    });

    if (!user) {
      throw new Error("Failed to create user");
    }

    // Return user or some success message
    return user;
  } catch (error) {
    // Handle or log the error appropriately
    console.error("Error creating account:", error);
    throw error; // Rethrow or handle as needed
  }
}
