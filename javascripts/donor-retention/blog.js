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

  $(".modal-fade-screen, .modal-close").on("click", function() {
    return $(".modal-state:checked").prop("checked", false).change();
  });

  $(".modal-inner").on("click", function(e) {
    return e.stopPropagation();
  });

  $("#tyec-modal").on("change", function() {
    var track;
    track = function() {
      var cuName;
      cuName = $("#tyec-modal").attr('name');
      fbq('trackCustom', 'Content Upgrade Open - ' + cuName);
      return mixpanel.track('Content Upgrade Open - ' + cuName);
    };
    return modalOpen($(this), track);
  });

}).call(this);
