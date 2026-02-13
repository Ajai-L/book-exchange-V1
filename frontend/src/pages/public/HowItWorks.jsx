import React from 'react'

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">How OpenShelf Works</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">For Readers</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-3xl font-bold text-blue-600 min-w-fit">1</div>
              <div>
                <h3 className="font-semibold mb-1">Sign Up</h3>
                <p className="text-slate-600">Create your free account in seconds</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl font-bold text-blue-600 min-w-fit">2</div>
              <div>
                <h3 className="font-semibold mb-1">Browse Books</h3>
                <p className="text-slate-600">Explore books available in your community</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl font-bold text-blue-600 min-w-fit">3</div>
              <div>
                <h3 className="font-semibold mb-1">Request an Exchange</h3>
                <p className="text-slate-600">Send a request to exchange with other readers</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl font-bold text-blue-600 min-w-fit">4</div>
              <div>
                <h3 className="font-semibold mb-1">Track Your Exchanges</h3>
                <p className="text-slate-600">Manage all your requests and completed exchanges</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 p-6 rounded">
          <h2 className="text-2xl font-semibold mb-4">For Book Owners</h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex gap-2">
              <span className="text-blue-600">✓</span>
              <span>List your spare books in minutes</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">✓</span>
              <span>Manage your active listings</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">✓</span>
              <span>Review exchange requests</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">✓</span>
              <span>Mark exchanges as complete</span>
            </li>
          </ul>
        </section>

        <section className="border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">Why OpenShelf?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">📚 Free</h3>
              <p className="text-slate-600">Exchange books with neighbors at zero cost</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🤝 Community</h3>
              <p className="text-slate-600">Connect with book lovers in your area</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">♻️ Sustainable</h3>
              <p className="text-slate-600">Give books a second life instead of throwing them away</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
