$(document).ready(function() {
// --- our code goes here ---

  //Target textarea by ID, run function as input happens
  $("#tweet-textarea").on("input", function () {
  const inputChar = $(this).val().length;
  console.log(inputChar)

  const $counterElement = $(this).parent().find("#counter");
  $counterElement.text(inputChar);
  console.log($counterElement)

  if (inputChar > 140) {
    $counterElement.addClass("overLimit");
  } else {
    $counterElement.removeClass("overLimit");
  }
  // console.log('charCounter', charCounter)
  })


});