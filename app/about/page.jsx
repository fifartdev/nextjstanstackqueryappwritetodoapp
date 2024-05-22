import React from 'react'
import Link from 'next/link'


function AboutPage() {
  return (
    <div className="flex flex-col h-screen">
    {/* Header */}
    <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Todo App</h1>
            <nav>
                <Link href="/" className="text-white hover:text-blue-200 px-3 active:text-blue-200">Home</Link>
                <Link href="/about" className="text-white hover:text-blue-200 px-3 active:text-blue-200">About</Link>
            </nav>
        </div>
    </header>

    {/* Main Content Area */}
    <main className="flex-grow container mx-auto p-6">
        <div className="flex flex-col justify-center items-center">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold mb-4 text-gray-800">About the App</h1>
  <p className="text-gray-600 leading-relaxed">
    It is a demo app which implements CRUD functionalities using the AppWrite PAAS and the TanStack Query Library for state management, fetching, and caching data.
  </p>
</div>

        </div>
    </main>

    {/* Footer */}
    <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
            <p>&copy; 2024 Todo App. All rights reserved.</p>
        </div>
    </footer>
</div>
  )
}

export default AboutPage