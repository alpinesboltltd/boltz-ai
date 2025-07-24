import { FirebaseErrorMessage } from "@/types";

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
