const express = require('express');
const {TwitterApi} = require('twitter-api-v2');
const router = express.Router();
const axios = require("axios");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const FormData = require("form-data");
const webp = require('webp-converter');
const imageCompression = require('browser-image-compression');

/* GET publish listing. */
router.post('/twitter', async function (req, res, next) {
    if (!req.body.text) {
        return res.status(400).send({message: 'Errore durante la pubblicazione su Twitter. (È necessario fornire un testo)', status: 'danger'});
    }

    const text = req.body.text;

    const client = new TwitterApi({
        appKey: '8sH260P4Gcz7C3YzdTvlAE8D8',
        appSecret: 'GNJhj6MvzwvpTdhUE7vbBH4hLR6DeClf1PLF6bq87MEHvtLmzm',
        accessToken: req.session.oauth_token,
        accessSecret: req.session.oauth_token_secret,
    });

    let mediaIDs = [];
    if (req.body.mediasNames) {
        try {
            let promises = [];
            for (let i = 0; i < req.body.mediasNames.length; i++) {
                promises.push(client.v1.uploadMedia('routes/uploads/' + req.body.mediasNames[i]));
            }
            mediaIDs = await Promise.all([
                ...promises
            ]);
        }
        catch (error) {
            console.log(error);
            if (error.errors[0].message) {
                return res.status(500).send({message: 'Errore durante la pubblicazione su Twitter. (' + error.errors[0].message + ')', status: 'danger'});
            }
            else {
                return res.status(500).send({
                    message: 'Errore durante la pubblicazione su Twitter. (' + error + ')',
                    status: 'danger'
                });
            }
        }
    }

    try {
        if (mediaIDs.length > 0) {
            if (req.body.twitterPostResponseID === "") {
                const {data: createdTweet} = await client.v2.tweet({
                    text: text,
                    media: {media_ids: mediaIDs}
                });
                req.session.lastTweetId = createdTweet.id;
            }
            else {
                const {data: createdTweet} = await client.v2.tweet({
                    text: text,
                    media: {media_ids: mediaIDs},
                    reply: {
                        in_reply_to_tweet_id: req.body.twitterPostResponseID
                    }
                });
                req.session.lastTweetId = createdTweet.id;
            }
        }
        else {
            if (req.body.twitterPostResponseID !== "") {
                const { data: createdTweet } = await client.v2.tweet({
                    text: text,
                    reply: {
                        in_reply_to_tweet_id: req.body.twitterPostResponseID
                    }
                });
                req.session.lastTweetId = createdTweet.id;
            }
            else {
                const {data: createdTweet} = await client.v2.tweet({
                    text: text
                });
                req.session.lastTweetId = createdTweet.id;
            }
        }

        return res.status(200).send({message: 'Pubblicato su Twitter.', status: 'primary', createdTweetedId: req.session.lastTweetId ? req.session.lastTweetId : ""});
    } catch (error) {
        console.log(error)
        try {
            return res.status(500).send({message: 'Errore durante la pubblicazione su Twitter. (' + error.errors[0].message + ')', status: 'danger'});
        }
        catch (e) {
            return res.status(500).send({
                message: 'Errore durante la pubblicazione su Twitter.',
                status: 'danger'
            });
        }
    }
});

router.post('/telegram', async function (req, res, next) {
    if (!req.body.text) {
        return res.status(400).send({message: 'Errore durante la pubblicazione su Telegram. (È necessario fornire un testo)', status: 'danger'});
    }

    const text = req.body.text;
    if (req.body.mediasNames) {
        try {
            let formData = new FormData();
            formData.append("chat_id", req.session.telegramChatID);
            formData.append("caption", text);

            let apiEndpoint = "sendPhoto";
            const fileExtension = path.extname(req.body.mediasNames[0]);
            if (fileExtension === '.mp4' || fileExtension === '.mov' || fileExtension === '.avi' || fileExtension === '.mkv' || fileExtension === '.wmv' || fileExtension === '.flv' || fileExtension === '.webm') {
                formData.append("video", fs.createReadStream('routes/uploads/' + req.body.mediasNames[0]));
                apiEndpoint = "sendVideo";
            }
            else {
                formData.append("photo", fs.createReadStream('routes/uploads/' + req.body.mediasNames[0]));
            }

            axios.post('https://api.telegram.org/bot' + req.session.telegramToken + '/' + apiEndpoint + '?chat_id=' + req.session.telegramChatID, formData)
                .then(response => {
                    if (response.status === 200 && response.data.ok) {
                        res.status(200).send({message: 'Pubblicato su Telegram.', status: 'primary'});
                    } else {
                        console.log(response.data);
                        res.status(500).send({
                            message: 'Errore durante la pubblicazione su Telegram. (' + response.data + ')',
                            status: 'danger'
                        });
                    }
                })
                .catch(error => {
                    try {
                        console.log(error.response.data.description);
                        res.status(500).send({
                            message: 'Errore durante la pubblicazione su Telegram. (' + error.response.data.description + ')',
                            status: 'danger'
                        });
                    }
                    catch (error) {
                        console.log(error.response);
                        res.status(500).send({
                            message: 'Errore durante la pubblicazione su Telegram.',
                            status: 'danger'
                        });
                    }
                });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Errore durante la pubblicazione su Telegram. (' + error + ')',
                status: 'danger'
            });
        }
    }
    else {
        try {
            axios.get('https://api.telegram.org/bot' + req.session.telegramToken + '/sendMessage?chat_id=' + req.session.telegramChatID + '&text=' + encodeURIComponent(text))
                .then(response => {
                    if (response.status === 200 && response.data.ok) {
                        res.status(200).send({message: 'Pubblicato su Telegram.', status: 'primary'});
                    } else {
                        res.status(500).send({
                            message: 'Errore durante la pubblicazione su Telegram. (' + response.data.description + ')',
                            status: 'danger'
                        });
                    }
                })
                .catch(error => {
                    try {
                        console.log(error.response.data.description);
                        res.status(500).send({
                            message: 'Errore durante la pubblicazione su Telegram. (' + error.response.data.description + ')',
                            status: 'danger'
                        });
                    }
                    catch (error) {
                        console.log(error.response);
                        res.status(500).send({
                            message: 'Errore durante la pubblicazione su Telegram.',
                            status: 'danger'
                        });
                    }
                });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Errore durante la pubblicazione su Telegram. (' + error.data.description + ')',
                status: 'danger'
            });
        }
    }
});

router.post('/facebook', async function (req, res, next) {
    if (!req.body.text) {
        return res.status(400).send({message: 'Errore durante la pubblicazione su Facebook. (È necessario fornire un testo)', status: 'danger'});
    }

    const text = req.body.text;

    try {
        axios.post('https://graph.facebook.com/' + req.session.facebookPageID + '/feed?message=' + encodeURIComponent(text) + '&access_token=' + req.session.facebookToken)
            .then(response => {
                if (response.status === 200) {
                    res.status(200).send({message: 'Pubblicato su Facebook.', status: 'primary'});
                }
                else {
                    console.log(response)
                    res.status(500).send({message: 'Errore durante la pubblicazione su Facebook. (' + response.data + ')', status: 'danger'});
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).send({message: 'Errore durante la pubblicazione su Facebook. (' + error + ')', status: 'danger'});
            });
    }
    catch (error) {
        console.log(error)
        res.status(500).send({message: 'Errore durante la pubblicazione su Facebook. (' + error + ')', status: 'danger'});
    }
});

router.post('/blog', async function (req, res, next) {
    if (!req.body.text || !req.body.post_id) {
        return res.status(400).send({
            message: 'Errore durante la pubblicazione su Wordpress. (È necessario fornire un testo)',
            status: 'danger'
        });
    }

    let html = "<p>" + req.body.text + "</p>";

    for (const mediaName in req.body.mediasNames) {
        const mediaNameWithoutExtension = path.basename(req.body.mediasNames[mediaName], path.extname(req.body.mediasNames[mediaName]));
        const fileExtension = path.extname(req.body.mediasNames[mediaName]);
        if (fileExtension === '.mp4' || fileExtension === '.mov' || fileExtension === '.avi' || fileExtension === '.mkv' || fileExtension === '.wmv' || fileExtension === '.flv' || fileExtension === '.webm') {
            html += "<video controls><source src=\"https://gsm.dangelodario.it/uploads/" + req.body.mediasNames[mediaName] + "\" type=\"video/" + fileExtension.replace('.', '') + "\"></video>";
        }
        else {
            html += "<img src=\"https://garamante.it/gsm/static/" + req.body.mediasNames[mediaName] + "\" alt=\"" + mediaNameWithoutExtension + "\" />";
        }
    }

    await axios.post('https://dangelodario.it/wp-json/liveblog/v1/' + req.body.post_id + '/crud/?gsm=true', {
            "crud_action": "insert",
            "post_id": req.body.post_id,
            "content": html,
            "author_id": 1,
            "contributor_ids": false
        },
        {
            auth: {
                username: req.session.wordpressUsername,
                password: req.session.wordpressPassword
            }
        })
        .then(response => {
            console.log(response)
            if (response.status === 200) {
                res.status(200).send({message: 'Pubblicato su Wordpress.', status: 'primary'});
            } else {
                console.log(response)
                res.status(500).send({
                    message: 'Errore durante la pubblicazione su Wordpress. (' + response.data + ')',
                    status: 'danger'
                });
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).send({
                message: 'Errore durante la pubblicazione su Wordpress. (' + error + ')',
                status: 'danger'
            });
        });
});

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.array('files', 10), (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).send({message: 'Errore durante l\'upload dei files multimediali.', status: 'danger'});
        }

        // const uploadDir = path.join(__dirname, 'uploads');
        // fs.readdir(uploadDir, (err, files) => {
        //     if (err) throw err;
        //
        //     for (const file of files) {
        //         fs.unlink(path.join(uploadDir, file), err => {
        //             if (err) throw err;
        //         });
        //     }
        // });

        const renamedFiles = files.map(file => {
            const newFileName = uuidv4() + path.extname(file.originalname)
            const newPath = path.join(__dirname, 'uploads', newFileName);
            fs.renameSync(file.path, newPath);
            return newFileName;
        });

        return res.status(200).send({mediasNames: renamedFiles});
    }
    catch (error) {
        return res.status(500).send({error: error});
    }
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

module.exports = router;