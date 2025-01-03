import bgImage from '../assets/images/general/ForgotPass.svg'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/images/general/finalLogo.png'
import { useForgotPasswordMutation } from '../apis/Auth/authApi'
import { toast } from 'react-hot-toast'

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const forgotPasswordMutation = useForgotPasswordMutation()

    const handleChange = (e) => {
        setEmail(e.target.value)
        setError('') // Reset error on input change
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email) {
            setError('Email is required')
            return
        }
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email')
            return
        }

        forgotPasswordMutation.mutate(email, {
            onSuccess: () => {
                setSuccess(true)
                navigate('/verify-otp', { state: { email } })
            },
            onError: (error) => {
                setError(error?.response?.data?.message || 'Failed to send verification code. Try again later.')
            },
        })
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Background Section */}
            <div
                className="hidden lg:block lg:w-1/2 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${bgImage})`,
                }}
            ></div>

            {/* Forgot Password Section */}
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
                        Forgot Password
                    </h2>
                    <p className="text-center text-gray-600 mb-6 text-sm">
                        Enter the email address you used when you joined.
                    </p>

                    {/* Form */}
                    {success ? (
                        <div className="text-green-500 text-center">
                            Verification code sent to your email!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Your Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={`mt-1 block w-full px-3 py-2 border ${error
                                        ? 'border-red-500'
                                        : 'border-gray-300 focus:ring-primary focus:border-primary'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none`}
                                />
                                {error && (
                                    <p className="text-red-500 text-sm mt-1">{error}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[var(--primary-color)] text-white py-2 rounded-md hover:bg-primary-dark transition"
                                disabled={forgotPasswordMutation.isLoading}
                            >
                                {forgotPasswordMutation.isLoading ? 'Sending...' : 'Send Verification Code'}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Remember the password?{' '}
                            <Link
                                to="/login"
                                className="text-[var(--primary-color)] hover:text-primary-dark font-medium"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword