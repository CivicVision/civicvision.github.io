$("#free-consultation").on("change", () ->
  track = () ->
    pageDescription = 'Free Consultation'
    #fbq('trackCustom', pageDescription)
    #mixpanel.track(pageDescription)
  window.modalOpen($(this),track)
)
$(".modal-fade-screen, .modal-close").on("click", () ->
  $(".modal-state:checked").prop("checked", false).change()
)

$(".modal-inner").on("click", (e) ->
  e.stopPropagation()
)
