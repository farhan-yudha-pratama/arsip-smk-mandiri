import * as React from "react"
import { createPortal } from "react-dom"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SearchableSelectProps {
    options: { label: string; value: string }[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    emptyMessage?: string
    className?: string
    inline?: boolean
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select option...",
    emptyMessage = "No option found.",
    className,
    inline = false,
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const containerRef = React.useRef<HTMLDivElement>(null)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 })

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedOption = options.find((option) => option.value === value)

    const updateCoords = () => {
        if (!inline && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            })
        }
    }

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current && 
                !containerRef.current.contains(event.target as Node) &&
                (!dropdownRef.current || !dropdownRef.current.contains(event.target as Node))
            ) {
                setOpen(false)
            }
        }

        if (open && !inline) {
            updateCoords()
            document.addEventListener("mousedown", handleClickOutside)
            window.addEventListener("resize", updateCoords)
            window.addEventListener("scroll", updateCoords, true)
        } else if (open && inline) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("resize", updateCoords)
            window.removeEventListener("scroll", updateCoords, true)
        }
    }, [open, inline])

    const dropdown = (
        <div 
                ref={dropdownRef}
                className={cn(
                    "mt-1 max-h-[400px] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground outline-none",
                    inline 
                        ? "relative w-full z-0 shadow-none border-t-0 rounded-t-none" 
                        : "fixed z-[9999] shadow-xl animate-in fade-in zoom-in-95 duration-100"
                )}
                style={!inline ? { 
                    top: coords.top, 
                    left: coords.left, 
                    width: coords.width 
                } : {}}
            >
                <div className="flex items-center border-b px-3 py-2 sticky top-0 bg-popover z-10">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        className="flex h-8 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="py-1">
                    {filteredOptions.length === 0 ? (
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-muted-foreground">
                            {emptyMessage}
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className={cn(
                                    "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                    value === option.value && "bg-accent text-accent-foreground"
                                )}
                                onClick={() => {
                                    onChange(option.value)
                                    setOpen(false)
                                    setSearchTerm("")
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </div>
                        ))
                    )}
                </div>
            </div>
        )
    
        return (
            <div className={cn("relative w-full", className)} ref={containerRef}>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-normal h-full min-h-[2rem]",
                        open && inline && "rounded-b-none border-b-0"
                    )}
                onClick={() => setOpen(!open)}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                inline 
                ? dropdown 
                : (typeof document !== 'undefined' && createPortal(dropdown, document.body))
            )}
        </div>
    )
}


