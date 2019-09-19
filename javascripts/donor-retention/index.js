(function() {
  var modalOpen;

  modalOpen = function(elem, fbCb) {
    if (elem.is(":checked")) {
      $("body").addClass("modal-open");
      return fbCb();
    } else {
      return $("body").removeClass("modal-open");
    }
  };

  $("#complete-package-modal").on("change", function() {
    var track;
    track = function() {
      fbq('trackCustom', 'Complete Package');
      fbq('track', 'Lead');
      return mixpanel.track("Complete Package");
    };
    return modalOpen($(this), track);
  });

  $("#lets-talk-modal").on("change", function() {
    var track;
    track = function() {
      fbq('trackCustom', 'Lets Talk');
      return mixpanel.track("Lets talk");
    };
    return modalOpen($(this), track);
  });

  $("#free-report-modal").on("change", function() {
    var track;
    track = function() {
      fbq('trackCustom', 'Assessment Report', {
        duringNTC: true
      });
      return mixpanel.track("Assessment Report");
    };
    return modalOpen($(this), track);
  });

  $(".modal-fade-screen, .modal-close").on("click", function() {
    return $(".modal-state:checked").prop("checked", false).change();
  });

  $(".modal-inner").on("click", function(e) {
    return e.stopPropagation();
  });

}).call(this);
