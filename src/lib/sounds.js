"use strict";
let helpers = require('./helpers');

function sounds(query, limit){
    let base_url = "https://api.nasa.gov/planetary/sounds?";
    base_url += "q=" + query + "&";
    if (limit){
        base_url += "&limit=" + limit + "&";
    }

    let req_url = base_url + "api_key=" + helpers.nasa_api_key();

    return helpers.getJSON(req_url);

}
module.exports = sounds;
//sounds("apollo", 10);