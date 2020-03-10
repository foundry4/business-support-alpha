const express = require("express");
const router = express.Router();
const request = require("request");
const _ = require("underscore");

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

var countryData = {
  "England":{
    name:"Business Support",
    url: "https://www.businesssupport.gov.uk/"
  },
  "Northern Ireland":{
    name:"Invest Northern Ireland",
    url: "https://www.nibusinessinfo.co.uk/start"
  },
  "Scotland":{
    name:"Business Gateway",
    url: "https://www.bgateway.com/"
  },
  "Wales":{
    name:"Business Wales",
    url: "https://businesswales.gov.wales/starting-up/"
  },
};

// create business object to store profile
// TODO map out profile with properties
var businessProfile = {
  age: 2,
  size: 5,
  postcode: "",
  country: "England",
};

var interest = [
  "leadership development",
  "investment potential",
  "developing funding applications",
  "IT/digital",
  "marketing",
  "sales",
  "human resources",
  "business management",
  "financial management"
]

// VERSION 3 CATEGORIES
var supportTypes = [
  "Exporting",
  "Funding",
  "Productivity",
  "Performance",
  "Mentoring",
  "Hiring",
  "Innovation",
  "Marketing",
  "Online Sales",
  "Late Payments",
  "Manufacturing",
  "Technology",
  "Consultancy",
  "Government frameworks",
  "Agriculture",
  "Brexit",
  "Apprentices",
  "Intellectual property"
]
/* 
  // INDUSTRY SELECT MENU
var industry = [
  'agriculture-and-food',
  'business-and-finance',
  'construction',
  'education',
  'health',
  'hospitality-and-catering',
  'information-technology-digital-and-creative',
  'life-sciences',
  'manufacturing',
  'mining',
  'real-estate-and-property',
  'science-and-technology',
  'service-industries',
  'transport-and-distribution',
  'travel-and-leisure',
  'utilities-providers',
  'wholesale-and-retail'
];
 */
// ONS / Standard Industrial Classification of Economic Activities
// https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/ukbusinessactivitysizeandlocation/2019
// https://en.wikipedia.org/wiki/United_Kingdom_Standard_Industrial_Classification_of_Economic_Activities
var industry = [
  '',
  'accommodation and food',
  'agriculture forestry and fishing',
  'arts entertainment recreation',
  'business administration and support',
  'construction',
  'education',
  'finance and insurance',
  'health',
  'information and communication',
  'manufacturing',
  'mining quarrying and utilities',
  'motor trades',
  'production',
  //'professional scientific and technical',
  'property',
  'public administration and defence',
  'retail',
  'wholesale'
  // 'Wholesale and retail repair; of motor vehicles',
];

// hubLocations information
var hubLocation = {
  LEP: "Emmerdale",
  LA: "Emmerdale",
  ONS: "E06000052",
  url: "https://www.growthhub.london/",
  telephone: "01209 123 456",
  email: "hello@emmerdale.com",
  interest : interest,
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

var stage = ["early", "mature", "fast"];
var stageText = ["Early stage", "Mature", "Fast growing"];
var stageIndex = 0;
var reason = "";


// have archived previous versions of prototype to routesOld.js
// starting with a clean slate...
// urgh: re-name functions to avoid v2 collisions!

//////////////////////////////////////////////////////////////////
//
// Version 3.0 prototype
//
//////////////////////////////////////////////////////////////////
// landing page
router.get("/v3/", function (req, res, next) {
  renderLandingPageV3(req, res, false);
});
router.get("/gov3/", function (req, res, next) {
  renderLandingPageV3(req, res, true);
});
/* 
// pre-start
router.get("/v3/pre-start", function (req, res, next) {
  renderStartV3(req, res, false);
});
router.get("/gov3/pre-start", function (req, res, next) {
  renderStartV3(req, res, true);
});

// small
router.get("/v3/small", function (req, res, next) {
  renderStartV3(req, res, false);
});
router.get("/gov3/small", function (req, res, next) {
  renderStartV3(req, res, true);
});

// target: growth hub
router.get("/v3/growth-hub", function (req, res, next) {
  renderGrowthHubV3(req, res, false);
});
router.get("/gov3/growth-hub", function (req, res, next) {
  renderGrowthHubV3(req, res, true);
});

// growth hub filter
router.get("/v3/results", function (req, res, next) {
  renderResultsV3(req, res, false);
});
router.get("/gov3/results", function (req, res, next) {
  renderResultsV3(req, res, true);
});
 */
// recommendations
router.get("/v3/recommendations", function (req, res, next) { 
  renderRecommendationsV3(req, res, false);
});
router.get("/gov3/recommendations", function (req, res, next) {
  renderRecommendationsV3(req, res, true);
});
/* 
// country
router.get("/v3/country", function (req, res, next) {
  renderCountryV3(req, res, false);
});
router.get("/gov3/country", function (req, res, next) {
  renderCountryV3(req, res, true);
});
 */
// branch
router.get("/v3/branch", function (req, res, next) {
  renderBranchesV3(req, res, false)
});
router.get("/gov3/branch", function (req, res, next) {
  renderBranchesV3(req, res, true)
});


//////////////////////////////////////////////////////////////////
//
// VERSION 3
// Render functions used to re-use templates with different styles
//
//////////////////////////////////////////////////////////////////

renderLandingPageV3 = function (req, res, isGOV){
  res.render("v3.0/landing", {
    isGOVUK: isGOV,
    isLive: isLive,
    industry:industry,
    interest: interest,
    description: selfDescription,
    url:req.url
  });
}
/* 
renderStartV3 = function (req, res, isGOV){
  res.render("v3.0/pre-start", {
    isGOVUK: isGOV,
    isLive: isLive,
    business: businessProfile,
    location: hubLocation,
    country:countryData[businessProfile.country],
    url:req.url
  });
}

renderCountryV3 = function (req, res, isGOV){
  res.render("v3.0/country", {
    isGOVUK: isGOV,
      isLive: isLive,
      business: businessProfile,
      location: hubLocation,
      country:countryData[businessProfile.country],
      url:req.url
    });
}

renderGrowthHubV3 = function (req, res, isGOV){
  res.render("v3.0/growth-hub", {
    isGOVUK: isGOV,
    isLive: isLive,
    business: businessProfile,
    location: hubLocation,
    url:req.url
  });
}
 */

renderRecommendationsV3 = function (req, res, isGOV){
  console.log(businessProfile.stageIndex);
  // set a default stage index to render defult tabs directly
  if(!businessProfile.stageIndex){
    businessProfile.stageIndex=0;
  }
  
  res.render("v3.0/recommendations", {
    isGOVUK: isGOV,
    isLive: isLive,
    location: hubLocation,
    business: businessProfile,
    country:countryData[businessProfile.country],
    reason:reason,
    url:req.url
  });
}

/* 
renderResultsV3 = function (req, res, isGOV){
    var results = res.app.locals.data;
    //get checkbox
    var selfDescription = [];
    
    if (req._parsedUrl.query) {
      params = req._parsedUrl.query.split("&");
      var len = params.length;
      // loop through params and split out type and values
       for (var i = 0; i < len; i++) {
         if(params[i].indexOf("nl_description")>-1){
            var param = params[i].split("=");
            if(param[1]!=="_unchecked"){
              param[1] = param[1].split("+").join(" ");
              param[1] = param[1].split("%2F").join("/");
              selfDescription.push(param[1]);
            }
          }
       }
    }
  
    // do some crude filtering based on aims?
    // eg reset the results arrays for non-applicable results?
    var procurement = _.filter(results, function (item) { return item.category === "Procurement" });
    var support = _.filter(results, function (item) { return item.category === "Business Support" });
    var legal = _.filter(results, function (item) { return item.category === "Legal" });
    var finance = _.filter(results, function (item) { return item.category === "Sources of Finance" });
    var events = _.filter(results, function (item) { return item.category === "Events and Networking" });
    var premises = _.filter(results, function (item) { return item.category === "Premises" });
    
    // get the description
    var responses = [support, legal, finance, events, premises, procurement, support, legal, finance, events, premises];
    var links = [ "business", "legal", "finance", "events", "premises", "procurement", "business", "legal", "finance", "events", "premises"];
    var response = [];
    var title = "";
  
    // loop through the description and populate results
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
    res.render("v3.0/results", {
      isGOVUK: isGOV,
      isLive: isLive,
      results: res.app.locals.data,
      support: support,
      legal: legal,
      finance: finance,
      events: events,
      premises: premises,
      procurement: procurement, 
      location: hubLocation,
      business: businessProfile,
      description:title,
      response:response,
      url:req.url
    });
}
 */
renderBranchesV3 = function (req, res, isGOV){
  console.log('render branch...');
  
  let businessAge = req.session.data["nl_age"];
  let postcode = req.session.data["nl_postcode"];
  let peopleCount = req.session.data["nl_count"];
  let turnover = req.session.data["nl_turnover"];
  let change = req.session.data["business_change"];
  let description = req.session.data["nl_description"];
  let industryIndex = req.session.data["selected_industry"];
  
  /*   
  let interestIndex = req.session.data["interest"];
  console.log("interest", interestIndex);
  var interestList = [];
  //convert array of indices to values?
  if(interestIndex ){
    if(interestIndex.length>1){
      for (var i=0; i<interestIndex.length; i++){
        var itm = interestIndex[i];
        interestList.push(interest[itm]);
      }
      
    }else{
      interestList.push(interest[interestIndex])
    }
  }
  console.log("interest", interestList);
  businessProfile.interest = interestList;
*/
  businessProfile.isReady = false;

  businessAge = parseInt(businessAge);
  // remove spaces, commas
  turnover = turnover.split("£").join("");
  turnover = turnover.split(" ").join("");
  turnover = turnover.split(",").join("");
  turnover = turnover.split(".")[0];


  if (description) {
    if (description.indexOf("Innovative") > -1 || description.indexOf("Competitive") > -1 || description.indexOf("Profit-focused") > -1) {
      businessProfile.isReady = true;
    }
  }

  // SET SOME DEFAULTs
  if (peopleCount === "") {
    peopleCount = 10;
  }
  if (!postcode) {
    businessProfile.postcode = "TR1 1XU";
    businessProfile.country = "England";
  }

// once we"ve captured the form data
// store it for future reference in the templates
if (businessAge) {
  businessProfile.age = businessAge;
  //businessProfile.displayAge = ages[businessAge];
}

businessProfile.size = peopleCount;
businessProfile.postcode = postcode;
businessProfile.description = description;
businessProfile.turnover = parseInt(turnover);
businessProfile.change = change;
businessProfile.industry = industry[industryIndex-1];


if (postcode) {
  var str = postcode;
  var cleaned = str.split("%20").join("");
    cleaned = cleaned.split(" ").join("");

    request(MYSOCIETY_API_URL + cleaned, {
      method: "GET",
      headers: {
        "Accept": "application/json"
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
              //console.log(businessProfile.country);
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
          hubLocation.interest = interest;

          // catch other countries
          if (businessProfile.country !== "England") {
            hubLocation.LA = businessProfile.country;
          }

          //console.log("to branch")
          //console.log(businessProfile)
          redirectToBranchV3(res);

        } else {
          console.log("error")
          res.redirect("/error");

        }
      } else {
        // Repeat the triage process here with a default response to provide a meaningful response
        console.log("API LIMITS EXCEEDED")
        selectedLA = "Emmerdale";
        region = "Emmerdale";
        country = "England";
        // catch other countries
        if (country !== "England") {
          hubLocation.LA = country;
        }
        redirectToBranchV3(res);
        
      }
    }
    );
  } else {
    redirectToBranchV3(res);
  }

}

// the subfolder will be the same as the referring page
// eg gov or v3.0 etc
redirectToBranchV3 = function (res){
  console.log("redirect");

  // stageIndex: 0, 1, 2
  // default  = steady
  stageIndex = 1;
  reason = `you have ${businessProfile.size} staff`;
  
  if (businessProfile.age <= 2) {
    stageIndex = 0;
    reason = "you are a young company";
  } else if (businessProfile.turnover > 200000 && businessProfile.change==='1') {
    reason = "your turnover is greater tham £200k pa and you are growing rapidly";
    stageIndex = 2;
  } 
    
  businessProfile.stageIndex= stageIndex;
  businessProfile.stage= stage[stageIndex];
  businessProfile.stageText= stageText[stageIndex];

  res.redirect("recommendations"); 

}


module.exports = router
