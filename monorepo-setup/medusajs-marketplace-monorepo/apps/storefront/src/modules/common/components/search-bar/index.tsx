"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { Input } from "@medusajs/ui"
import { useDebounce } from "@lib/hooks/use-debounce"

type SearchBarProps = {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

const SearchBar = ({ 
  placeholder = "Search products...", 
  className = "",
  onSearch 
}: SearchBarProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { countryCode } = useParams() as { countryCode: string }
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (debouncedQuery && onSearch) {
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/${countryCode}/search?q=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      setQuery("")
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Mobile search button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 hover:bg-ui-bg-subtle rounded-lg transition-colors"
        aria-label="Search"
      >
        <MagnifyingGlass />
      </button>

      {/* Desktop search bar */}
      <form onSubmit={handleSubmit} className="hidden md:block">
        <div className="relative">
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-10 pr-10 w-full min-w-[300px]"
          />
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-ui-fg-muted" />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ui-fg-muted hover:text-ui-fg-base"
            >
              <XMark />
            </button>
          )}
        </div>
      </form>

      {/* Mobile search overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-ui-bg-base">
          <div className="flex items-center gap-4 p-4 border-b">
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative">
                <Input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="pl-10 pr-10 w-full"
                  autoFocus
                />
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-ui-fg-muted" />
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ui-fg-muted hover:text-ui-fg-base"
                  >
                    <XMark />
                  </button>
                )}
              </div>
            </form>
            <button
              onClick={() => {
                setIsOpen(false)
                setQuery("")
              }}
              className="text-ui-fg-subtle hover:text-ui-fg-base"
            >
              Cancel
            </button>
          </div>
          
          {/* Quick suggestions */}
          <div className="p-4">
            <p className="text-small-regular text-ui-fg-muted mb-4">
              Popular searches
            </p>
            <div className="flex flex-wrap gap-2">
              {["T-shirts", "Hoodies", "Accessories", "New arrivals"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term)
                    router.push(`/${countryCode}/search?q=${encodeURIComponent(term)}`)
                    setIsOpen(false)
                  }}
                  className="px-3 py-1 bg-ui-bg-subtle rounded-lg text-small-regular hover:bg-ui-bg-subtle-hover"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar