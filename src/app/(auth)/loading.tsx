export default function AuthLoading() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="skeleton h-5 w-32 rounded-md mb-1" />
        <div className="skeleton h-3 w-44 rounded-md" />
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="skeleton h-3 w-10 rounded-md" />
          <div className="skeleton h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-14 rounded-md" />
          <div className="skeleton h-11 w-full rounded-xl" />
        </div>
        <div className="skeleton h-11 w-full rounded-xl" />
      </div>
    </div>
  )
}
