t/**
 * Example of starting OAuth flow by fetch a request token.
 */


var client = require('../lib/twitter').createClient();

client.setAuth ( 
    'wUU6BqoStE9I5B4iOGjpFg4O8',
    '8fgTQdGsBMH9xZkMjTtGtbEGRosIOentceyeACHwL2eSeNPxX9'
);

client.fetchRequestToken( 'oob', function( token, raw, status ){
    if( token ){
        console.log('Request secret: '+token.secret );
        console.log('Authorize at: '+ token.getAuthorizationUrl() );
		GET https://api.twitter.com/1.1/followers/list.json?cursor=-1&screen_name=twitterdev&skip_status=true&include_user_entities=false


    }
    else {
        console.error('Status '+status+', failed to fetch request token');
    }
} );