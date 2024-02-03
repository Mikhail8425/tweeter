//error hide/display
const displayError = function(errorMessage) {
  console.log('displayError', displayError)
  $(".new-tweet-error>span").text(errorMessage);
  $(".new-tweet-error").slideDown({
    start: function() {
      $(this).css({
        display: "flex"
      });
    }
  });
};

const hideError = function() {
  console.log('hideError starts')
  $(".new-tweet-error").slideUp();
};

//function to to toggle the new tweet box
const toggleWriteNewTweet = function() {
  if ($(".new-tweet-form").is(":visible")) {
    $(".new-tweet-form").slideUp();
    $(".nav-bar-right > i").removeClass("fa-angles-up");
    $(".nav-bar-right > i").addClass("fa-angles-down");
  } else {
    $(".new-tweet-form").slideDown({
      start: function() {
        $(this).css({
          display: "flex"
        });
      }
    });
    $(".nav-bar-right > i").removeClass("fa-angles-down");
    $(".nav-bar-right > i").addClass("fa-angles-up");
    $("#tweet-text").focus();
  }
};

// create new tweet
const createTweetElement = function(tweetData) {
  const { user, content, created_at } = tweetData;
  let $article = $("<article>");
  //header section first
  let $header = $("<header>");
  let $headerDiv = $("<div>");
  let $image = $("<img>").attr('src', user.avatars);
  let $name = $("<div>").text(user.name);
  let $handleAside = $("<aside>").text(user.handle);
  //header structure
  $article.append(
    $header.append(
      $headerDiv.append(
        $image
      ).append(
        $name
      )
    ).append(
      $handleAside
    )
  );
  // middle section with tweet text
  let $section = $("<span>").text(content.text);
  $article.append($section);
  // footer section
  let $footer = $("<footer>");
  let $footerTimeDiv = $("<div>").text(timeago.format(created_at));
  let $footerButtonDiv = $("<div>");
  let $footerFlag = $("<i>").addClass("fa-solid fa-flag");
  let $footerReTweet = $("<i>").addClass("fa-solid fa-retweet");
  let $footerHeart = $("<i>").addClass("fa-solid fa-heart");
  //footer structure
  $article.append(
    $footer.append(
      $footerTimeDiv
    ).append(
      $footerButtonDiv.append(
        $footerFlag
      ).append(
        $footerReTweet
      ).append(
        $footerHeart
      )
    )
  );
  return $article;
};

//loops through all tweets and render them
const renderTweets = function (tweets) {
  const $container = $('#tweets-container');
  tweets.forEach((tweet) => {
    const tweetList = createTweetElement(tweet);
    $container.prepend(tweetList);
  });
};

//load tweets from server
const loadTweetsFromServer = function(callback) {
  console.log('loadTweetsFromServer starts')
  $.ajax({
    url: "http://localhost:8080/tweets",
    context: document.body,
    method: "GET",
    success: function(data, textStatus, jqXHR) {
      callback(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      displayError('Problem loading tweets');
    }
  });
  console.log('loadTweetsFromServer ends')
};

const newTweetValidation = function (sanitizedText) {
  if (sanitizedText === null) {
    displayMessage(
      'Do you have something to say?',
      "error"
    );
    return false;
  }
  if (sanitizedText.length > 140) {
    displayMessage(
      'You are not trying to write a book...',
      "error"
    );
    return false;
  }
  return true;
}

const addNewTweetToDisplay = function(tweetData, sanitizedText) {
  const currentTweetCount = $("#tweets-container>article").length;
  const newTweetCount = tweetData.length;
  for (let index = newTweetCount - 1; index >= currentTweetCount; index--) {
    let tweetToAdd = tweetData[index];
    if (tweetToAdd.content.text === sanitizedText) {
      const newTweet = createTweetElement(tweetToAdd);
      $('#tweets-container').prepend(newTweet);
      break;
    }
  }
};

//function to reset the new tweet box
const resetNewTweetBox = function() {
  console.log('resetNewTweetBox starts')
  $("#tweet-text").val("");
  $("#tweet-text").parent().find(".counter").val(140);
  console.log('resetNewTweetBox ends')
};

$("document").ready(function() {
  console.log('document ready starts')
  loadTweetsFromServer(renderTweets);

  //down arrow button handler to show/hide new tweet on click
  $(".nav-bar-right > i").on("click", function() {
    toggleWriteNewTweet();
  });
  
  // form submit handler to save new tweet to server and update display
  $('.new-tweet-form').on("submit", function(event) {
    event.preventDefault();
    hideError();
    let sanitizedText = $("#tweet-text").val();
    if (newTweetValidation(sanitizedText)) {
      console.log('calling ajax')
      $.ajax({
        url: "http://localhost:8080/tweets",
        context: document.body,
        data: $("#tweet-text").serialize(),
        method: "POST",
        success: function(data, textStatus, jqXHR) {
          loadTweetsFromServer((tweets) => {
            addNewTweetToDisplay(tweets, sanitizedText);
          });
          resetNewTweetBox();
        },
        error: function(jqXHR, textStatus, errorThrown) {
          displayError('Problem saving tweet');
        }
      });
    } else {
      console.log('not calling ajax')
    }
  });
  console.log('document ready done')
});

