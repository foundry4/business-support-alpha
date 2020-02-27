const express = require('express');
const router = express.Router();
const request = require('request');
const _ = require('underscore');

const MYSOCIETY_API_URL = "https://mapit.mysociety.org/postcode/";
const isLive = process.env.isLive;

// landing page vars
var ages = [
  null,
  "not started trading",
  "been trading for under a year",
  "been trading for 1-2 years",
  "been trading for 2-5 years",
  "been trading for over 5 years"
];

var selfDescription = [
  "Efficient",
  "Innovative",
  "Traditional",
  "Competitive",
  "Stable",
  "Profit-focused",
  "Part of the community",
  "Powered by people",
  "Powered by technology"
];

// create business object to store profile
// TODO map out profile with properties
var businessProfile = {
  age: ages[2],
  size: 5,
  postcode: "",
  country: "Scotland",
};

// hubLocations information
var hubLocation = {
  LEP: 'Camberwick Green',
  LA: 'Camberwick Green',
  ONS: 'E06000052',
  url: 'www.ciosgrowthhub.com',
  telephone: '01209 708660',
  email: 'hello@ciosgrowthhub.com',
  interest : [
      "leadership development",
      "investment potential",
      "developing funding applications",
      "IT/digital",
      "marketing",
      "sales",
      "human resources",
      "business management",
      "financial management"
    ],
  blurb: `Examples of eligible businesses include: 
  <br/>
  retail,
  <br/> hospitality & tourism (B&Bs, hotels, cafes, restaurants, etc),
  <br/> health & beauty (hairdressers, beauticians, aesthetics, personal trainers, gyms, etc) 
  <br/> and agriculture (farming, forestry and fisheries).
  <br/>
  <br/>
  This isn’t an exhaustive list. 
  If you’re not sure if your business is eligible, 
  please contact us FREE* on 0844 257 84 50. 
  If it’s not we’ll link you into other support where it’s available.`
};

// have archived previous versions of prototype to routesOld.js
// starting with a clean slate...


//////////////////////////////////////////////////////////////////
//
// Version 2.1.1 prototype
//
//////////////////////////////////////////////////////////////////

// index
router.get('/', function (req, res, next) {
  res.render('index', {});
});


// landing page
router.get('/v2.1.1/', function (req, res, next) {
  res.render('v2.1.1/landing', {
    isLive: isLive,
    description: selfDescription
  });
});


// pre-start
router.get('/v2.1.1/pre-start', function (req, res, next) {
  //hubLocation.LA =country;
  res.render('v2.1.1/pre-start', {
    isLive: isLive,
    business: businessProfile,
    location: hubLocation
  });
});


// target: growth hub
router.get('/v2.1.1/growth-hub', function (req, res, next) {
  res.render('v2.1.1/growth-hub', {
    isLive: isLive,
    business: businessProfile,
    location: hubLocation
  });
});


// growth hub filter
router.get('/v2.1.1/results', function (req, res, next) {
  var results = res.app.locals.data;
  // do some crude filtering based on aims?
  // eg reset the results arrays for non-applicable results?
  var procurement = _.filter(results, function (item) { return item.category === "Procurement" });
  var support = _.filter(results, function (item) { return item.category === "Business Support" });
  var legal = _.filter(results, function (item) { return item.category === "Legal" });
  var finance = _.filter(results, function (item) { return item.category === "Sources of Finance" });
  var events = _.filter(results, function (item) { return item.category === "Events and Networking" });
  var premises = _.filter(results, function (item) { return item.category === "Premises" });
  
  // get the description
  var selfDescription =  req.session.data["nl_description"] ;
  var responses = [support, legal, finance, events, premises, procurement, support, legal, finance, events, premises];
  var links = [ "business", "legal", "finance", "events", "premises", "procurement", "business", "legal", "finance", "events", "premises"];
  var response = [];
  var title = "";
  console.log(selfDescription);
  // loop through the description nad populate results
  if(selfDescription.length>0){
    title = selfDescription[0];
    for ( var i=0; i<selfDescription.length; i++){
      response.push({name: selfDescription[i], result:responses[i], link: links[i]})
      if(i>0){
        if(i===selfDescription.length-1){
          title += " and " + selfDescription[i];
        }else{
          title += ", " + selfDescription[i];
        }
      }
    }
  }else{
    title = "No specific topic"
  }

  
  

  // then pass these to the pages to render
  res.render('v2.1.1/results', {
    isLive: isLive,
    results: res.app.locals.data,
    support: support,
    legal: legal,
    finance: finance,
    events: events,
    premises: premises,
    procurement: procurement, 
    response:response,
    location: hubLocation,
    business: businessProfile,
    description:title
  });
});


// recommendations
router.get('/v2.1.1/recommendations', function (req, res, next) {
  var results = res.app.locals.data;
  // do some crude filtering based on aims?
  // eg reset the results arrays for non-applicable results?
  var procurement = _.filter(results, function (item) { return item.category === "Procurement" });
  var support = _.filter(results, function (item) { return item.category === "Business Support" });
  var legal = _.filter(results, function (item) { return item.category === "Legal" });
  var finance = _.filter(results, function (item) { return item.category === "Sources of Finance" });
  var events = _.filter(results, function (item) { return item.category === "Events and Networking" });
  var premises = _.filter(results, function (item) { return item.category === "Premises" });

  // then pass these to the pages to render
  res.render('v2.1.1/recommendations', {
    isLive: isLive,
    results: res.app.locals.data,
    support: support,
    legal: legal,
    finance: finance,
    events: events,
    premises: premises,
    procurement: procurement,
    location: hubLocation,
    business: businessProfile
  });
});


// country
router.get('/v2.1.1/country', function (req, res, next) {
  res.render('v2.1.1/country', {
    isLive: isLive,
    business: businessProfile,
    location: hubLocation
  });
});


// other? finance?

// branch
router.get('/v2.1.1/branch', function (req, res, next) {
  console.log('branch');
  
  let businessAge = req.session.data['nl_age'];
  let postcode = req.session.data['nl_postcode'];
  let peopleCount = req.session.data['nl_count'];
  let turnover = req.session.data['nl_turnover'];
  let turnoverChange = req.session.data['nl_turnover_change'];
  let description = req.session.data['nl_description'];
  businessProfile.isReady = false;

  if (description) {
    if (description.indexOf("Innovative") > -1 || description.indexOf("Competitive") > -1 || description.indexOf("Profit-focused") > -1) {
      businessProfile.isReady = true;
    }
  }
console.log('part1');

// SET SOME DEFAULTs
if (peopleCount === "") {
  peopleCount = 10;
}
if (!postcode) {
  businessProfile.postcode = "TR1 1XU";
  businessProfile.country = "England";
}

// once we've captured the form data
// store it for future reference in the templates
if (businessAge) {
  businessProfile.age = ages[businessAge];
}
businessProfile.size = peopleCount;
businessProfile.postcode = postcode;
//businessProfile.peopleCount = peopleCount;
businessProfile.description = description;
businessProfile.turnover = turnover;
businessProfile.turnoverChange = turnoverChange;

if (postcode) {
  console.log('postcode');
  var str = postcode;
  var cleaned = str.split('%20').join('');
    cleaned = cleaned.split(' ').join('');

    request(MYSOCIETY_API_URL + cleaned, {
      method: "GET",
      headers: {
        'Accept': 'application/json'
      }
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (body) {
          dataset = JSON.parse(body);

          // get the json dataset
          var areas = dataset.areas;
          var selectedLA;
          var region = "your area";

          // loop through all the areas and look for codes that match the ""
          for (var area in areas) {
            if (areas[area].codes && areas[area].codes["local-authority-eng"]) {
              // step back up to the parent and extract the actual _gss_ values/
              selectedLA = areas[area].codes.gss;
            }
            // get the region
            if (areas[area].type_name === "European region") {
              region = areas[area].name;
            }
            //also get the country code for use on the pre-start hand off?
            if (areas[area].country_name !== "-") {
              businessProfile.country = areas[area].country_name
            }
          }

          if (selectedLA) {
            // use this value to look up the name of the LEP
            var lepDictionary = res.app.locals.dictionary;
            hubLocation = lepDictionary[selectedLA];
            var hub = res.app.locals.hubs[hubLocation.LEP]

            if (hubLocation && hub) {
              // do the same for LEP contacts
              hubLocation.url = hub.url;

              hubLocation.telephone = hub.telephone;
              if (hub.email !== "") {
                hubLocation.email = hub.email;
              } else {
                hubLocation.email = "adviser@" + hub.url;
              }

            }
          }
          hubLocation.region = region;

          // catch other countries
          if (businessProfile.country !== "England") {
            hubLocation.LA = businessProfile.country;
          }

          console.log("to brranch")
          redirectToBranch(res);

        } else {
          console.log("error")
          res.redirect('/error');

        }
      } else {
        // res.render('error', { content : {error: {message: "There has been an issue with the postcode look-up"}}});

        // Repeat the triage process here with a default response to provide a meaningful response
        console.log("API LIMITS EXCEEDED")
        selectedLA = "Camberwick Green";
        region = "Camberwick Green";
        country = "England";
        // catch other countries
        if (country !== "England") {
          hubLocation.LA = country;
        }

        redirectToBranch(res);
        
      }
    }
    );
  } else {
    console.log('no code');
    redirectToBranch(res);

  }

});


global.redirectToBranch = function (res){
  console.log('toberanch....');
  
  if (businessProfile.age < 3) {
    res.redirect('pre-start');                // getting starters & companies under 1 year old
  } else if (businessProfile.country !== "England") {
    res.redirect('country');                  // getting other countries
  } else if (businessProfile.size <= 4) {
    res.redirect('small');                    // small/micro companies
  } else if (businessProfile.turnover > 1 && businessProfile.turnoverChange > 2 && businessProfile.isReady) {   // form vars are strings so could parseInt or turnoverChange==='3'                                 
    res.redirect('growth-hub');               // READY TO SCALE: target audience 
  } else {
    res.redirect('recommendations');          // LOW_PRODUCTIVE: getting neither (!)
  }
}


module.exports = router
