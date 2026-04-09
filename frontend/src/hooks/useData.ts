import { useState, useEffect } from 'react'

interface UseDataReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export const useData = <T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
): UseDataReturn<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetcher()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error }
}
