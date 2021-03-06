"use strict";

const helpers = require("./helpers");
let geneLab = {
  search(object) {
    let base_url = `https://genelab-data.ndc.nasa.gov/genelab/data/search?term=${
      object.term
    }&type=${object.type}`;
    base_url += "&";
    if (object.from) {
      base_url += "from=" + object.from + "&";
    }
    if (object.size) {
      base_url += "size=" + object.size + "&";
    }
    if (object.sort) {
      base_url += "sort=" + object.sort + "&";
    }
    if (object.order) {
      base_url += "order=" + object.order + "&";
    }
    if (object.ffield) {
      base_url += "ffield=" + object.ffield + "&";
    }
    if (object.fvalue) {
      base_url += "fvalue=" + object.fvalue + "&";
    }
    return helpers.getJSON(
      encodeURI(`${base_url}api_key=${helpers.nasa_api_key()}`),
      "GET"
    );
  },

  htmlSearch(object) {
    let base_url = `https://genelab-data.ndc.nasa.gov/genelab/search_studies/?q=${
      object.query
    }&data_source=${object.data_source}`;
    return helpers.getJSON(
      encodeURI(`${base_url}api_key=${helpers.nasa_api_key()}`),
      "GET"
    );
  }
};

module.exports = geneLab;

//genLab.search({type: 'cgene', term: 'a'})
