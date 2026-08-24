// One heading treatment for every block, so the sections read as a set rather
// than as separately styled panels.
export default function SectionHeading({ icon: Icon, children, trailing }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
        <h2 className="truncate text-sm font-medium text-neutral-300">{children}</h2>
      </div>
      {trailing}
    </div>
  )
}
