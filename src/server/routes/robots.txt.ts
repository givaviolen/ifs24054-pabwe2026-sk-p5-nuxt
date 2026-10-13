export default defineEventHandler((event) => {
  setResponseHeader(event, 'content-type', 'text/plain')
  return 'User-agent: *\nAllow: /\n'
})
