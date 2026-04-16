type StatCardProps = {
  label: string
  value: number | string
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <h3 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </h3>
    </div>
  )
}