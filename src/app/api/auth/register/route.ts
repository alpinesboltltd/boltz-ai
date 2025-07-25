import { auth } from "@/configs/firebase";
import { handleFirebaseErrorMessage } from "@/lib/utils";
import { AuthRequestMethods } from "@/types";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, password, method } = await request.json();

  if (!name || !email || !password || !method) {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 }
    );
  }
  try {
    if (method === AuthRequestMethods.password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        return NextResponse.json(
          { success: true, message: "Registration complete" },
          { status: 201 }
        );
      } catch (error) {
        if (error instanceof FirebaseError) {
          const message = handleFirebaseErrorMessage(error.code);
          throw Error(message);
        }
        throw error;
      }
    }
  } catch (error) {
    console.log(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    NextResponse.json({ message }, { status: 500 });
  }
}
