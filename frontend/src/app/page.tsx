import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900">
          Smart Farming Database Management System
        </h1>
        <p className="mt-4 text-base text-gray-600">
          Full-stack term project using Next.js and Django.
        </p>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}