const BASE_URL = import.meta.env.VITE_BASE_URL;

export const endpoints = {
  //   SIGNUP_API: BASE_URL + "/signup",
  LOGIN_API: BASE_URL + "/login",
  SIGNUP_API: BASE_URL + "/signup",
  FORGOT_PASSWORD: BASE_URL + "/forgot-password",
  VERIFY_OTP_API: BASE_URL + "/verify-otp",
  RESEND_OTP_API: BASE_URL + "/resend-otp",
  RESET_PASSWORD_API: BASE_URL + "/reset-password",
};

export const dashboard_endpoints = {
  AYAH_HADITH_API: BASE_URL + "/fetch-ayah-hadith",
};

export const chat_endpoints = {
  GENERATE_AI: BASE_URL + "/generate",
  GET_LISTING: BASE_URL + "/get-listing",
  GET_HISTORY: BASE_URL + "/get-history",
};

export const localStorage_values = {
  TOKEN_KEY: "islamgpt_token",
  USER_KEY: "islamgpt_user",
};
