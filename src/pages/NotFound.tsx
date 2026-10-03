import { Link } from 'react-router'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFound() {
  useDocumentTitle('Page not found')

  return (
    <main className="app not-found">
      <h1>Page not found.</h1>
      <Link className="cta" to="/">
        Go home
      </Link>
    </main>
  )
}
