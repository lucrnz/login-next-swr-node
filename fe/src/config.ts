export const APP_NAME = "Notes App";
export const defaultPageLoggedIn = "/notes";
export const displayNoteMaxLines = 5;
export const enableCaptcha =
  (process.env["NEXT_PUBLIC_ENABLE_CAPTCHA"] || "false").toLowerCase() ===
  "true";
