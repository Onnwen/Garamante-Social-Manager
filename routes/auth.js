const express = require('express');
const {TwitterApi} = require('twitter-api-v2');
const axios = require('axios');
const router = express.Router();
/* GET auth listing. */
router.get('/twitter', function (req, res, next) {
    if (req.session.twitterClient) {
        const client = new TwitterApi({
            appKey: '8sH260P4Gcz7C3YzdTvlAE8D8',
            appSecret: 'GNJhj6MvzwvpTdhUE7vbBH4hLR6DeClf1PLF6bq87MEHvtLmzm',
            accessToken: req.session.oauth_token,
            accessSecret: req.session.oauth_token_secret,
        });
        res.send({
            v1VerifyCredentials: client.currentUser(),
            v2Me: client.v2.me(),
        });
    } else {
        res.send({twitterClient: null});
    }
});

router.get('/twitter/exit', function (req, res, next) {
    req.session.oauth_token = null;
    req.session.oauth_token_secret = null;
    req.session.loggedClient = null;
    req.session.twitterClient = null;
    res.redirect('/gsm/');
});

router.get('/twitter/callback', (req, res) => {
    if (!req.query.oauth_token || !req.query.oauth_verifier || !req.session.oauth_token_secret) {
        return res.status(400).send('OAuth tokens not found!');
    }

    const client = new TwitterApi({
        appKey: '8sH260P4Gcz7C3YzdTvlAE8D8',
        appSecret: 'GNJhj6MvzwvpTdhUE7vbBH4hLR6DeClf1PLF6bq87MEHvtLmzm',
        accessToken: req.query.oauth_token,
        accessSecret: req.session.oauth_token_secret,
    });

    client.login(req.query.oauth_verifier)
        .then(({client: loggedClient, accessToken, accessSecret}) => {
            req.session.oauth_token = accessToken;
            req.session.oauth_token_secret = accessSecret;
            req.session.loggedClient = loggedClient;
            req.session.twitterClient = client;
            res.redirect('/gsm/?twitterAuthenticated=true');
        })
        .catch(() => res.redirect('/gsm/?twitterAuthenticated=false'));
});

router.get('/telegram/check', async function (req, res, next) {
    if (!req.query.token || !req.query.chatID) {
        return res.status(400).send('Missing parameters!');
    }

    try {
        axios.get('https://api.telegram.org/bot' + req.query.token + '/getMe')
            .then(response => {
                if (response.status === 200 && response.data.ok) {
                    req.session.telegramToken = req.query.token;
                    req.session.telegramChatID = req.query.chatID;
                    return res.redirect('/gsm/?telegramAuthenticated=true');
                }
                else {
                    return res.redirect('/gsm/?telegramAuthenticatedError=true');
                }
            })
            .catch(error => {
                return res.redirect('/gsm/?telegramAuthenticatedError=true');
            });
    } catch (error) {
        return res.redirect('/gsm/?telegramAuthenticatedError=true');
    }
});

router.get('/telegram/exit', function (req, res, next) {
    req.session.telegramToken = null;
    req.session.telegramChatId = null;
    res.redirect('/gsm/');
});

router.get('/facebook/check', async function (req, res, next) {
    if (!req.query.token || !req.query.pageID) {
        return res.status(400).send('Missing parameters!');
    }

    try {
        const response = await axios.get(`https://graph.facebook.com/${req.query.pageID}`, {
            params: {
                access_token: req.query.token,
                fields: 'id,name'
            }
        });

        if (response.status === 200 && response.data.id) {
            req.session.facebookToken = req.query.token;
            req.session.facebookPageID = req.query.pageID;
            return res.redirect('/gsm/?facebookAuthenticated=true');
        }
        else {
            return res.redirect('/gsm/?facebookAuthenticatedError=true');
        }
    } catch (error) {
        return res.redirect('/gsm/?facebookAuthenticatedError=true');
    }
});

router.get('/facebook/exit', function (req, res, next) {
    req.session.facebookToken = null;
    req.session.facebookPageID = null;
    res.redirect('/gsm/');
});

module.exports = router;
