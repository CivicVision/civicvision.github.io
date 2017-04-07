modalOpen = (elem,fbCb) ->
  if (elem.is(":checked"))
    $("body").addClass("modal-open")
    fbCb()
  else
    $("body").removeClass("modal-open")

$("#complete-package-modal").on("change", () ->
  track = () ->
    fbq('trackCustom', 'Complete Package')
    fbq('track', 'Lead')
    mixpanel.track("Complete Package")
  modalOpen($(this),track)
)
$("#lets-talk-modal").on("change", () ->
  track = () ->
    fbq('trackCustom', 'Lets Talk')
    mixpanel.track("Lets talk")
  modalOpen($(this),track)
)
$("#free-report-modal").on("change", () ->
  track = () ->
    fbq('trackCustom', 'Assessment Report', { duringNTC: true})
    mixpanel.track("Assessment Report")
  modalOpen($(this),track)
)

$(".modal-fade-screen, .modal-close").on("click", () ->
  $(".modal-state:checked").prop("checked", false).change()
)

$(".modal-inner").on("click", (e) ->
  e.stopPropagation()
)
