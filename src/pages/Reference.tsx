import { Navigate, useParams } from 'react-router'
import { Explorer } from '../components/Explorer'
import { CONCEPT_BY_KIND, CONCEPTS } from '../data/concepts'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { ActionKind } from '../types'

export function Reference() {
  const { kind } = useParams()
  const concept = kind ? CONCEPT_BY_KIND[kind as ActionKind] : undefined
  useDocumentTitle(concept ? `${concept.title} · Reference` : 'Reference')

  if (!concept) return <Navigate to={`/reference/${CONCEPTS[0].kind}`} replace />

  return (
    <main className="app">
      <header className="page-head">
        <h1>Reference</h1>
      </header>
      <Explorer selected={concept.kind} />
    </main>
  )
}
