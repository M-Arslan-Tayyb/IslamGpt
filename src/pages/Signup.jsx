import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import logo from '../assets/images/general/finalLogo.png'
// import bgImage from '../assets/images/general/Login-bg-img.webp'
import bgImage from '../assets/images/mosques/mosImage7.svg'
import { useSignUpMutation } from '../apis/Auth/authApi'
import toast from 'react-hot-toast/headless'

const Signup = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        acceptTerms: false,
    })
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    const signUp = useSignUpMutation()
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.acceptTerms) {
            toast.error('Please accept the Terms & Conditions and Privacy Policy')
            return
        }

        signUp.mutate({
            firstname: formData.firstName,
            lastname: formData.lastName,
            email: formData.email,
            password: formData.password,
        },
            {
                onSuccess: () => {
                    console.log("User signed up successfully")
                    navigate("/login")
                },
                onError: (error) => {
                    console.log("Error signing up", error)
                },
            })
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Background Image Section */}
            <div
                className="hidden lg:block lg:w-1/2 bg-cover bg-center ml-6 mt-6"
                style={{ backgroundImage: `url(${bgImage})` }}
            />

            {/* Signup Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-bg-light">
                <div className="w-full max-w-md ">
                    {/* Logo */}
                    <div className="flex items-center justify-center">
                        <img src={logo} alt="Islam GPT logo" className="w-16 h-16" />
                        <span className="text-[var(--primary-color)] text-2xl font-semibold relative right-3 top-1">IslamGPT</span>
                    </div>

                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Create a new account by filling out the registration form
                        </p>
                    </div>

                    {/* Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* First Name and Last Name Fields */}
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Enter your First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Enter your Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Your Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-center">
                            <input
                                id="acceptTerms"
                                name="acceptTerms"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                                I have read and accept the{' '}
                                <Link to="https://islam-gpt-landing-page.vercel.app/" className="text-primary hover:text-primary-dark">
                                    Terms & Conditions
                                </Link>{' '}
                                and{' '}
                                <Link to="https://islam-gpt-landing-page.vercel.app/" className="text-primary hover:text-primary-dark">
                                    Privacy policy
                                </Link>
                            </label>
                        </div>

                        {/* Signup Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup