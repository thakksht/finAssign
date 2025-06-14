import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transaction Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            A simple and efficient way to manage your personal finances. Track your expenses, monitor your budget, and visualize your spending patterns.
          </p>          <div className="flex gap-4 flex-wrap justify-center">
            <Link 
              href="/dashboard" 
              className="rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/transactions" 
              className="rounded-md bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              View Transactions
            </Link>
            <Link 
              href="/transactions/new" 
              className="rounded-md bg-gray-100 px-6 py-3 text-gray-800 font-medium hover:bg-gray-200 transition-colors"
            >
              Add Transaction
            </Link>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Transactions</h3>
            <p className="text-gray-600">Add, edit, and delete your financial transactions with ease.</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Visualize Data</h3>
            <p className="text-gray-600">See your monthly spending patterns with interactive charts.</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Simple & Fast</h3>
            <p className="text-gray-600">Intuitive interface designed for speed and ease of use.</p>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 md:p-12 rounded-2xl text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to take control of your finances?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">Start tracking your transactions today and gain insights into your spending habits.</p>          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/dashboard" 
              className="inline-block rounded-md bg-white px-6 py-3 text-blue-600 font-medium hover:bg-gray-100 transition-colors"
            >
              View Dashboard
            </Link>
            <Link 
              href="/transactions" 
              className="inline-block rounded-md bg-blue-800 px-6 py-3 text-white font-medium hover:bg-blue-900 transition-colors"
            >
              Manage Transactions
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
