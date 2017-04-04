"use strict";
//TODO: Complete helioviewer sdk
var https = require('https');
var fs = require('fs');
var opn = require('opn');
var ProgressBar = require('progress');

/*
http://helioviewer.org/api/docs/v1/
The Helioviewer Project maintains a set of Public APIs with the goal of improving access to solar and heliospheric
datasets to scientists, educators, developers, and the general public. Read below for descriptions of each API
endpoint and examples of usage.
*/
const helpers = require('./helpers');

let helioviewer = {
    getjp2image(object){
    /*
     Helioviewer.org and JHelioviewer operate off of JPEG2000 formatted image data generated from science-quality FITS files. Use the APIs below to interact directly with these intermediary JPEG2000 files.

     Download a JP2 image for the specified datasource that is the closest match in time to the `date` requested.

     Either `sourceId` must be specified, or the combination of `observatory`, `instrument`, `detector`, and `measurement`.

     Request Parameters:

     Parameter	Required	Type	Example	Description
     date	Required	string	2014-01-01T23:59:59Z	Desired date/time of the JP2 image. ISO 8601 combined UTC date and time UTC format.
     sourceId	Optional	number	14	Unique image datasource identifier.
     observatory	Optional	string	SDO	Observatory name.
     instrument	Optional	string	AIA	Instrument name.
     detector	Optional	string	AIA	Detector name.
     measurement	Optional	string	335	Measurement name.
     jpip	Optional	boolean	false	Optionally return a JPIP URI instead of the binary data of the image itself.
     json	Optional	boolean	false	Optionally return a JSON object.


     EXAMPLE: http://helioviewer.org/api/v1/getJP2Image/?date=2014-01-01T23:59:59Z&sourceId=14&jpip=true
     */
    let base_url = 'https://api.helioviewer.org/v2/getJP2Image/?';
    let req_url = '';
    try {

            helpers.validate_iso8601(object.date);
            if (object.date.charAt(-1) !== 'Z') {
                object.date += 'Z';
            }
            base_url += 'date=' + object.date + '&';
    }
        catch(e){
            throw "date is a required parameter";
        }
        if (object.sourceId) {
            base_url += "sourceId=" + object.sourceId + "&";
        }
        req_url += base_url + "json=true&jpip=true";



        helpers.dispatch_http_get(req_url, function(data){
            return data;
        });

    },
    getjp2header(id){
        /*
         GET /api/v1/getJP2Header/


         Get the XML header embedded in a JPEG2000 image. Includes the FITS header as well as a section of Helioviewer-specific metadata.

         Request Parameters:

         Parameter	Required	Type	Example	Description
         id	Required	number	7654321	Unique JP2 image identifier.
         callback	Optional	string		Wrap the response object in a function call of your choosing.

         Example (A):

         string (XML)

         Example Request:

         http://helioviewer.org/api/v1/getJP2Header/?id=7654321

         */
        helpers.dispatch_http_get_xml('https://api.helioviewer.org/v2/getJP2Header/?id=' + id, function(data){
            return data;
        });

    },
    getJPX(object){
        let base_url = 'https://api.helioviewer.org/v2/getJPX/?';
        let req_url = '';
        helpers.validate_iso8601(object.startTime);
        if (object.startTime.charAt(-1) !== 'Z') {
                object.startTime += 'Z';
        }

        base_url += 'startTime=' + object.startTime + '&';

        helpers.validate_iso8601(object.endTime);
            if (object.endTime.charAt(-1) !== 'Z') {
                object.endTime += 'Z';
            }

        base_url += 'endTime=' + object.endTime + '&';

        if (object.sourceId) {
            base_url += "sourceId=" + object.sourceId + "&";
        }
        if (object.linked) {
            base_url += "linked=" + object.linked + "&";
        }
        if (object.cadence) {
            base_url += "cadence=" + object.cadence + "&";
        }
        req_url += base_url + "verbose=true&jpip=true";
        helpers.dispatch_http_get(req_url, function(data){
            return data;
        });
    },
    getJPXClosestToMidPoint(object){
        let base_url = 'https://api.helioviewer.org/v2/getJPXClosestToMidPoint/?';
        let req_url = '';

        base_url += 'startTimes=';
        for(let x in object.startTimes){
            base_url += object.startTimes[x] + ',';
        }
        base_url = base_url.slice(0, -1) + "&";

        base_url += 'endTimes=';
        for(let x in object.endTimes){
            base_url += object.endTimes[x] + ',';
        }
        base_url = base_url.slice(0, -1) + "&";

        base_url += "sourceId=" + object.sourceId + "&";

        if (object.linked) {
            base_url += "linked=" + object.linked + "&";
        }
        req_url += base_url + "verbose=true&jpip=true";
        helpers.dispatch_http_get(req_url, function(data){
            return data;
        });
    },
    queueMovie(object){
        let base_url = 'https://api.helioviewer.org/v2/queueMovie/?';
        let req_url = '';
        helpers.validate_iso8601(object.startTime);
        if (object.startTime.charAt(-1) !== 'Z') {
            object.startTime += 'Z';
        }
        base_url += 'startTime=' + object.startTime + '&';

        helpers.validate_iso8601(object.endTime);
        if (object.endTime.charAt(-1) !== 'Z') {
            object.endTime += 'Z';
        }
        base_url += 'endTime=' + object.endTime + '&';
        base_url += 'layers=' + object.layers + '&';
        base_url += 'events=' + object.events + '&';
        base_url += 'eventsLabels=' + object.eventsLabels + '&';
        base_url += 'imageScale=' + object.imageScale + '&';

        if(object.format){
            base_url += 'format=' + object.format + '&';
        }
        if(object.frameRate){
            base_url += 'frameRate=' + object.frameRate + '&';
        }
        if(object.maxFrames){
            base_url += 'maxFrames=' + object.maxFrames + '&';
        }
        if(object.scale){
            base_url += 'scale=' + object.scale + '&';
        }
        if(object.scaleType){
            base_url += 'scaleType=' + object.scaleType + '&';
        }
        if(object.scaleX){
            base_url += 'scaleX=' + object.scaleX + '&';
        }
        if(object.scaleY){
            base_url += 'scaleY=' + object.scaleY + '&';
        }
        if(object.movieLength){
            base_url += 'movieLength=' + object.movieLength + '&';
        }
        if(object.watermark){
            base_url += 'watermark=' + object.watermark + '&';
        }
        if(object.width){
            base_url += 'width=' + object.width + '&';
        }
        if(object.height){
            base_url += 'height=' + object.height + '&';
        }
        if(object.x0){
            base_url += 'x0=' + object.x0 + '&';
        }
        if(object.y0){
            base_url += 'y0=' + object.y0 + '&';
        }
        if(object.x1){
            base_url += 'x1=' + object.x1 + '&';
        }
        if(object.y1){
            base_url += 'y1=' + object.y1 + '&';
        }
        if(object.x2){
            base_url += 'x2=' + object.x2 + '&';
        }
        if(object.y2){
            base_url += 'y2=' + object.y2 + '&';
        }
        if(object.callback){
            base_url += 'callback=' + object.callback + '&';
        }

        helpers.dispatch_http_get(base_url.slice(0, -1), function(data){
            return data;
        });

        },
    reQueueMovie(id){
        helpers.dispatch_http_get("https://api.helioviewer.org/v2/reQueueMovie/?id=" + id, function(data){
            return data;
        });
    },
    getMovieStatus(object){
        let base_url = 'https://api.helioviewer.org/v2/getMovieStatus/?';
        base_url += 'id=' + object.id + '&';
        base_url += 'format=' + object.format + '&';
        if(object.verbose){
            base_url += 'verbose=' + object.verbose + '&';
        }
        if(object.callback){
            base_url += 'callback=' + object.callback + "&";
        }
        if(object.token){
            base_url += 'token=' + object.token + "&";
        }

        helpers.dispatch_http_get(base_url.slice(0, -1), function(data){
            return data;
        });
    },
    downloadMovie(object){
        let base_url = 'https://api.helioviewer.org/v2/downloadMovie/?';
        base_url += 'id=' + object.id + '&';
        base_url += 'format=' + object.format + '&';
        if(object.hq){
            base_url += 'hq=' + object.hq;
        }
        var file = fs.createWriteStream(object.id + "." + object.format);
        var req = https.get(base_url);
        req.on('response', function(res){
                var len = parseInt(res.headers['content-length'], 10);
                console.log();
                var bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: len
                });
                res.pipe(file);
                res.on('data', function (chunk) {
                    bar.tick(chunk.length);
                });
            res.on('end', function () {
                console.log('\n');
            });
        });

        req.end();
    },
    playMovie(object){
        let base_url = 'https://api.helioviewer.org/v2/playMovie/?';
        base_url += 'id=' + object.id + '&';
        base_url += 'format=' + object.format + '&';
        base_url += 'height=' + object.height + '&';
        if(object.hq){
            base_url += 'hq=' + object.hq + '&';
        }
        if(object.width){
            base_url += 'width=' + object.width + '&';
        }
        let req_url = base_url.slice(0, -1);
        opn(req_url);
    },
    takeScreenshot(object){
        /*You must specify values for either `x1`, `y1`, `x2`, and `y2`
         or `x0`, `y0`, `width` and `height`.
         date, imageScale, layers, and eventsLabels are required
         */

        let base_url = 'https://api.helioviewer.org/v2/takeScreenshot/?';
        helpers.validate_iso8601(object.date);
        if (object.date.charAt(-1) !== 'Z') {
            object.date += 'Z';
        }
        base_url += 'date=' + object.date + '&';
        base_url += 'imageScale=' + object.imageScale + '&';
        base_url += 'layers=' + object.layers + '&';
        base_url += 'height=' + object.height + '&';
        if(object.events){
            base_url += 'events=' + object.events + '&';
        }
        if(object.scale){
            base_url += 'scale=' + object.scale + '&';
        }
        if(object.scaleType){
            base_url += 'events=' + object.scaleType + '&';
        }
        if(object.scaleX){
            base_url += 'scaleX=' + object.scaleX + '&';
        }
        if(object.scaleY){
            base_url += 'scaleY=' + object.scaleY + '&';
        }
        if(object.width){
            base_url += 'width=' + object.width + '&';
        }
        if(object.x0){
            base_url += 'x0=' + object.x0 + '&';
        }
        if(object.y0){
            base_url += 'y0=' + object.y0 + '&';
        }
        if(object.x1){
            base_url += 'x1=' + object.x1 + '&';
        }
        if(object.y1){
            base_url += 'y1=' + object.y1 + '&';
        }
        if(object.x2){
            base_url += 'x2=' + object.x2 + '&';
        }
        if(object.y2){
            base_url += 'y2=' + object.y2 + '&';
        }
        if(object.watermark){
            base_url += 'watermark=' + object.watermark + '&';
        }
        if(object.callback){
            base_url += 'callback=' + object.callback + '&';
        }
        if(object.display){
            base_url += 'display=' + object.display + '&';
            if(object.display === true){
                return opn(base_url.slice(0, -1));
            }
        }
        helpers.dispatch_http_get(base_url.slice(0, -1), function(data){
            return data;
        });
    },
    downloadScreenshot(id){
        let base_url = 'https://api.helioviewer.org/v2/downloadScreenshot/?id=' + id;
        var file = fs.createWriteStream(id + ".png");
        var req = https.get(base_url);
        req.on('response', function(res){
            var len = parseInt(res.headers['content-length'], 10);
            console.log();
            var bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 20,
                total: len
            });
            res.pipe(file);
            res.on('data', function (chunk) {
                bar.tick(chunk.length);
            });
            res.on('end', function () {
                console.log('\n');
            });
        });

        req.end();
    },
    getClosestImage(object){
        let base_url = "https://api.helioviewer.org/v2/getClosestImage/?";
        helpers.validate_iso8601(object.date);
        if (object.date.charAt(-1) !== 'Z') {
            object.date += 'Z';
        }
        base_url += "date=" + object.date + "&";
        base_url += "sourceId=" + object.sourceId + "&";
        if(object.callback){
            base_url += "callback=" + object.callback + "&";
        }
        helpers.dispatch_http_get(base_url.slice(0, -1), function(data){
            return data;
        });
    },
    getDataSources(object){
        let base_url = "https://api.helioviewer.org/v2/getDataSources/?";
        if (!object) {
            return helpers.dispatch_http_get(base_url.slice(0, -1), function(data){
                return data;
            });
        }
        if(object.verbose){
            base_url += "verbose=" + object.verbose + "&";
        }
        if(object.enable){
            base_url += "enable=" + object.enable + "&";
        }
        if(object.callback){
            base_url += "callback=" + object.callback + "&";
        }
        helpers.dispatch_http_get(base_url.slice(0, -1), function(data){
            return data;
        });
    },
    getTile(object){
        let base_url = "https://api.helioviewer.org/v2/getTile/?";
        base_url += "id=" + object.id + "&";
        base_url += "x=" + object.x + "&";
        base_url += "y=" + object.y + "&";
        base_url += "imageScale=" + object.imageScale + "&";
        helpers.dispatch_http_get(base_url.slice(0, -1), function(data){
            return data;
        });
    },
    shortenURL(query, callback){
        let base_url = "https://api.helioviewer.org/v2/shortenURL/?";
        base_url += "queryString=" + query + "&";
        if(callback){
            base_url += "callback=" + callback + "&";
        }
        helpers.dispatch_http_get(base_url.slice(0, -1), function(data){
            return data;
        });
    },
    getNewsFeed(callback){
        let base_url = "https://api.helioviewer.org/v2/getNewsFeed/?";
        if(callback){
            base_url += "callback=" + callback;
        }
        helpers.dispatch_http_get_xml(base_url, function(data){
            return data;
        });
    }
};
module.exports = helioviewer;

//helioviewer.getjp2image({date:"2014-01-01T23:59:59", sourceId:14});
//helioviewer.getjp2header(17654321);
/*helioviewer.getJPX({
    startTime: "2014-01-01T00:00:00",
    endTime: "2014-01-01T00:45:00" ,
    sourceId: 14,
    cadence: 12
});
*/
/*helioviewer.getJPXClosestToMidPoint({
    startTimes: [1306886400,1306887000,1306887600],
    endTimes: [1306886700,1306887300,1306887900] ,
    sourceId: 14,
    linked: true
});
    */

/*helioviewer.queueMovie({
    startTime: "2010-03-01T12:12:12",
    endTime: "2010-03-04T12:12:12",
    layers: "[3,1,100],[4,1,100]",
    events: "[AR,HMI_HARP;,SPoCA,1],[CH,all,1]",
    eventsLabels: false,
    imageScale: 21.04,
    format: "mp4",
    frameRate: 15,
    maxFrames: 300,
    scale: true,
    scaleType: "earth",
    scaleX: -1000,
    scaleY: -500,
    movieLength: 4.3333,
    watermark: true,
    width: 1920,
    height: 1200,
    x0: 0,
    y0: 0,
    x1: -5000,
    y1: -5000,
    x2: 5000,
    y2: 5000,
    //callback: "Wrap the response object in a function call of your choosing."
});*/

//helioviewer.reQueueMovie("VXvX5");

/*helioviewer.getMovieStatus({
    id: "VXvX5",
    format: "mp4",
    verbose: true,
    //callback: "callback",
    //token: "4673d6db4e2a3365ab361267f2a9a112"
});*/

/*helioviewer.downloadMovie({
    id: "VXvX5",
    format: "mp4",
    hq: true
});*/
/*
helioviewer.playMovie({
 id: "VXvX5",
 format: "mp4",
 height: 820,
 //hq: true,
 //width: 846
 });
 */

/*helioviewer.takeScreenshot({
    date: "2014-01-01T23:59:59",
    imageScale: 2.4204409,
    layers: "[SDO,AIA,AIA,335,1,100]",
    eventLabels: false,
    height: 1200,
    //events: "[AR,HMI_HARP;SPoCA,1],[CH,all,1]"
    //scale: false,
    //scaleType: "earth",
    //scaleX: -1000,
    //scaleY: -500,
    //width: 1920,
    //x0: 1,
    //y0: 1,
    x1: -5000,
    y1: -5000,
    x2: 5000,
    y2: 5000,
    display: true,
    watermark: false
});
    */

//helioviewer.downloadScreenshot(3240748);
//helioviewer.getClosestImage({date: "2014-01-01T23:59:59", sourceId: 14});

/*helioviewer.getDataSources({
    verbose: true,
    enable: "[Yohkoh,STEREO_A,STEREO_B]",
    //callback: "callback
 });
 */

/*helioviewer.getTile({
    id: 36275490,
    x: -1,
    y: -1,
    imageScale: 2.42044088
});*/

//helioviewer.shortenURL("date%3D2014-02-25T15%3A18%3A07.000Z%26imageScale%3D2.4204409%26centerX%3D-410.06307838566283%26centerY%3D-244.6662219973343%26imageLayers%3D%255BSDO%2CAIA%2CAIA%2C304%2C1%2C100%255D%26eventLayers%3D%26eventLabels%3Dtrue");

//helioviewer.getNewsFeed();