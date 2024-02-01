$(document).ready(function() {
// --- our code goes here ---

  //Target textarea by ID, run function as input happens
  $("#tweet-textarea").on("input", function () {
    const maxChar = 140;
    const inputChar = $(this).val().length;
    const charCounter = maxChar - inputChar;
    
    const $counterElement = $(this).parent().find("#counter");
    $counterElement.text(charCounter);

    if (charCounter < 0) {
      $counterElement.addClass("overLimit");
    } else {
      $counterElement.removeClass("overLimit");
    }
  })
});