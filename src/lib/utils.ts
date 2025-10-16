import { auth } from "@/configs/firebase";
import { AuthRequestMethods, FirebaseErrorMessage, Profile } from "@/types";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import DOMPurify from "isomorphic-dompurify";

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

export async function socialSignIn(
  method: AuthRequestMethods
): Promise<Profile> {
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
        } catch {
          // Error handled by returning undefined user
        }
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
        } catch {
          // Error handled by returning undefined user
        }
      }
      break;
    default:
      user = undefined;
      throw new Error("Authentication method not supported");
  }
  if (!user) {
    throw new Error("Credentials not found");
  }

  const payload = { id_token: user.getIdToken() };
  const response = await fetch("api/v1/auth/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Signin failed");
  }
  const profile = response.json();
  console.log(profile);
  return profile as unknown as Profile;
}

/*
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 2), 16);
  const g = parseInt(hex.slice(3, 2), 16);
  const b = parseInt(hex.slice(5, 2), 16);
  const luminance = getLuminance(r, g, b);

  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

function hexToRGB(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function getContrastRatio(bgHex: string, textHex: string): number {
  const [r1, g1, b1] = hexToRGB(bgHex);
  const [r2, g2, b2] = hexToRGB(textHex);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG standards
// TODO: implement at the backend
export function getAccessibleTextColor(bgHex: string): string {
  const white = "#FFFFFF";
  const black = "#000000";
  const contrastWhite = getContrastRatio(bgHex, white);
  const contrastBlack = getContrastRatio(bgHex, black);
  console.log(contrastWhite >= contrastBlack ? white : black);
  console.log("BLACK: ", contrastBlack, "\nWHITE: ", contrastWhite);
  // WCAG recommends at least 4.5:1 contrast ratio for normal text
  return contrastWhite >= contrastBlack ? white : black;
}
*/

function hexToRGB(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function getLuminance(r: number, g: number, b: number): number {
  // Convert RGB to relative luminance using WCAG formula
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function getContrastRatio(bgHex: string, textHex: string): number {
  const [r1, g1, b1] = hexToRGB(bgHex);
  const [r2, g2, b2] = hexToRGB(textHex);
  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getAccessibleTextColor(
  bgHex: string,
  targetRatio: number = 4.5
): string {
  const white = "#FFFFFF";
  const black = "#000000";
  const darkGray = "#333333";
  const lightGray = "#CCCCCC";

  const contrastWhite = getContrastRatio(bgHex, white);
  const contrastBlack = getContrastRatio(bgHex, black);
  const contrastDarkGray = getContrastRatio(bgHex, darkGray);
  const contrastLightGray = getContrastRatio(bgHex, lightGray);

  // Find all colors that meet the target contrast ratio
  const validColors = [
    { color: white, contrast: contrastWhite },
    { color: black, contrast: contrastBlack },
    { color: darkGray, contrast: contrastDarkGray },
    { color: lightGray, contrast: contrastLightGray },
  ].filter((item) => item.contrast >= targetRatio);

  // If we have valid colors, return the one with highest contrast
  if (validColors.length > 0) {
    return validColors.reduce((best, current) =>
      current.contrast > best.contrast ? current : best
    ).color;
  }

  // Fallback: return the color with better contrast even if it doesn't meet target
  console.warn(
    `No color meets WCAG ${targetRatio}:1 ratio for background ${bgHex}`
  );
  console.log(
    "Contrast ratios - BLACK:",
    contrastBlack.toFixed(2),
    "WHITE:",
    contrastWhite.toFixed(2)
  );

  return contrastWhite >= contrastBlack ? white : black;
}

// Enhanced version that can generate custom colors if needed
export function getOptimalTextColor(
  bgHex: string,
  targetRatio: number = 4.5
): string {
  const basicResult = getAccessibleTextColor(bgHex, targetRatio);

  // If basic colors work, use them
  const basicContrast = getContrastRatio(bgHex, basicResult);
  if (basicContrast >= targetRatio) {
    return basicResult;
  }

  // Otherwise, try to generate a better color
  const [bgR, bgG, bgB] = hexToRGB(bgHex);
  const bgLuminance = getLuminance(bgR, bgG, bgB);

  // Calculate target luminance for desired contrast ratio
  const targetLightLuminance = (bgLuminance + 0.05) * targetRatio - 0.05;
  const targetDarkLuminance = (bgLuminance + 0.05) / targetRatio - 0.05;

  // Choose the target that's within valid range [0, 1]
  let targetLuminance: number;
  if (targetLightLuminance <= 1) {
    targetLuminance = targetLightLuminance;
  } else if (targetDarkLuminance >= 0) {
    targetLuminance = targetDarkLuminance;
  } else {
    // No valid solution exists, return best available
    return basicResult;
  }

  // Convert target luminance back to RGB (simplified - uses grayscale)
  const targetGray =
    targetLuminance <= 0.0031308
      ? targetLuminance * 12.92
      : 1.055 * Math.pow(targetLuminance, 1 / 2.4) - 0.055;

  const grayValue = Math.round(Math.max(0, Math.min(255, targetGray * 255)));
  const hexGray = grayValue.toString(16).padStart(2, "0");

  return `#${hexGray}${hexGray}${hexGray}`;
}

// Sanitize static content to prevent XSS
export const sanitizedContent = (content: string) =>
  DOMPurify.sanitize(content);
