/*
The NASA patent portfolio is available to benefit US citizens.

Through partnerships and licensing agreements with industry,
these patents ensure that NASAs investments in pioneering research find secondary uses that benefit the economy
create jobs, and improve quality of life. This endpoint provides structured, searchable developer access to NASAs patents that have been curated to support technology transfer.
 */
let helpers = require('./helpers');


function patents(query, concept_tags, limit){
    /*
     HTTPs REQUEST

     GET https://api.nasa.gov/patents

     QUERY PARAMETERS

     Parameter	Type	Default	Description
     query	string	None	Search text to filter results
     concept_tags	bool	False	Return an ordered dictionary of concepts from the patent abstract
     limit	int	all	number of patents to return
     api_key	string	DEMO_KEY	api.data.gov key for expanded usage
     EXAMPLE QUERY

     https://api.nasa.gov/patents/content?query=temperature&limit=5&api_key=DEMO_KEY

     */
    let base_url = "https://api.nasa.gov/patents/content?";
    if(!query){
        throw "search query is missing, which is mandatory.";
    }
    else if(typeof query !== 'string'){
        try{
            query = query.toString();
        }
        catch(e){
            throw "query has to be type of string";
        }
    }
    else{
        base_url += "query=" + query + "&";
    }
    if(concept_tags){
        base_url += "concept_tags=True" + "&";
    }
    if(limit){
        if(!parseInt(limit)){
            helpers.logger.log('error', "The limit arg you provided is not the type of int, ignoring it");
        }
        base_url += "limit=" + limit.toString() + "&";
    }
    req_url = base_url + "api_key=" + helpers.nasa_api_key();

    return helpers.dispatch_http_get(req_url);
}

module.exports = patents;
/*
patents(query="temperature")
    .then(result => {
        console.log(JSON.parse(result));
        return JSON.parse(result);
});
*/


