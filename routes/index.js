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
        "facebookAuth": "",
        "wordpressAuth": "",
        "twitterToggle": "disabled",
        "telegramToggle": "disabled",
        "facebookToggle": "disabled",
        "wordpressToggle": "disabled",
        "blogToggle": "",
        "twitterSettings": "",
        "wordpressSettings": "",
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

        variables.twitterSettings += `
            <div id="twitterEnabled" class="mt-5">
                    <hr class="pb-2">
                    <label for="text" class="form-label">Impostazioni Twitter</label>
                    <div class="input-group pb-3">
                        <span class="input-group-text" id="twitterPostResponseIDSpan">In risposta a</span>
                        <input type="text" class="form-control" placeholder="ID tweet" aria-label="Identificativo" aria-describedby="twitterPostResponseIDSpan" id="twitterPostResponseID" value="${req.session.lastTweetId ? req.session.lastTweetId : ""}">
                    </div>
                    <hr class="pt-2">
                </div>
            `

        if (req.query.twitterAuthenticated) {
            variables.scripts += `showToast('Autenticazione a Twitter avvenuta con successo.', 'primary');`;
            variables.scripts += `window.history.replaceState({}, document.title, "/gsm/");`;
        }
    } else {
        if (req.query.twitterAuthenticationError) {
            variables.scripts += `showToast('Autenticazione a Twitter fallita.', 'danger');`;
            variables.scripts += `window.history.replaceState({}, document.title, "/gsm/");`;
        }

        const domain = "garamante.it"
        const protocol = "https";
        const authLink = await client.generateAuthLink(protocol + '://' + domain + '/gsm/auth/twitter/callback/');

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
            variables.scripts += `window.history.replaceState({}, document.title, "/gsm/");`;
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
                <button type='button' class='btn btn-primary w-100' onclick='saveTelegramCredentials()' disabled id="authTelegramButton">Autentica Telegram</button>
                <script>
                    $(document).ready(function() { 
                        if (localStorage.getItem('telegramToken') !== null && localStorage.getItem('telegramChatID') !== null) {
                            document.getElementById('telegramToken').value = localStorage.getItem('telegramToken');
                            document.getElementById('telegramChatID').value = localStorage.getItem('telegramChatID');
                            checkTelegramCredentials();
                        }
                        
                        $('#telegramToken').on('input', function() {
                            checkTelegramCredentials();
                        });
                        $('#telegramChatID').on('input', function() {
                            checkTelegramCredentials()
                        });
                    });
                     
                    function checkTelegramCredentials() {
                        const token = document.getElementById('telegramToken').value;
                        const chatID = document.getElementById('telegramChatID').value;
                        
                        if (token === '' || chatID === '') {
                            $('#authTelegramButton').prop('disabled', true);
                        }
                        else if (token !== '' && chatID !== '') {
                            $('#authTelegramButton').prop('disabled', false);
                        }
                    }
                
                    function saveTelegramCredentials() {
                        if (document.getElementById('telegramToken').value === '' || document.getElementById('telegramChatID').value === '') {
                            showToast("Compila tutti i dati d'autenticazione Telegram.", 'danger');
                            return;
                        }
                        
                        const token = document.getElementById('telegramToken').value;
                        const chatID = document.getElementById('telegramChatID').value;
                        window.location.href = '/gsm/auth/telegram/check?token=' + token + '&chatID=' + chatID;
                    }
                </script>`;
    } else {
        variables.telegramToggle = `checked`;

        if (req.query.telegramAuthenticated) {
            variables.scripts += `showToast('Autenticazione a Telegram avvenuta con successo.', 'primary');`;
            variables.scripts += `localStorage.setItem('telegramToken', '${req.session.telegramToken}');`;
            variables.scripts += `localStorage.setItem('telegramChatID', '${req.session.telegramChatID}');`;
            variables.scripts += `window.history.replaceState({}, document.title, "/gsm/");`;
        }

        variables.telegramAuth = `
            <button type='button' class='btn btn-danger w-100 mt-2' onclick='exitFromTelegram()'>Disconnetti Telegram</button>
            <script>
                function exitFromTelegram() {
                    window.location.href = '/gsm/auth/telegram/exit';
                }
            </script>`;
    }

    if (!req.session.facebookToken || !req.session.facebookPageID) {
        if (req.query.facebookAuthenticatedError) {
            variables.scripts += `showToast('Autenticazione a Facebook fallita.', 'danger');`;
            variables.scripts += `window.history.replaceState({}, document.title, "/gsm/");`;
        }

        variables.facebookAuth = `
                <form class="mt-2">
                    <div class="mb-3">
                        <label for="facebookToken" class="form-label">Token</label>
                        <input type="text" class="form-control" id="facebookToken">
                    </div>
                    <div class="mb-3">
                        <label for="facebookChatID" class="form-label">Page ID</label>
                        <input type="text" class="form-control" id="facebookPageID">
                    </div>
                </form>
                <button type='button' class='btn btn-primary w-100' onclick='saveFacebookCredentials()' disabled id="authFacebookButton">Autentica Facebook</button>
                <script>
                    $(document).ready(function() {
                        if (localStorage.getItem('facebookToken') !== null && localStorage.getItem('facebookPageID') !== null) {
                            document.getElementById('facebookToken').value = localStorage.getItem('facebookToken');
                            document.getElementById('facebookPageID').value = localStorage.getItem('facebookPageID');
                            checkFacebookCredentials();
                        }
                        
                        $('#facebookToken').on('input', function() {
                            checkFacebookCredentials();
                        });
                        $('#facebookPageID').on('input', function() {
                            checkFacebookCredentials()
                        });
                    });
                    
                    function checkFacebookCredentials() {
                        const token = document.getElementById('facebookToken').value;
                        const pageID = document.getElementById('facebookPageID').value;
                        
                        if (token === '' || pageID === '') {
                            $('#authFacebookButton').prop('disabled', true);
                        }
                        else if (token !== '' && pageID !== '') {
                            $('#authFacebookButton').prop('disabled', false);
                        }
                    }
                
                    function saveFacebookCredentials() {
                        if (document.getElementById('facebookToken').value === '' || document.getElementById('facebookPageID').value === '') {
                            showToast("Compila tutti i dati d'autenticazione Facebook.", 'danger');
                            return;
                        }
                        
                        const token = document.getElementById('facebookToken').value;
                        const pageID = document.getElementById('facebookPageID').value;
                        window.location.href = '/gsm/auth/facebook/check?token=' + token + '&pageID=' + pageID;
                    }
                </script>`;
    } else {
        variables.facebookToggle = `checked`;

        if (req.query.facebookAuthenticated) {
            variables.scripts += `showToast('Autenticazione a Facebook avvenuta con successo.', 'primary');`;
            variables.scripts += `localStorage.setItem('facebookToken', '${req.session.facebookToken}');`;
            variables.scripts += `localStorage.setItem('facebookPageID', '${req.session.facebookPageID}');`;
            variables.scripts += `window.history.replaceState({}, document.title, "/gsm/");`;
        }

        variables.facebookAuth = `
            <button type='button' class='btn btn-danger w-100 mt-2' onclick='exitFromFacebook()'>Disconnetti Facebook</button>
            <script>
                function exitFromFacebook() {
                    window.location.href = '/gsm/auth/facebook/exit';
                }
            </script>`;
    }

    if (!req.session.wordpressUsername || !req.session.wordpressPassword) {
        if (req.query.wordpressAuthenticatedError) {
            variables.scripts += `showToast('Autenticazione a Wordpress fallita.', 'danger');`;
            variables.scripts += `window.history.replaceState({}, document.title, "/gsm/");`;
        }

        variables.wordpressAuth = `
                <form class="mt-2">
                    <div class="mb-3">
                        <label for="wordpressUsername" class="form-label">Username</label>
                        <input type="text" class="form-control" id="wordpressUsername">
                    </div>
                    <div class="mb-3">
                        <label for="wordpressPassword" class="form-label">Password</label>
                        <input type="text" class="form-control" id="wordpressPassword">
                    </div>
                </form>
                <button type='button' class='btn btn-primary w-100' onclick='saveWordpressCredentials()' disabled id="authWordpressButton">Autentica Wordpress</button>
                <script>
                    $(document).ready(function() {
                        if (localStorage.getItem('wordpressUsername') !== null && localStorage.getItem('wordpressPassword') !== null) {
                            document.getElementById('wordpressUsername').value = localStorage.getItem('wordpressUsername');
                            document.getElementById('wordpressPassword').value = localStorage.getItem('wordpressPassword');
                            checkWordpressCredentials();
                        }
                        
                        $('#wordpressUsername').on('input', function() {
                            checkWordpressCredentials();
                        });
                        $('#wordpressPassword').on('input', function() {
                            checkWordpressCredentials()
                        });
                    });
                    
                    function checkWordpressCredentials() {
                        const username = document.getElementById('wordpressUsername').value;
                        const password = document.getElementById('wordpressPassword').value;
                        
                        if (username === '' || password === '') {
                            $('#authWordpressButton').prop('disabled', true);
                        }
                        else if (username !== '' && password !== '') {
                            $('#authWordpressButton').prop('disabled', false);
                        }
                    }
                
                    function saveWordpressCredentials() {
                        if (document.getElementById('wordpressUsername').value === '' || document.getElementById('wordpressPassword').value === '') {
                            showToast("Compila tutti i dati d'autenticazione Wordpress.", 'danger');
                            return;
                        }
                        
                        const username = document.getElementById('wordpressUsername').value;
                        const password = document.getElementById('wordpressPassword').value;
                        window.location.href = '/gsm/auth/wordpress/check?username=' + username + '&password=' + password;
                    }
                </script>`;
    } else {
        variables.wordpressToggle = `checked`;

        if (req.query.wordpressAuthenticated) {
            variables.scripts += `showToast('Autenticazione a Wordpress avvenuta con successo.', 'primary');`;
            variables.scripts += `localStorage.setItem('wordpressUsername', '${req.session.wordpressUsername}');`;
            variables.scripts += `localStorage.setItem('wordpressPassword', '${req.session.wordpressPassword}');`;
            variables.scripts += `window.history.replaceState({}, document.title, "/gsm/");`;
        }

        variables.wordpressSettings += `
            <div id="wordpressEnabled" class="mt-5">
                    ${variables.twitterSettings !== "" ? "<hr class='pb-2'>" : ""}
                    <label for="text" class="form-label">Impostazioni Wordpress</label>
                    <div class="input-group pb-3">
                        <span class="input-group-text" id="wordpressLiveBlogIDSpan">Pubblica in</span>
                        <input type="text" class="form-control" placeholder="ID live blog" aria-label="Identificativo" aria-describedby="wordpressLiveBlogIDSpan" id="wordpressLiveBlogID" value="${req.session.wordpressLiveBlogID ? req.session.wordpressLiveBlogID : ""}">
                    </div>
                    <hr class="pt-2">
                </div>
            `

        variables.wordpressAuth = `
            <button type='button' class='btn btn-danger w-100 mt-2' onclick='exitFromWordpress()'>Disconnetti Wordpress</button>
            <script>
                function exitFromWordpress() {
                    window.location.href = '/gsm/auth/wordpress/exit';
                }
            </script>`;
    }

    res.render('index', variables);
});

module.exports = router;
