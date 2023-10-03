const express = require('express');
const {TwitterApi} = require('twitter-api-v2');
const router = express.Router();
const {request} = require("express");
const axios = require("axios");

/* GET publish listing. */
router.post('/twitter', async function (req, res, next) {
    if (!req.body.text) {
        return res.status(400).send('Missing parameters!');
    }

    const text = req.body.text;

    const client = new TwitterApi({
        appKey: '8sH260P4Gcz7C3YzdTvlAE8D8',
        appSecret: 'GNJhj6MvzwvpTdhUE7vbBH4hLR6DeClf1PLF6bq87MEHvtLmzm',
        accessToken: req.session.oauth_token,
        accessSecret: req.session.oauth_token_secret,
    });

    try {
        await client.v2.tweet({
            text: text
        });
        return res.status(200).send({message: 'Pubblicato su Twitter.', status: 'primary'});
    } catch (error) {
        return res.status(500).send({message: 'Errore durante la pubblicazione su Twitter. (' + error + ')', status: 'danger'});
    }
});

router.post('/telegram', async function (req, res, next) {
    if (!req.body.text) {
        return res.status(400).send('Missing parameters!');
    }

    const text = req.body.text;

    try {
        axios.get('https://api.telegram.org/bot' + req.session.telegramToken + '/sendMessage?chat_id=' + req.session.telegramChatID + '&text=' + encodeURIComponent(text))
            .then(response => {
                if (response.status === 200 && response.data.ok) {
                    res.status(200).send({message: 'Pubblicato su Telegram.', status: 'primary'});
                }
                else {
                    res.send({message: 'Errore durante la pubblicazione su Telegram. (' + error + ')', status: 'danger'});
                }
            })
            .catch(error => {
                res.send({message: 'Errore durante la pubblicazione su Telegram. (' + error + ')', status: 'danger'});
            });
    }
    catch (error) {
        return res.status(500).send({message: 'Errore durante la pubblicazione su Telegram. (' + error + ')', status: 'danger'});
    }
});

router.post('/facebook', async function (req, res, next) {
    if (!req.body.text) {
        return res.status(400).send('Missing parameters!');
    }

    const text = req.body.text;

    try {
        axios.post('https://graph.facebook.com/' + req.session.facebookPageID + '/feed?message=' + text + '&access_token=' + req.session.facebookToken)            .then(response => {
                if (response.status === 200) {
                    res.status(200).send({message: 'Pubblicato su Facebook.', status: 'primary'});
                }
                else {
                    res.send({message: 'Errore durante la pubblicazione su Facebook. (' + response.data + ')', status: 'danger'});
                }
            })
            .catch(error => {
                res.send({message: 'Errore durante la pubblicazione su Facebook. (' + error + ')', status: 'danger'});
            });
    }
    catch (error) {
        return res.status(500).send({message: 'Errore durante la pubblicazione su Facebook. (' + error + ')', status: 'danger'});
    }
});

module.exports = router;