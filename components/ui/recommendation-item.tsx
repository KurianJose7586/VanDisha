"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader } from "lucide-react"

interface RecommendationItemProps {
  title: string
  description: string
  delay: number
  className?: string
}

function RecommendationItem({ title, description, delay, className }: RecommendationItemProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (isLoading) {
    return (
      <div className="p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-start gap-3 h-[68px]">
        <Loader className="h-5 w-5 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500">Analyzing...</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className={`p-3 rounded-lg border ${className}`}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs mt-1">{description}</p>
    </motion.div>
  )
}

// Use a default export at the end of the file
export default RecommendationItem