import React from 'react'
import ChatInterface from '../components/common/ChatInterface'
import DailyCards from '../components/core/dashboard/DailyCards'
import { useDailyContent } from '../apis/dashboard/dashbaordApi'

const Dashboard = () => {
    const { data: dailyContent, isLoading, isError } = useDailyContent()

    return (
        <div className="min-h-fit ">
            <div className="container mx-auto pb-12">
                <ChatInterface />

                {isLoading ? (
                    <div className="mt-8 space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-64 bg-gray-200 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="mt-8 text-center text-red-500">
                        Failed to load daily content. Please refresh the page.
                    </div>
                ) : (
                    <DailyCards
                        quranData={dailyContent?.data?.quran}
                        hadithData={dailyContent?.data?.hadith}
                    />
                )}
            </div>
        </div>
    )
}

export default Dashboard