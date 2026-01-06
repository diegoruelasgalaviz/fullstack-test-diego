import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-slate-800">
      <div className="max-w-5xl mx-auto p-8 text-center">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Fullstack Evaluation</h1>
          <p className="text-slate-500">React + TypeScript + Vite</p>
        </header>
        <main>
          <div className="p-8">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium cursor-pointer transition-colors hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              Count is {count}
            </button>
            <p className="mt-4 text-slate-400">
              Edit <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">src/App.tsx</code> and save to test HMR
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
