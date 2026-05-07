import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{ 
  value: any, 
  onChange: (val: any) => void,
  open: boolean,
  setOpen: (open: boolean) => void
}>({ 
  value: null, 
  onChange: () => {},
  open: false,
  setOpen: () => {}
})

export function Select({ defaultValue, value, onValueChange, children, ...props }: any) {
  const [internalVal, setInternalVal] = React.useState(defaultValue || value)
  const [open, setOpen] = React.useState(false)
  
  React.useEffect(() => {
    if (value !== undefined) setInternalVal(value)
  }, [value])

  const handleChange = (v: any) => {
    setInternalVal(v)
    onValueChange?.(v)
    setOpen(false)
  }

  // Ref to handle clicking outside to close
  const containerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <SelectContext.Provider value={{ value: internalVal, onChange: handleChange, open, setOpen }}>
      <div className="relative" ref={containerRef} {...props}>{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ className, children, ...props }: any) {
  const { open, setOpen } = React.useContext(SelectContext)
  return (
    <div 
      className={cn("flex h-9 w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)} 
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <i className="ri-arrow-down-s-line h-4 w-4 opacity-50"></i>
    </div>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext)
  // For the MVP, we just render value directly as string, assuming value strings are good labels
  return <span className="truncate">{value || placeholder}</span>
}

export function SelectContent({ className, children, ...props }: any) {
  const { open } = React.useContext(SelectContext)
  if (!open) return null
  return (
    <div className={cn("absolute top-full left-0 mt-1 z-50 min-w-[8rem] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80", className)} {...props}>
      <div className="max-h-[300px] overflow-y-auto p-1">{children}</div>
    </div>
  )
}

export function SelectItem({ className, value, children, ...props }: any) {
  const { value: selected, onChange } = React.useContext(SelectContext)
  const isSelected = selected === value
  return (
    <div
      className={cn("relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", isSelected && "bg-accent text-accent-foreground", className)}
      onClick={() => onChange(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <i className="ri-check-line h-4 w-4"></i>}
      </span>
      {children}
    </div>
  )
}

