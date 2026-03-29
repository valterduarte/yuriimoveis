import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

export function useFetchImovel(id) {
  const [imovel, setImovel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    axios
      .get(`${API_URL}/api/imoveis/${id}`, { signal: controller.signal })
      .then(res => setImovel(res.data))
      .catch(err => {
        if (!axios.isCancel(err))
          setFetchError(err.response?.status === 404 ? '404' : '500')
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [id])

  return { imovel, loading, fetchError }
}
