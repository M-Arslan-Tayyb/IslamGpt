import React, { useState } from 'react'
import { Send } from 'lucide-react'
import decorate_image from '../../assets/images/dashboard/decorate.svg'

const ChatInterface = ({ userName = 'Guest' }) => {
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setMessage('')
    }

    return (
        <div className="w-full  mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="relative">
                <img
                    src={decorate_image}
                    alt=""
                    className="w-full object-cover"
                />
            </div>
            <div className="text-center p-16">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Salaam, {userName}
                </h2>
                <p className="text-gray-600">
                    Got questions? Just ask IslamGpt for Islamic authentic insights.
                </p>
            </div>
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask me anything..."
                        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--primary-color)] hover:text-[var(--secondary-color)] rounded-full transition-colors duration-300"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <p className="text-xs text-gray-500 text-center mt-4">
                    Disclaimer: IslamGpt offers AI-driven summarized insights based on authentic Islamic sources and bears no responsibility
                    for the insights. For authoritative rulings, please consult qualified Islamic scholars.
                </p>
            </div>
        </div>
    )
}

export default ChatInterface
