(function() {
  window.modalOpen = function(elem, fbCb) {
    if (elem.is(":checked")) {
      $("body").addClass("modal-open");
      return fbCb();
    } else {
      return $("body").removeClass("modal-open");
    }
  };

}).call(this);
