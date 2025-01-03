/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import { Book, Copy, MessageCircle, HandIcon as PrayingHands } from 'lucide-react'
import { duaData } from '../../../data/duaData'

const Card = ({ title, icon: Icon, children, className = "" }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-[var(--text-bg)] bg-opacity-10 p-2 rounded-lg">
                    <Icon className="w-5 h-5 text-[var(--primary-color)] " />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>
            {children}
        </div>
    )
}

const TextSection = ({ text, translation, className = "" }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text:', err)
        }
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <p className="text-right font-arabic text-xl leading-loose">{text}</p>
            <p className="text-gray-600 text-sm">{translation}</p>
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--primary-color)] transition-colors"
            >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    )
}

const DailyCards = ({ quranData, hadithData }) => {
    const [randomDua, setRandomDua] = useState(duaData[0])

    useEffect(() => {
        // Get a random dua on component mount
        const randomIndex = Math.floor(Math.random() * duaData.length)
        setRandomDua(duaData[randomIndex])
    }, [])

    return (
        <div className="space-y-6 mt-8">
            {/* Quran Verse Card */}
            <Card title="Verse of the Day" icon={Book}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Surah {quranData?.surah_num}:{quranData?.ayah_num}</span>
                    </div>
                    <TextSection
                        text={quranData?.Surah}
                        translation={quranData?.english_translation}
                    />
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm">
                            {quranData?.arabic_translation}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Hadith Card */}
            <Card title="Hadith of the Day" icon={MessageCircle}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{hadithData?.reference}</span>
                        <span>{hadithData?.hadith_number}</span>
                    </div>
                    <TextSection
                        text={hadithData?.hadith_arabic}
                        translation={hadithData?.hadith_english}
                    />
                    <div className="mt-2 text-sm text-gray-500">
                        <p>{hadithData?.english_chapter}</p>
                        <p className="text-right mt-1">{hadithData?.arabic_chapter}</p>
                    </div>
                </div>
            </Card>

            {/* Dua Card */}
            <Card title="Dua of the Day" icon={PrayingHands}>
                <div className="space-y-4">
                    <div className="text-sm text-gray-500">
                        <span>{randomDua?.title}</span>
                    </div>
                    <TextSection
                        text={randomDua?.arabic}
                        translation={randomDua?.english}
                    />
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm">
                            {randomDua?.urdu}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default DailyCards