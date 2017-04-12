window.trackEvent = (name, addInfo) ->
  if window.hasOwnProperty('mixpanel')
    mixpanel.track(name, addInfo)
  if window.hasOwnProperty('fbq')
    fbq('trackCustom', name, addInfo)
