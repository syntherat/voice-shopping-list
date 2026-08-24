import { RotateCw, Trash2, TriangleAlert } from 'lucide-react'
import { Component } from 'react'

const STORAGE_KEYS = ['vsl.list', 'vsl.language', 'vsl.speech']

export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('Unhandled error:', error)
  }

  // Saved state that cannot be rendered would crash again on every reload,
  // so recovery has to include throwing it away.
  handleReset = () => {
    for (const key of STORAGE_KEYS) {
      try {
        localStorage.removeItem(key)
      } catch {
        // Nothing to clean up if storage is unavailable.
      }
    }
    window.location.reload()
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-4 px-5 py-10">
        <TriangleAlert className="h-7 w-7 text-amber-400" aria-hidden="true" />
        <h1 className="text-lg font-semibold text-neutral-100">Something went wrong</h1>
        <p className="text-sm text-neutral-400">
          The app hit an unexpected error. Reloading usually fixes it. If it keeps happening,
          clear the saved list and start fresh.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            Reload
          </button>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-2 rounded-xl border border-border-subtle px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:bg-neutral-800"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear saved list
          </button>
        </div>
      </div>
    )
  }
}
