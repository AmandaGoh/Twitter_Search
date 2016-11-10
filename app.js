var express = require('express')
var app = express()
var server = require('http').createServer(app)
var port = 4000
var Twit = require('twit')


app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res){
  res.render('index', {header: 'Twitter Search'})
})

var io = require('socket.io')(server)

var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

var stream

io.on('connect', function (socket){
  // console.log('connected with front end')
  socket.on('updateTerm', function(search_term){
    console.log('the search term emitted is ' + search_term)

    if(stream){
      stream.stop()
    }

    stream = twitter.stream('statuses/filter', {
      track: search_term,
      language: 'en'
    })

    stream.on('tweet', function(data){
      // console.log(data)
      socket.emit('tweets', data)
    })
  })
})

server.listen(port)
