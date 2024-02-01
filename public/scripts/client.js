/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// const $tweet = $(`<article class="tweet">Hello world</article>`);
const createTweetElement = function (tweetObj) {
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
  const timeDelta = moment(tweetObj.created_at).fromNow();
  const $timeStamp = $('<p>').text(timeDelta);
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