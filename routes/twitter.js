var express = require('express');
const { TwitterApi } = require('twitter-api-v2');
var router = express.Router();

const client = new TwitterApi({
  appKey: '8sH260P4Gcz7C3YzdTvlAE8D8',
  appSecret: 'GNJhj6MvzwvpTdhUE7vbBH4hLR6DeClf1PLF6bq87MEHvtLmzm'
});

/* GET twitter listing. */
router.get('/', function(req, res, next) {
  client.v2.singleTweet('1455477974489251841', {
    'tweet.fields': [
      'organic_metrics',
    ],
  }).then((val) => {
    res.send(val)
  }).catch((err) => {
    res.send(err)
  })
});

router.get('/callback', (req, res) => {
  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return res.status(400).send('OAuth tokens not found!');
  }

  const client = new TwitterApi({
    appKey: 'aQ48mKA99Wvcm9Nnu0VsPcxLe',
    appSecret: 'iYXd8n1tRFJzdBOxkrqQcQVf2RN7YPwV4WwlaNIK3TwXQR3OcL',
    accessToken: req.query.oauth_token,
    accessSecret: req.session.oauth_token_secret,
  });

  client.login(oauth_verifier)
      .then(({ client: loggedClient, accessToken, accessSecret }) => {
        req.session.oauth_token = accessToken;
        req.session.oauth_token_secret = accessSecret;
        req.session.loggedClient = loggedClient;
        res.redirect('/?twitterAuthenticated=true');
      })
      .catch(() => res.redirect('/?twitterAuthenticated=false'));
});

router.get('/verifyPin', async function (req, res, next) {
  if (!req.session.oauth_token || !req.session.oauth_token_secret) {
    return res.status(400).send('OAuth tokens not found!');
  }

  const client = new TwitterApi({
    appKey: 'aQ48mKA99Wvcm9Nnu0VsPcxLe',
    appSecret: 'iYXd8n1tRFJzdBOxkrqQcQVf2RN7YPwV4WwlaNIK3TwXQR3OcL',
    accessToken: req.session.oauth_token,
    accessSecret: req.session.oauth_token_secret,
  });

  if (!req.query.pin) {
    return res.status(400).send('Pin not found!');
  }
  else {
    const {client: loggedClient, accessToken, accessSecret} = await client.login(req.query.pin);
    req.session.oauth_token = accessToken;
    req.session.oauth_token_secret = accessSecret;
    res.send(loggedClient.currentUser());
  }
});

module.exports = router;
