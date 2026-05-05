interface ButtonProps {
  label: string
}

export function Button({ label }: ButtonProps) {
  return (
    <div className="inline-flex items-center gap-1 px-4 py-2 font-display text-sm tracking-widest lowercase border border-primary text-primary bg-transparent hover:bg-primary hover:text-background shadow-[0_0_0px_transparent] hover:shadow-[0_0_12px_var(--color-primary)] transition-all duration-200 cursor-pointer select-none">
      <span className="opacity-50">&gt;</span>
      {label}
    </div>
  )
}
