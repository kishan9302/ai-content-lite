'use client';
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  const cardContent = (
    <div
      className={clsx(
        'glass-card transition-all duration-300',
        hover && 'hover:scale-[1.02] hover:shadow-2xl hover:shadow-neon-cyan/20',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={hover ? { y: -4 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    )
  }

  return cardContent
}

