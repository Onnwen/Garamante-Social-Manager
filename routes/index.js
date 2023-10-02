var express = require('express');
const {TwitterApi} = require("twitter-api-v2");
var router = express.Router();

const client = new TwitterApi({
    appKey: '8sH260P4Gcz7C3YzdTvlAE8D8',
    appSecret: 'GNJhj6MvzwvpTdhUE7vbBH4hLR6DeClf1PLF6bq87MEHvtLmzm',
});

/* GET home page. */
router.get('/', async function (req, res, next) {
    const variables = {
        "scripts": "",
        "twitterAuth": "",
        "telegramAuth": "",
        "twitterToggle": "disabled",
        "telegramToggle": "disabled",
    };

    if (req.session.twitterClient) {
        variables.twitterAuth = `
            <button type='button' class='btn btn-danger w-100 mt-2' onclick='exitFromTwitter()'>Disconnetti Twitter</button>
            <script>
                function exitFromTwitter() {
                    window.location.href = '/gsm/auth/twitter/exit';
                }
            </script>`;

        variables.twitterToggle = `checked`;

        if (req.query.twitterAuthenticated) {
            variables.scripts += `showToast('Autenticazione a Twitter avvenuta con successo.', 'success');`;
        }
    } else {
        if (req.query.twitterAuthenticationError) {
            variables.scripts += `showToast('Autenticazione a Twitter fallita.', 'danger');`;
        }

        const authLink = await client.generateAuthLink('https://garamante.it/gsm/auth/twitter/callback/');

        if (!authLink) {
            return res.status(400).send('Invalid request!');
        }

        req.session.oauth_token = authLink.oauth_token;
        req.session.oauth_token_secret = authLink.oauth_token_secret;

        variables.twitterAuth = `<button type='button' class='btn btn-primary w-100 mt-2' onclick='window.location.href="${authLink.url}"'>Autentica Twitter</button>`
    }

    if (!req.session.telegramToken || !req.session.telegramChatID) {
        if (req.query.telegramAuthenticatedError) {
            variables.scripts += `showToast('Autenticazione a Telegram fallita.', 'danger');`;
        }

        variables.telegramAuth = `
                <form class="mt-2">
                    <div class="mb-3">
                        <label for="telegramToken" class="form-label">Token</label>
                        <input type="text" class="form-control" id="telegramToken">
                    </div>
                    <div class="mb-3">
                        <label for="telegramChatID" class="form-label">Chat ID</label>
                        <input type="text" class="form-control" id="telegramChatID">
                    </div>
                </form>
                <button type='button' class='btn btn-primary w-100' onclick='saveTelegramCredentials()'>Verifica</button>
                <script>
                    function saveTelegramCredentials() {
                        const token = document.getElementById('telegramToken').value;
                        const chatID = document.getElementById('telegramChatID').value;
                        window.location.href = '/gsm/auth/telegram/check?token=' + token + '&chatID=' + chatID;
                    }
                </script>`;
    } else {
        variables.telegramToggle = `checked`;

        if (req.query.telegramAuthenticated) {
            variables.scripts += `showToast('Autenticazione a Telegram avvenuta con successo.', 'success');`;
        }

        variables.telegramAuth = `
            <button type='button' class='btn btn-danger w-100 mt-2' onclick='exitFromTelegram()'>Disconnetti Telegram</button>
            <script>
                function exitFromTelegram() {
                    window.location.href = '/gsm/auth/telegram/exit';
                }
            </script>`;
    }

    res.render('index', variables);
});

module.exports = router;
