                                        ///////////////////////////////////////////////////////////////////////////////

                        nightmare.goto('https://fr-fr.facebook.com/public/'+name+" "+lastname)
    // visits the city specified by the user and gets all computer gigs posted that day
    .wait(6000)
    
    .evaluate(function(){
            
            item = {}
            item["facebookpicture"] = document.evaluate('//*[@id="BrowseResultsContainer"]/div[1]/div/div/div/a/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.src
            item["facebookurl"] = document.evaluate('//*[@id="BrowseResultsContainer"]/div[1]/div/div/div/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href
            
        // create a gig object with title and link, then push to the 'gigs' array
        return item
        // pass the gigs array forward so it can be looped through later on
    })
    // wait 2 seconds so page is guaranteed to be fully loaded
    
    .end()
    .then(function(result){
        i2b(result.facebookpicture, function(err, base64Image) {
            //var nameimg = Date.now() + 'image.jpg';
                        var regex = /^data:.+\/(.+);base64,(.*)$/;
                        var matches = base64Image.dataUri.match(regex);
                        var data = matches[2];
                        var buffer = new Buffer(data, 'base64');
            console.log(result.facebookpicture)
            var params = {
  CollectionId: "STRING_VALUE", 
  Image: {
    Bytes : buffer
  }
 };
  rekognition.searchFacesByImage(params, function(err, body) {
    if (err) console.log("no face detected in facebook picture"); // an error occurred
    else    {
      console.log(body.FaceMatches.length);
      //let data = JSON.parse(body);  
var jsonPretty = JSON.stringify(body,null,2); 
if(body.FaceMatches.length > 0){
  var Confidence = body.FaceMatches[0].Face.Confidence
  if(Confidence > 0.5){
     User.find({FaceId : body.FaceMatches[0].Face.FaceId }, function(err,user){
          if(err){
            throw err;
          }

let query= {FaceId:body.FaceMatches[0].Face.FaceId}

    User.update(query,{Picture : result.facebookpicture , Facebookaccount : result.facebookurl},function (err,result) {
        if(err){
            res.send(err);
        }
        console.log("houwa"+body.FaceMatches[0].Face.FaceId);
          console.log(user);
res.send("done");
    })
          
        })
  }


    }
    else{
        console.log("profiling faild :/");
      res.send('none')


    }

  }        
 
  });
        



 })
        // print each gig to the console in a neat format
    })