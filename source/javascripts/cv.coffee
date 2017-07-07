$("#free-consultation").on("change", () ->
  track = () ->
    pageDescription = 'Free Consultation'
    window.trackEvent(pageDescription, {})
  window.modalOpen($(this),track)
)
$(".modal-fade-screen, .modal-close").on("click", () ->
  $(".modal-state:checked").prop("checked", false).change()
  window.trackEvent('Close Free Consultation', {})
)

$(".modal-inner").on("click", (e) ->
  e.stopPropagation()
)
window.trackEvent("Viewed Homepage", {})
