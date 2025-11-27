import { auth } from "@/configs/firebase";
import { handleFirebaseErrorMessage } from "@/lib/utils";
import { AuthRequestMethods } from "@/types";
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

        // Get Firebase ID token
        const idToken = await user.getIdToken();
        
        // Verify with external server to get auth token
        const verifyResponse = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });

        if (!verifyResponse.ok) {
          throw new Error("Failed to verify with server");
        }

        const { user: profileUser, token } = await verifyResponse.json();

        return NextResponse.json({ success: true, user: profileUser, token });
      } catch (error) {
        if (error instanceof FirebaseError) {
          const message = handleFirebaseErrorMessage(error.code);
          return NextResponse.json({ success: false, message });
        }
        throw error;
      }
    }
  } catch (error) {
    console.log(error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
