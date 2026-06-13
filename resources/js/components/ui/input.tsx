import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const [fileName, setFileName] = React.useState<string | null>(null)

  if (type === "file") {
    return (
      <div 
        className={cn(
          "relative flex items-center h-10 w-full rounded-lg border border-input bg-background overflow-hidden shadow-sm transition-all duration-200",
          "hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-md",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
          props.disabled ? "opacity-50 cursor-not-allowed" : "",
          className
        )}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFileName(e.target.files[0].name)
            } else {
              setFileName(null)
            }
            props.onChange?.(e)
          }}
          {...props}
        />
        <div className="flex h-full items-center justify-center gap-2 bg-muted/80 px-4 border-r border-input text-sm font-medium text-foreground transition-colors group-hover:bg-muted">
          <Upload className="h-4 w-4" />
          Pilih File
        </div>
        <div className="flex-1 px-3 text-sm text-muted-foreground truncate">
          {fileName || props.placeholder || "Tidak ada file yang dipilih"}
        </div>
      </div>
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-base md:text-sm shadow-sm transition-all duration-200 outline-none",
        "placeholder:text-muted-foreground/70",
        "hover:border-primary/40",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-md",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "selection:bg-primary selection:text-primary-foreground",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:focus-visible:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
