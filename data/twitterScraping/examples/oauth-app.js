/**
 * Example of getting application level bearer token, making an oauth 2 call, and invalidating afterwards.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/userTwitter/:id',function (req,res) {

    var idUser = req.params.id;

var consumerKey = 'wUU6BqoStE9I5B4iOGjpFg4O8',
    consumerSec = '8fgTQdGsBMH9xZkMjTtGtbEGRosIOentceyeACHwL2eSeNPxX9';

var sys = require('sys'),
    client = require('../lib/twitter').createClient();

// OAuth 1a required to fetch bearer token.
client.setAuth ( consumerKey, consumerSec );

client.fetchBearerToken( function( bearer, raw, status ){

    if( ! bearer ){
        console.error('Status '+status+', failed to fetch bearer token');
        //console.error( sys.inspect(raw) );
        return;
    }

    client.setAuth( bearer );
    console.log( 'Have OAuth 2 bearer token: ' + bearer );

    // test a call with the new bearer token - show application rate limits for user methods
    client.get('/friends/list.json?cursor=-1&screen_name='+idUser+'&skip_status=true&include_user_entities=false', { resources: 'users' }, function( data, error, status ){

        if( error ){
            console.error('Status '+status+', failed to fetch application rate limit status');
            //console.error( sys.inspect(error) );
            return;
        }
		

        console.log( data );
        var json = JSON.stringify(data);

        fs.writeFile('./data/TwitterData/'+idUser+".json", json, 'utf8');

        res.json(data);
    
        // back to OAuth 1 to invalidate
        client.setAuth ( consumerKey, consumerSec );
        console.log('Invalidating token ..' );
        client.invalidateBearerToken( bearer, function( nothing, raw, status ){
            if( 200 !== status ){
                console.error('Status '+status+', failed to invalidate bearer token');
                return;
            }
            console.log('Done.');
        } );
    } );
} );
})

module.exports = router;