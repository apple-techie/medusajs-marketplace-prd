'use client'

import Link from 'next/link'

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100">
            <svg className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Account Pending Approval
          </h2>
          
          <p className="mt-4 text-lg text-gray-600">
            Thank you for registering as a vendor on our marketplace!
          </p>
          
          <p className="mt-2 text-base text-gray-500">
            Your account is currently under review. Our team will verify your information and activate your account within 24-48 hours.
          </p>
          
          <p className="mt-4 text-sm text-gray-500">
            You will receive an email notification once your account has been approved.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Return to Login
          </Link>
          
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:vendors@marketplace.com" className="font-medium text-blue-600 hover:text-blue-500">
              vendors@marketplace.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}