var request = require('request');
var fs = require('fs');
var scraper = require('../lib/facebook-nologin-scraper');
function facebook(url,callback) {
    request(url,
        {
            headers: {
                'user-agent': 'curl/7.47.0',
                'accept-language': 'en-US,en',
                'accept': '*/*'
            }
        }, function (error, response, body) {
            if (error) {
                throw (error);
            }
            if (response.statusCode === 200) {
                var result = scraper(body);
                //console.log(JSON.stringify(result, null, 2));
                callback(result);
              /*  fs.writeFile("facebook.json", JSON.stringify(result, null, 2), 'utf8', function (err) {
                    if (err) {
                        return console.log(err);
                    }

                    console.log("The file was saved!");
                });*/
            } else {
                var result = response.statusCode;
                callback(result);
                console.log('HTTP Error: ' + response.statusCode);
            }
        });

}
module.exports.facebook=facebook;