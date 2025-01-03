// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import opt_image from '../assets/images/general/otp_verification.svg'
import logo from '../assets/images/general/finalLogo.png'
import { useVerifyOtpMutation, useResendOtpMutation } from '../apis/Auth/authApi'

const VerifyOtp = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timeLeft, setTimeLeft] = useState(60)
    const [error, setError] = useState('')
    const inputRefs = useRef([])
    const email = location.state?.email

    const verifyOtpMutation = useVerifyOtpMutation()
    const resendOtpMutation = useResendOtpMutation()

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password')
            return
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [email, navigate])

    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError('')

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpString = otp.join('')

        if (otpString.length !== 6) {
            setError('Please enter all 6 digits')
            return
        }

        verifyOtpMutation.mutate(
            { email, otp: otpString },
            {
                onSuccess: () => {
                    navigate('/reset-password', { state: { email, otp: otpString } })
                },
                onError: (error) => {
                    setError(error?.response?.data?.message || 'Invalid OTP')
                }
            }
        )
    }

    const handleResendOtp = () => {
        resendOtpMutation.mutate(email, {
            onSuccess: () => {
                setTimeLeft(60)
                setOtp(['', '', '', '', '', ''])
                setError('')
            }
        })
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row justify-center items-center">
            {/* Background Section */}
            <div className="hidden lg:block lg:w-2/5 flex justify-center items-center">
                <img
                    src={opt_image}
                    alt="otp_image"
                    className="w-[100%]"
                />
            </div>





            {/* OTP Verification Section */}
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
                        Verify OTP
                    </h2>
                    <p className="text-center text-gray-600 mb-6 text-sm">
                        Enter the verification code sent to {email}
                    </p>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center border border-[var(--primary-color)] rounded-lg text-lg font-semibold focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <div className="text-center">
                            {timeLeft > 0 ? (
                                <p className="text-sm text-gray-600">
                                    OTP expires in {timeLeft} seconds
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="px-2 py-1 bg-[var(--text-bg-hover)] rounded text-primary-dark text-sm"
                                    disabled={resendOtpMutation.isLoading}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full  text-white py-2 rounded-md bg-[var(--primary-color)] hover:bg-primary-dark  transition"
                            disabled={verifyOtpMutation.isLoading}
                        >
                            {verifyOtpMutation.isLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default VerifyOtp