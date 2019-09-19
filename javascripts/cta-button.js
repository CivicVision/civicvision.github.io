$(function() {
  $("#free-call-modal").on("change", function() {
    if ($(this).is(":checked")) {
      $("body").addClass("modal-open");
      window.drip.sendEvent('Start Data Source Research Call Scheduling');
    } else {
      $("body").removeClass("modal-open");
    }
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    $(".modal-state:checked").prop("checked", false).change();
  });

  $(".modal-inner").on("click", function(e) {
    e.stopPropagation();
  });
});
