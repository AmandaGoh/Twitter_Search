$(document).ready(function () {
  // console.log('ready!')
  var socket = io()

  socket.on('connect', function() {
    console.log('connected')
  })

  $('form').submit(function(e){
    e.preventDefault()
    var search_term = $('input').val()
    socket.emit('updateTerm', search_term)
  })

  socket.on('tweets', function (data){
    var tweet_list = '<li>' + data.text + '</li>'
    $('.tweet-container').prepend(tweet_list)
  })

})
