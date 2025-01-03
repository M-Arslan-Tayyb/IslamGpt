import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import resetImage from '../assets/images/general/Reset_password.svg'
import logo from '../assets/images/general/finalLogo.png'
import { useResetPasswordMutation } from '../apis/Auth/authApi'
import { toast } from 'react-hot-toast'

const ResetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const email = location.state?.email

    const resetPasswordMutation = useResetPasswordMutation()

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password')
        }
    }, [email, navigate])

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }

        resetPasswordMutation.mutate(
            { new_password: newPassword, email },
            {
                onSuccess: () => {
                    toast.success('Password reset successfully')
                    navigate('/login')
                },
                onError: (error) => {
                    setError(error?.response?.data?.message || 'Failed to reset password')
                }
            }
        )
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Background Section */}
            <div
                className="hidden lg:block lg:w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${resetImage})`,
                }}
            ></div>

            {/* Reset Password Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center justify-center mb-4">
                        <img src={logo} alt="Logo" className="w-16 h-16" />
                        <span className="text-[var(--primary-color)] text-2xl font-semibold relative right-3 top-1">
                            IslamGPT
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Reset Password
                    </h2>
                    <p className="text-center text-gray-600 mb-6 text-sm">
                        Enter your new password below
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="new-password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>
                            <input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[var(--primary-color)] text-white py-2 rounded-md hover:bg-primary-dark transition"
                            disabled={resetPasswordMutation.isLoading}
                        >
                            {resetPasswordMutation.isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword