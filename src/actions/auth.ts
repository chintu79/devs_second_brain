"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Registration failed. Please try again." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", { email, password, redirect: false });
    return { success: true, redirect: "/onboard" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: `Registration failed: ${error instanceof Error ? error.message : "Unknown error"}` };
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
