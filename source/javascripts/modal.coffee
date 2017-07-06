window.modalOpen = (elem,fbCb) ->
  if (elem.is(":checked"))
    $("body").addClass("modal-open")
    fbCb()
  else
    $("body").removeClass("modal-open")

