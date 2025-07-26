import { auth } from "@/configs/firebase";
import { AuthRequestMethods, FirebaseErrorMessage } from "@/types";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";

/**
 * Utility function to conditionally join class names
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Utility function to return signin with email and password error messages
 */

export function handleFirebaseErrorMessage(code: string): string {
  switch (code) {
    case FirebaseErrorMessage.userNotFound:
    case FirebaseErrorMessage.wrongPassword:
      return "Invalid email or password";
    case FirebaseErrorMessage.tooManyRequests:
      return "Too many attempts account temporarily locked";
    case FirebaseErrorMessage.userDisabled:
      return "This account has been disabled";
    case FirebaseErrorMessage.accountExistWithDifferentCredentials:
      return "This email is already registred with another method";
    case FirebaseErrorMessage.popUpClosedByUser:
      return "popup was closed before completing";
    case FirebaseErrorMessage.cancelledPopupRequest:
      return "Only one popup request allowed at a time";
    case FirebaseErrorMessage.popupBlocked:
      return "Popup was blocked by your browser";
    case FirebaseErrorMessage.networkFailure:
      return "Network error. Please check your connection";
    default:
      return "An unknown error occured";
  }
}

export async function socialSignIn(method: AuthRequestMethods): Promise<User> {
  let user: User | undefined;
  switch (method) {
    case AuthRequestMethods.google:
      {
        const googleProvider = new GoogleAuthProvider();
        try {
          const { user: userdata } = await signInWithPopup(
            auth,
            googleProvider
          );
          user = userdata;
        } catch (error) {}
      }
      break;
    case AuthRequestMethods.github:
      {
        const githubProvider = new GithubAuthProvider();
        try {
          const { user: userdata } = await signInWithPopup(
            auth,
            githubProvider
          );
          user = userdata;
        } catch (error) {}
      }
      break;
    default:
      user = undefined;
      throw new Error("Authentication method not supported");
  }
  if (!user) {
    throw new Error("Credentials not found");
  }
  return user;
}
