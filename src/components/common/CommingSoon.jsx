import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const ComingSoon = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh]">
            {/* Fading in animation */}
            <motion.div
                className="text-4xl md:text-6xl font-bold text-purple-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <span>
                    <Typewriter
                        words={["Coming Soon..."]}
                        loop={1}
                        cursor
                        typeSpeed={80}
                        deleteSpeed={50}
                        delaySpeed={2000}
                    />
                </span>
            </motion.div>

            {/* Underline animation (Signature Effect) */}
            <motion.div
                className="mt-4 h-[4px] w-32 bg-orange-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
            />
        </div>
    );
};

export default ComingSoon;
