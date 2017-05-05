/**
 * Created by Nishanth Reddy on 5/3/2017.
 */

'use strict';

const express = require('express');
const config = require('./config');
const tweetData = require('./favs');
const cors = require('cors');
const app = express();

let geturl = new RegExp(
    "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal)" +
    ":(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}" +
    "(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
    ,"g"
);

function traverse(tweet, external_links) {
    for (var key in tweet){
        if (Array.isArray(tweet[key])){
            for (var obj of tweet[key]){
                traverse(obj, external_links)
            }
        }
        else if (typeof tweet[key] == 'string') {
            if (tweet[key].match(geturl)){
                let links = tweet[key].match(geturl);
                for (let link of links) {
                    external_links.push(link.trim());
                }
            }
        }
        if (tweet != null && typeof tweet[key] == 'object') {
            traverse(tweet[key], external_links)
        }
    }
}

app.use(cors());

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

    res.json(tweets);
});

// api to get users information
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

    res.json(users);
});

// api to get links present in tweet
app.get('/links', (req, res) => {
    let response = [];
    for (let tweet of tweetData) {
        let external_links = [];
        traverse(tweet, external_links);
        let unique_external_links = external_links.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });

        response.push({
            tweet_id: tweet.id,
            ext_links: unique_external_links
        });
    }

    res.json(response);
});



//api to get tweet information by id.
app.get('/tweet/:id', (req, res) => {
    let tweetId = req.params.id;
    for (let tweet of tweetData) {
        if (tweet.id == tweetId){
            res.json(tweet);
        }
    }

    res.json(`No tweet with Id : ${tweetId}`);
});

// api to get user information by screen name
app.get('/user/:screen_name', (req, res) => {
    let screen_name = req.params.screen_name;
    for (let tweet of tweetData) {
        let user = tweet['user'];
        if (user.screen_name === screen_name){
            res.json(user);
        }
    }

    res.json(`No user with screen name: ${screen_name}`);
});

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});