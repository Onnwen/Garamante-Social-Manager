var express = require('express');
const {TwitterApi} = require("twitter-api-v2");
var router = express.Router();

const client = new TwitterApi({
  appKey: '8sH260P4Gcz7C3YzdTvlAE8D8',
  appSecret: 'GNJhj6MvzwvpTdhUE7vbBH4hLR6DeClf1PLF6bq87MEHvtLmzm'
});

/* GET home page. */
router.get('/', async function (req, res, next) {
  const variables = {"toast": "", "twitterAuth": ""};

  if (req.session.loggedClient) {
    variables.twitterAuth = "<button type='button' class='btn btn-danger w-100' onclick='window.location.href=\"" + authLink.url + "\"'>Disconnetti Twitter</button>";

    if (req.query.twitterAuthenticated) {
        variables.toast = "<div class=\"toast align-items-center text-bg-primary border-0 mx-2 my-3 position-absolute bottom-0 end-0\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\">\n" +
            "  <div class=\"d-flex\">\n" +
            "    <div class=\"toast-body\">\n" +
            "      Autenticazione a Twitter avvenuta con successo.\n" +
            "    </div>\n" +
            "    <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>\n" +
            "  </div>\n" +
            "</div>\n" +
            "<script>\n" +
            "  $(document).ready(function() {\n" +
            "    $(\".toast\").toast('show');\n" +
            "  });\n" +
            "</script>"
    }
  } else {
    if (req.query.twitterAuthenticationError) {
      variables.toast = "<div class=\"toast align-items-center text-bg-danger border-0 mx-2 my-3 position-absolute bottom-0 end-0\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\">\n" +
          "  <div class=\"d-flex\">\n" +
          "    <div class=\"toast-body\">\n" +
          "      Autenticazione a Twitter fallita.\n" +
          "    </div>\n" +
          "    <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\" aria-label=\"Close\"></button>\n" +
          "  </div>\n" +
          "</div>\n" +
          "<script>\n" +
          "  $(document).ready(function() {\n" +
          "    $(\".toast\").toast('show');\n" +
          "  });\n" +
          "</script>"
    }

    const authLink = await client.generateAuthLink('oob');

    if (!authLink) {
      return res.status(400).send('Invalid request!');
    }

    req.session.oauth_token = authLink.oauth_token;
    req.session.oauth_token_secret = authLink.oauth_token_secret;

    variables.twitterAuth = "<button type='button' class='btn btn-primary w-100' onclick='window.location.href=\"" + authLink.url + "\"'>Autentica Twitter</button>";
  }

  res.render('index', variables);
});

module.exports = router;
