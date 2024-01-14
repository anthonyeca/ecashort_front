const BASE_URL = import.meta.env.ASTRO_BACKEND

const apiService = {
  shortenUrl: async (origUrl) => {
    try {
      const response = await fetch(`${BASE_URL}/short`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error while shortening URL')
      }
    } catch (error) {
      console.error('Error while shortening URL:', error.message)
    }
  },
}

export default apiService
