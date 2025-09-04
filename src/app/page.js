'use client';
import Link from 'next/link';
export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">Welcome to HR Tool</h1>
      <p className="text-gray-600 mt-2">Please signup or login to continue.</p>
       <div className="mt-6 flex gap-4">
       <Link href='/signup' className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Sign Up</Link>
      <Link href='/login' className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Login</Link>

       </div>
    </div>
  );
}
