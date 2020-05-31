export const getCookieValue = (keyword: string): string => {
  let val = ''
  document.cookie.split(';').forEach(c => {
    const [key, value] = c.split('=')
    if (key === keyword) {
      return (val = value)
    }
  })
  return val
}
