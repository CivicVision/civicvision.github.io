(function() {
  $("#free-consultation").on("change", function() {
    var track;
    track = function() {
      var pageDescription;
      pageDescription = 'Free Consultation';
      return window.trackEvent(pageDescription, {});
    };
    return window.modalOpen($(this), track);
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    $(".modal-state:checked").prop("checked", false).change();
    return window.trackEvent('Close Free Consultation', {});
  });

  $(".modal-inner").on("click", function(e) {
    return e.stopPropagation();
  });

  window.trackEvent("Viewed Homepage", {});

}).call(this);
