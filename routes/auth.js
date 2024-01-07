const express = require("express")
const { TwitterApi } = require("twitter-api-v2")
const axios = require("axios")
const { BskyAgent } = require("@atproto/api")
const constants = require("constants")
const router = express.Router()
/* GET auth listing. */
router.get("/twitter", function(req, res, next) {
    if (req.session.twitterClient) {
        const client = new TwitterApi({
            appKey: "8sH260P4Gcz7C3YzdTvlAE8D8",
            appSecret: "GNJhj6MvzwvpTdhUE7vbBH4hLR6DeClf1PLF6bq87MEHvtLmzm",
            accessToken: req.session.oauth_token,
            accessSecret: req.session.oauth_token_secret,
        })
        res.send({
            v1VerifyCredentials: client.currentUser(),
            v2Me: client.v2.me(),
        })
    } else {
        res.send({ twitterClient: null })
    }
})

router.get("/twitter/exit", function(req, res, next) {
    req.session.oauth_token = null
    req.session.oauth_token_secret = null
    req.session.loggedClient = null
    req.session.twitterClient = null
    res.redirect("/gsm/")
})

router.get("/twitter/callback", (req, res) => {
    if (!req.query.oauth_token || !req.query.oauth_verifier || !req.session.oauth_token_secret) {
        return res.status(400).send("OAuth tokens not found!")
    }

    const client = new TwitterApi({
        appKey: "8sH260P4Gcz7C3YzdTvlAE8D8",
        appSecret: "GNJhj6MvzwvpTdhUE7vbBH4hLR6DeClf1PLF6bq87MEHvtLmzm",
        accessToken: req.query.oauth_token,
        accessSecret: req.session.oauth_token_secret,
    })

    client.login(req.query.oauth_verifier)
        .then(({
                   client: loggedClient,
                   accessToken,
                   accessSecret,
               }) => {
            req.session.oauth_token = accessToken
            req.session.oauth_token_secret = accessSecret
            req.session.loggedClient = loggedClient
            req.session.twitterClient = client
            res.redirect("/gsm/?twitterAuthenticated=true")
        })
        .catch(() => res.redirect("/gsm/?twitterAuthenticated=false"))
})

router.get("/telegram/check", async function(req, res, next) {
    if (!req.query.token || !req.query.chatID) {
        return res.status(400).send("Missing parameters!")
    }

    try {
        axios.get("https://api.telegram.org/bot" + req.query.token + "/getMe")
            .then(response => {
                if (response.status === 200 && response.data.ok) {
                    req.session.telegramToken = req.query.token
                    req.session.telegramChatID = req.query.chatID
                    return res.redirect("/gsm/?telegramAuthenticated=true")
                } else {
                    return res.redirect("/gsm/?telegramAuthenticatedError=true")
                }
            })
            .catch(error => {
                return res.redirect("/gsm/?telegramAuthenticatedError=true")
            })
    } catch (error) {
        return res.redirect("/gsm/?telegramAuthenticatedError=true")
    }
})

router.get("/telegram/exit", function(req, res, next) {
    req.session.telegramToken = null
    req.session.telegramChatId = null
    res.redirect("/gsm/")
})

router.get("/facebook/check", async function(req, res, next) {
    if (!req.query.token || !req.query.pageID) {
        return res.status(400).send("Missing parameters!")
    }

    try {
        const response = await axios.get(`https://graph.facebook.com/${req.query.pageID}`, {
            params: {
                access_token: req.query.token,
                fields: "id,name",
            },
        })

        if (response.status === 200 && response.data.id) {
            req.session.facebookToken = req.query.token
            req.session.facebookPageID = req.query.pageID
            return res.redirect("/gsm/?facebookAuthenticated=true")
        } else {
            return res.redirect("/gsm/?facebookAuthenticatedError=true")
        }
    } catch (error) {
        return res.redirect("/gsm/?facebookAuthenticatedError=true")
    }
})

router.get("/facebook/exit", function(req, res, next) {
    req.session.facebookToken = null
    req.session.facebookPageID = null
    res.redirect("/gsm/")
})

router.get("/wordpress/check", async function(req, res, next) {
    if (!req.query.username || !req.query.password) {
        return res.status(400).send("Missing parameters!")
    }

    try {
        const response = await axios.get(`https://dangelodario.it/wp-json/wp/v2/posts?status=draft&gsm=true`, {
            auth: {
                username: req.query.username,
                password: req.query.password,
            },
        })

        if ((response.status === 200 || response.status === 201) && response.data[0].id) {
            req.session.wordpressUsername = req.query.username
            req.session.wordpressPassword = req.query.password
            return res.redirect("/gsm/?wordpressAuthenticated=true")
        } else {
            return res.redirect("/gsm/?wordpressAuthenticatedError=true")
        }
    } catch (error) {
        console.log(error)

        return res.redirect("/gsm/?wordpressAuthenticatedError=true")
    }
})

router.get("/wordpress/exit", function(req, res, next) {
    req.session.wordpressUsername = null
    req.session.wordpressPassword = null
    res.redirect("/gsm/")
})

router.get("/bskyb/check", async function(req, res, next) {
    if (!req.query.identifier || !req.query.password) {
        return res.status(400).send("Missing parameters!")
    }

    try {
        const agent = new BskyAgent({ service: "https://bsky.social" })

        const response = await agent.login({
            identifier: req.query.identifier,
            password: req.query.password
        })

        if (response.success) {
            req.session.bskyIdentifier = req.query.identifier
            req.session.bskyPassword = req.query.password
            req.session.did = response.data.did
            return res.redirect("/gsm/?bskybAuthenticated=true")
        } else {
            console.log(response.data)
            return res.redirect("/gsm/?bskybAuthenticatedError=true")
        }
    } catch (error) {
        console.log(error)

        return res.redirect("/gsm/?bskybAuthenticatedError=true")
    }
})

router.get("/bskyb/exit", function(req, res, next) {
    req.session.bskyIdentifier = null
    req.session.bskyPassword = null
    req.session.bskyAccessJwt = null
    req.session.bskybRefreshJwt = null
    req.session.did = null
    res.redirect("/gsm/")
});

module.exports = router
