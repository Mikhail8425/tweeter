// //makes top nav arrow redirect to tweet box on click
$('.scroll').click(() => {
  $('html,body').animate({ scrollTop: 0 }, 1000);
  $('#tweet-text').focus();
});



//function to build html for tweets dynamically
const createTweetElement = function (tweetObj) {
  console.log('createTweetElement starts')
  const $tweet = $("<article class='tweet'>");
  //tweet header
  const $header = $("<header class='th-header'>");
  //header children
  const $headerD1 = $("<div class='name-left'>");
  const $avatar = $('<img>').attr('src', tweetObj.user.avatars);
  const $name = $('<h3>').text(tweetObj.user.name);
  $headerD1.append($avatar, $name);
  const $headerD2 = $("<div id='userID'>");
  const $handle = $('<p>').text(tweetObj.user.handle);
  $headerD2.append($handle);
  //append the contents of header
  $header.append($headerD1, $headerD2);
  //tweet content
  const $contentContainer = $("<div class='display-tweet'>");
  const $contentText = $('<p>').text(tweetObj.content.text);
  //append tweet text to container
  $contentContainer.append($contentText);
  //tweet footer
  const $footer = $('<footer>');
  //tweet footer children
  // const timeDelta = new Date(tweetObj.created_at); - works, shows date tweet was created
  const timeAgo = timeago.format(tweetObj.created_at);

  const $timeStamp = $('<p>').text(timeAgo);
  const $footerD2 = $("<div class='icons'>");
  const $flag = $("<i class='far fa-flag' id='flag'>");
  const $retweet = $("<i class='fas fa-retweet' id='retweet'>");
  const $heart = $("<i class='far fa-heart' id='heart'>");
  $footerD2.append($flag, $retweet, $heart);
  //append footer children to footer
  $footer.append($timeStamp, $footerD2);
  //add all of the children to the tweet div
  $tweet.append($header, $contentContainer, $footer);
  return $tweet;
};

//loops through all tweets
const renderTweets = function (tweets) {
  console.log('renderTweets starts')
  const $container = $('#tweets-container');
  tweets.forEach((tweet) => {
    const tweetList = createTweetElement(tweet);
    $container.prepend(tweetList);
  });
};

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

$(document).ready(function () {
  console.log('documet is ready')
  loadTweets();

  const $submitTweet = $('#submit-tweet');
  $submitTweet.on('submit', function (event) {
    event.preventDefault();
    const serializedData = $(this).serialize();
  });
});