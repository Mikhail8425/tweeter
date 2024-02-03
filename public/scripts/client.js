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
const loadTweets = () => {
  console.log('loadTweets starts')
  $.ajax({
    url: '/tweets',
    method: 'GET',
    dataType: 'json',
    success: (tweets) => {
      renderTweets(tweets);
    },
    error: (error) => {
      console.error(error);
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

$(document).ready(function () {

  $("#create-tweet").submit(function (event) {
    //prevent the default behaviour (refresh)

    event.preventDefault();

    //serialize form data
    const tweetText = $("#tweet-text").val();
    const sanitizedText = $("<p>").text(tweetText).html();



    //AJAX post req in client.js that send form to server
    $.post("/tweets", { text: sanitizedText }, function (response) {
      console.log(response);
      const $tweetContainer = $("#tweet-container");
      $tweetContainer.empty();
      $("#tweet-text").val("");
      loadTweets();
    });
  });

  $('.scroll').click(() => {
    $('html,body').animate({ scrollTop: 0 }, 1000);
    $('#tweet-text').focus();
  });

  loadTweets();
  const $submitTweet = $('#submit-tweet');
  $submitTweet.on('submit', function (event) {
    event.preventDefault();
    const serializedData = $(this).serialize();
  });
});