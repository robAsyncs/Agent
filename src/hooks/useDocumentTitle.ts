import { useEffect } from 'react'

const SITE = 'Agent Anatomy'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : SITE
  }, [title])
}
