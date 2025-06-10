"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"

interface Category {
  id: string
  label: string
  active?: boolean
}

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string
  setActiveCategory: (category: string) => void
}

export default function CategoryTabs({ categories, activeCategory, setActiveCategory }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollability()
    const handleResize = () => checkScrollability()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="bg-white border-b shadow-sm relative">
      <div className="flex items-center">
        {/* Left scroll button - only show on larger screens when needed */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex absolute left-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm h-8 w-8 p-0"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Scrollable tabs container */}
        <div
          ref={scrollRef}
          className="flex gap-1 sm:gap-2 p-2 sm:p-3 overflow-x-auto scrollbar-hide flex-1"
          onScroll={checkScrollability}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={`
                flex-shrink-0 whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8
                ${
                  activeCategory === category.id
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }
              `}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Right scroll button - only show on larger screens when needed */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex absolute right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm h-8 w-8 p-0"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
