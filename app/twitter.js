const Twitter = require('twitter-lite')

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

module.exports = {
  sendTweet: async ({ messages }) => {
    let lastTweetID = ''
    let results
    for (const status of messages) {
      try {
        const tweet = await client.post('statuses/update', {
          status,
          in_reply_to_status_id: lastTweetID,
          auto_populate_reply_metadata: true
        })
        lastTweetID = tweet.id_str
        results.push()
      } catch (err) {
        console.error(err)
        result = false
        break
      }
    }
    if (result === false) {
      return result
    }
    return true
  }
}
