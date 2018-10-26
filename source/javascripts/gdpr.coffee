setCookie = (name, value, days) ->
  expires = ''
  if days
    date = new Date
    date.setTime date.getTime() + days * 86400000
    expires = '; expires=' + date.toUTCString()
  document.cookie = name + '=' + (value or '') + expires + '; path=/'
  return

getCookie = (name) ->
  nameEQ = name + '='
  ca = document.cookie.split(';')
  i = 0
  while i < ca.length
    c = ca[i]
    while c.charAt(0) == ' '
      c = c.substring(1, c.length)
    if c.indexOf(nameEQ) == 0
      return c.substring(nameEQ.length, c.length)
    i++
  null

$("#gdpr-allow").on("click", (e) ->
  $("#gdpr-banner").hide()
  setCookie('gdpr','true',90)
)

if !getCookie('gdpr')
  $("#gdpr-banner").show()
