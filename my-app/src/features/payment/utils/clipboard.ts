export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) {
    return false
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fallback below for browsers blocking Clipboard API.
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.append(textarea)
    textarea.select()

    const copied = document.execCommand('copy')
    textarea.remove()

    return copied
  } catch {
    return false
  }
}
