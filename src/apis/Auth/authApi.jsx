/* eslint-disable no-unused-vars */
import { toast } from "react-hot-toast";
import { endpoints } from "../apiEndPoints";
import { apiConnector } from "../apiConnector";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";





const {

    LOGIN_API,
    SIGNUP_API
} = endpoints;


export function useLoginMutation() {
    const queryClient = useQueryClient();
    // const dispatch = useDispatch();

    return useMutation({
        mutationFn: ({ email, password }) => {
            return apiConnector('POST', LOGIN_API, { email, password });
        },
        onMutate: () => {
            toast.loading('Logging in...');
        },
        onSuccess: (response) => {
            toast.dismiss();
            // if (!response.data.success) {
            //     throw new Error(response.data.message);
            // }
            console.log(response)

            toast.success(response.message);
            console.log("Login response:", response);

            // Set token in localStorage and Redux store
            // localStorage.setItem('token', JSON.stringify(response.data.token));
            // dispatch(setToken(response.data.token));

            // // Set user in Redux store
            // dispatch(setUser(response.data.user));

            // Fetch followers and following


            // queryClient.invalidateQueries(['user']);
        },
        onError: (error) => {
            toast.dismiss()
            console.log(error)
            console.log(error?.response?.data?.message)
            toast.error(error?.response?.data?.message);
            // console.error('LOGIN API ERROR:', error);
        },
    });
}


export function useSignUpMutation() {
    return useMutation({
        mutationFn: ({ firstname, lastname, email, password }) => {
            return apiConnector('POST', SIGNUP_API, {

                firstname,
                lastname,
                email,
                password,

            });
        },
        onMutate: () => {
            toast.loading('Signing up...');
        },
        onSuccess: (response) => {
            toast.dismiss();

            toast.success('Registered Successfully');
            console.log("Signup response:", response);
        },
        onError: (error) => {
            toast.dismiss();
            const errorMessage = error.response?.data?.message || 'Signup failed';
            toast.error(errorMessage);
            console.error('SIGNUP ERROR:', error);
        },
    });
}

