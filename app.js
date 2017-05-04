/**
 * Created by Nishanth Reddy on 5/3/2017.
 */

'use strict';

const express = require('express');
const config = require('./config');
const tweetData = require('./favs');
const app = express();

// api to get tweet information
app.get('/tweets', (req, res) => {
    let tweets = [];
    for (let tweet of tweetData){
        let minimalTweet = {};
        minimalTweet.created_at = tweet.created_at;
        minimalTweet.id = tweet.id;
        minimalTweet.text = tweet.text;
        tweets.push(minimalTweet);
    }

    res.send(tweets);
});

app.get('/users', (req, res) => {
    let users = {};
    for (let tweet of tweetData){
        let user = tweet['user'];
        if (user.id_str in users == false) {
            let minimalUserInfo = {};
            minimalUserInfo.name = user.name;
            minimalUserInfo.screen_name = user.screen_name;
            users[user.id_str] = minimalUserInfo;
        }
    }

    res.send(users);
});

//api to get tweet information by id.
app.get('/tweet/:id', (req, res) => {
    let tweetId = req.params.id;
    for (let tweet of tweetData) {
        if (tweet.id == tweetId){
            res.send(tweet);
        }
    }

    res.send(`No tweet with Id : ${tweetId}`);
});

app.get('/user/:screen_name', (req, res) => {
    let screen_name = req.params.screen_name;
    for (let tweet of tweetData) {
        let user = tweet['user'];
        if (user.screen_name === screen_name){
            res.send(user);
        }
    }

    res.send(`No user with screen name: ${screen_name}`);
});

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});