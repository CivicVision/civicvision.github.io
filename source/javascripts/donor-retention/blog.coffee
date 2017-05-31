modalOpen = (elem,fbCb) ->
  if (elem.is(":checked"))
    $("body").addClass("modal-open")
    fbCb()
  else
    $("body").removeClass("modal-open")

$(".modal-fade-screen, .modal-close").on "click", () ->
  $(".modal-state:checked").prop("checked", false).change()

$(".modal-inner").on "click", (e) ->
  e.stopPropagation()

$("#tyec-modal").on("change", () ->
  track = () ->
    cuName = $("#tyec-modal").attr('name')
    fbq('trackCustom', 'Content Upgrade Open - '+cuName)
    mixpanel.track('Content Upgrade Open - '+cuName)
  modalOpen($(this),track)
)
