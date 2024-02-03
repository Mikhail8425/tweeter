// function definitions //

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
  console.log('renderTweets starts')
  const $container = $('#tweets-container');
  tweets.forEach((tweet) => {
    const tweetList = createTweetElement(tweet);
    $container.prepend(tweetList);
  });
};

//load tweets from server
const loadTweetsFromServer = function(callback) {
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
};

const newTweetValidation = function (sanitizedText) {
  if (sanitizedText === null) {
    displayMessage(
      'Do you have something to say?',
      "error"
    );
    return;
  }
  if (sanitizedText.length > 140) {
    displayMessage(
      'You are not trying to write a book...',
      "error"
    );
    return;
  }
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

$("document").ready(function() {
  loadTweetsFromServer(renderTweets);

  //down arrow button handler to show/hide new tweet on click
  $(".nav-bar-right > i").on("click", function() {
    toggleNewTweet();
  });
  
  // form submit handler to save new tweet to server and update display
  $('.new-tweet-form').on("submit", function(event) {
    event.preventDefault();
    hideError();
    let sanitizedText = $("#tweet-text").val();
    if (isNewTweetValid(sanitizedText)) {
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
    }
  });
});