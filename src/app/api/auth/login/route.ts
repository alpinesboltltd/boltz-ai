import { auth } from "@/configs/firebase";
import { handleFirebaseErrorMessage } from "@/lib/utils";
import { AuthRequestMethods, FirebaseErrorMessage } from "@/types";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, method } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Invalid login credentials" });
  }
  try {
    if (method === AuthRequestMethods.password) {
      if (!password) {
        return NextResponse.json({ error: "Invalid login credentials" });
      }

      try {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        return NextResponse.json({ success: true, user });
      } catch (error) {
        if (error instanceof FirebaseError) {
          let message = handleFirebaseErrorMessage(error.code);
          return NextResponse.json({ success: false, message });
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
