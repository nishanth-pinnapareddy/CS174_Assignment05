/**
 * Created by Nishanth Reddy on 5/4/2017.
 */
'use strict';

var config = {
    "host" : "54.145.235.174",
    "port" : 9000
}


function getTweets(){
    $.get("http://" + config.host +":" + config.port + "/tweets", function(data, status){
        $('#tweets').html(JSON.stringify(data, undefined, 2));
    });
}

function getUsers(){
    $.get("http://" + config.host +":" + config.port + "/users", function(data, status){
        $('#users').html(JSON.stringify(data, undefined, 2));
    });
}

function getTweetById(){
    let tweet_id =  $('#tweet_id').val();
    $.get("http://" + config.host +":" + config.port + "/tweet/" + tweet_id, function(data, status){
        $('#tweetById').html(JSON.stringify(data, undefined, 2));
    });
}

function getUserByScreenName(){
    let screen_name = $('#screen_name').val();
    $.get("http://" + config.host +":" + config.port + "/user/" + screen_name, function(data, status){
        $('#userByName').html(JSON.stringify(data, undefined, 2));
    });
}

function getLinksInTweets(){
    $.get("http://" + config.host +":" + config.port + "/links", function(data, status){
        $('#links').html(JSON.stringify(data, undefined, 2));
    });
}
