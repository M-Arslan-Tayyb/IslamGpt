/* eslint-disable no-unused-vars */
import { toast } from "react-hot-toast";
import { endpoints, localStorage_values } from "../apiEndPoints";
import { apiConnector } from "../apiConnector";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setToken } from "../../features/slices/auth/authSlice";
import { setUser } from "../../features/slices/auth/profile";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../features/slices/auth/profile";
import { clearToken } from "../../features/slices/auth/authSlice";
// Define unique keys for your project
const TOKEN_KEY = localStorage_values.TOKEN_KEY;
const USER_KEY = localStorage_values.USER_KEY;

const SECRET_KEY = import.meta.env.VITE_LOCALSTORAGE_SECRET_KEY;

const {
  LOGIN_API,
  SIGNUP_API,
  FORGOT_PASSWORD,
  VERIFY_OTP_API,
  RESEND_OTP_API,
  RESET_PASSWORD_API,
} = endpoints;

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ email, password }) => {
      return apiConnector("POST", LOGIN_API, { email, password });
    },
    onMutate: () => {
      toast.loading("Logging in...");
    },
    onSuccess: (response) => {
      toast.dismiss();
      // if (!response.data.success) {
      //     throw new Error(response.data.message);
      // }
      // console.log(response)
      // Encrypt function
      const encrypt = (data) => {
        return CryptoJS.AES.encrypt(
          JSON.stringify(data),
          SECRET_KEY
        ).toString();
      };

      // Decrypt function
      const decrypt = (cipherText) => {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      };

      toast.success(response.message);
      const firstName = response.data.data.First_Name;
      const lastName = response.data.data.Last_Name;

      // Dispatch user details to Redux store
      dispatch(setUser({ firstName, lastName }));

      // Set token in localStorage and Redux store
      // console.log("the token value is:", response.data.data.access_token);
      const encryptedToken = encrypt(response.data.data.access_token);
      localStorage.setItem(TOKEN_KEY, encryptedToken);
      dispatch(setToken(response.data.data.access_token));

      // Set user in localStorage
      const encryptedUser = encrypt({ firstName, lastName });
      localStorage.setItem(USER_KEY, encryptedUser);

      // Set user in Redux store
      // dispatch(setUser(response.data.user));

      // queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      toast.dismiss();
      console.log(error);
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
      // console.error('LOGIN API ERROR:', error);
    },
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: ({ firstname, lastname, email, password }) => {
      return apiConnector("POST", SIGNUP_API, {
        firstname,
        lastname,
        email,
        password,
      });
    },
    onMutate: () => {
      toast.loading("Signing up...");
    },
    onSuccess: (response) => {
      toast.dismiss();

      toast.success("Registered Successfully");
      console.log("Signup response:", response);
    },
    onError: (error) => {
      toast.dismiss();
      const errorMessage = error.response?.data?.message || "Signup failed";
      toast.error(errorMessage);
      console.error("SIGNUP ERROR:", error);
    },
  });
}

// Add this new custom hook for forgot password
export function useForgotPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email) => {
      return apiConnector("POST", FORGOT_PASSWORD, { email });
    },
    onMutate: () => {
      toast.loading("Sending verification code...");
    },
    onSuccess: (response) => {
      toast.dismiss();
      toast.success(response.message || "Verification code sent successfully");
      console.log("FORGOT PASSWORD RESPONSE:", response);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "Failed to send verification code"
      );
    },
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (data) => {
      return apiConnector("POST", VERIFY_OTP_API, data);
    },
    onMutate: () => {
      toast.loading("Verifying OTP...");
    },
    onSuccess: (response) => {
      toast.dismiss();
      toast.success(response.message || "OTP verified successfully");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
    },
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (email) => {
      return apiConnector("POST", RESEND_OTP_API, { email });
    },
    onMutate: () => {
      toast.loading("Resending OTP...");
    },
    onSuccess: (response) => {
      toast.dismiss();
      toast.success(response.message || "OTP resent successfully");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data) => {
      return apiConnector("POST", RESET_PASSWORD_API, data);
    },
    onMutate: () => {
      toast.loading("Resetting password...");
    },
    onSuccess: (response) => {
      toast.dismiss();
      toast.success(response.message || "Password reset successfully");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Failed to reset password");
    },
  });
}

export function useLogout() {
  const dispatch = useDispatch(); // useDispatch is now declared
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // Clear user data from Redux store
      dispatch(clearToken());
      dispatch(clearUser());

      // Clear all queries from React Query cache
      queryClient.clear();

      // Invalidate and refetch auth query to trigger UI update
      await queryClient.invalidateQueries(["auth"]);

      // Show success message
      toast.success("Logged out successfully!");

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return logout;
}
