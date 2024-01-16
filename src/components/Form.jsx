import { useState } from 'preact/hooks'

const BASE_URL = import.meta.env.PUBLIC_ASTRO_BACKEND

export const Form = () => {
  const [url, setUrl] = useState()
  const [error, setError] = useState()
  const [link, setLink] = useState(null)
  const [showLinkInfo, setShowLinkInfo] = useState(true)

  const instructions = {
    border: '1px solid rgba(224, 204, 250, 25%)',
    background:
      'linear-gradient(rgba(49, 10, 101, 66%), rgba(49, 10, 101, 33%))',
  }

  const showToast = () => {
    const toast = document.getElementById('toast')
    toast.style.display = 'block'

    setTimeout(() => {
      toast.style.display = 'none'
    }, 3000)
  }

  const isURLValid = (url) => {
    const urlRegex = /^https:\/\/[^\s/$.?#].[^\s]*$/
    return urlRegex.test(url)
  }

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  const handleClick = async (e) => {
    e.preventDefault()

    if (!isURLValid(url)) {
      setError('Enter a valid URL starting with "https://"')
      setShowLinkInfo(false)
      return
    }
    const requestData = {
      origUrl: url,
    }

    try {
      const response = await fetch(`${BASE_URL}/short`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()
      setError(null)
      setLink(data)
      console.log(data)
      await copyTextToClipboard(data.shortUrl)
      showToast()
      setShowLinkInfo(true)
    } catch (error) {
      console.error('Error al enviar la petición:', error.message)
      setError('Error al procesar la solicitud. Inténtalo de nuevo.')
      setShowLinkInfo(false)
    }
  }

  return (
    <div>
      <div class="relative pt-20">
        <form
          class="flex flex-col gap-2 justify-center items-center lg:flex-row animate-fade mb-2 mx-auto"
          action="/api/short"
          method="POST"
        >
          <label
            style={{ color: '#E0CCFA', fontWeight: 'bold' }}
            for="url"
          ></label>
          <input
            id="url"
            name="url"
            class="justify-start text-white rounded-md px-4 py-2"
            style={instructions}
            type="text"
            autocomplete="off"
            required
            placeholder="https://anthonyeca.dev"
            onChange={(event) => setUrl(event.target.value)}
          />
          <button
            type="submit"
            class="animate-fade p-2 hover:transition duration-200 ease-in-out hover:text-gray-600"
            onClick={handleClick}
          >
            Shorten
          </button>
        </form>
        {error && (
          <div class="animate-fade flex justify-start text-sm text-red-500 opacity-90 p-1 text-pretty lg:-mt-3 -mt-16 sm:ml-2 ">
            {error}
          </div>
        )}
      </div>

      <div>
        {showLinkInfo && link && (
          <article
            class="p-1.5 mx-auto sm:my-4 max-w-sm rounded-xl border-gray-300
          
          "
          >
            <div class="bg-[#1d1d1d]  z-10 p-5 rounded-lg">
              <h4 class="text-white  text-xl smtext-2xl font-bold">
                {link.shortUrl}
              </h4>
              <p class=" text-gray-400">Count of clicks {link.clicks}</p>
            </div>
          </article>
        )}
      </div>

      <div
        id="toast"
        class="animate-fade ease-out fixed bottom-0 right-0 mb-4 mr-4 bg-green-500 text-white p-2 rounded z-10"
        style={{ display: 'none' }}
      >
        URL copied to clipboard!
      </div>
    </div>
  )
}
