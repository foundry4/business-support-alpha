const express = require('express');
const router = express.Router();
const request = require('request');
const _ = require('underscore');

const MYSOCIETY_API_URL = "https://mapit.mysociety.org/postcode/";
var sampleResults = [
  { 
    title:"AD:VENTURE - Leeds City Region",
    description:"Provides free business development support and guidance."
  },
  { 
    title:"Agri-tech Cornwall - Cornwall and the Isles of Scilly",
    description:"Grants and support to increase research, development and innovation in agritech."
  },
  { 
    title:"ART Business Loans - West Midlands",
    description:"Loans for new and existing small businesses to create and safeguard jobs in the West Midlands"
  },
  { 
    title:"Arts University Bournemouth Innovation Vouchers",
    description:"Vouchers to access external expertise, facilities and equipment to help your business innovate and grow."
  },
  { 
    title:"BCRS Business Loans",
    description:"Loans to help small and medium-sized businesses develop and grow."
  },
  { 
    title:"Be inspired at Staffordshire University",
    description:"Offers free support and guidance for graduates of any university in England, Scotland, Wales and Northern Ireland to start a business in Staffordshire."
  },
  { 
    title:"Better Business Finance - UK",
    description:"Free, quick and easy access to a directory of approved finance suppliers for UK businesses."
  },
  { 
    title:"Big Issue Invest - UK",
    description:"Big Issue Invest helps social enterprises and charities by providing loans and investments."
  },
  { 
    title:"Business advice and masterclasses - East of England",
    description:"Advice, workshops, loans and innovation grant services for start-up and trading businesses in Cambridgeshire, Essex, Norfolk and Suffolk"
  },  
  { 
    title:"Business Cash Advance - UK",
    description:"Alternative financing for UK small business owners."
  },  
  { 
    title:"Business Development Grant Scheme – Scarborough",
    description:"Grants to help new start-up and established SMEs looking to grow or relocate to the Borough of Scarborough."
  }
  
  ];

  var country="-";
  
var postcodeLocation = { 
  LEP: 'Cornwall and the Isles of Scilly',
  LA: 'Cornwall',
  ONS: 'E06000052',
  url: 'www.ciosgrowthhub.com',
  telephone: '01209 708660',
  email: 'hello@ciosgrowthhub.com'
};
 
var aimList = [
  null, 
  "growing the business",
  "buying new equipment",
  "getting new premises",
  "hiring new staff",
  "research and innovation",
  "marketing products and services",
  "improving cash flow"
]; 
var typeList = [
  null, 
  "getting started",
  "a sole trader",
  "a business owner",
  "a business manager",
  "a partner"
];

router.get('/', function(req, res, next) {
  res.render('index', {  });
});


router.get('/error', function(req, res, next) {
  res.render('error', { content : {error: {message: "Internal server error"}}});
});


router.get('/business-stage', function(req, res, next) {
  res.render('business-stage', 
  {  });
});


// for the summary page set specific strings
var displayNames = {
  types_of_support:[],
  business_stages:"",
  industries:[],
  business_sizes:"",
  //regions:"Cornwall", //to sort
  region_name:"Cornwall",
  region :  "Cornwall",
  region_url : "https://www.cioslep.com/",
  website: "https://www.ciosgrowthhub.com/",
  telephone: "01209 708660",
  email: "hello@ciosgrowthhub.com",
  aim:"",
};

router.get('/summary', function(req, res, next) {
  var facets = {};
  var params = "";


/* 
  to research and create a product; 
  to buy technology or equipment; 
  to help with cash flow; 
  to increase production; 
  to set up a new premises; 
  to employ more people; 
  to market our products or services
 */
  var legalStructure = [
    null,
    "Not yet trading",
    "Sole Trader",
    "Private Limited Company (LTD)",
    "Public Limited Company (PLC)",
    "Limited Liability Partnership (LLP)",
    "Guarantee Company (Non Profit)",
    "Limited Partnership" 
  ];

    
  var aim = req.session.data['aim'];
  //console.log('summary');
  //console.log(aim);
  //console.log(aims[aim]);
  if(aim){
    /* if (i===0){
      params = "";
      //params = "?";
    }else{
      params += "&"; 
    } */
    // params += "types_of_support%5B%5D=" + typeArray[i];
    displayNames.aim = aimList[aim];
  }
    
  //////////////////////////////

/* 
  var businessType = req.session.data['businessType'];
  console.log(businessType);
  console.log(legalStructure[businessType]);
  if(businessType){
      displayNames.region = "London";
      displayNames.region_url = "lep.london/";
  }
    
  var postcode = req.session.data['postcode'];
  console.log(postcode);

  if(postcode){
    var cleaned = postcode.split('%20').join('');
    cleaned = cleaned.split(' ').join('');
    console.log("GOT CODE " + cleaned)
    displayNames.region =;
  }


 */

  //////////////////////////////
  var postcode = req.session.data['postcode'];
  //console.log(postcode);
 
  if(postcode){
    var cleaned = postcode.split('%20').join('');
    cleaned = cleaned.split(' ').join('');
    cleaned = cleaned.toUpperCase();
    //console.log("GOT CODE " + cleaned)
    //dummy data
    displayNames.region =  `Cornwall (${cleaned})`;
    displayNames.region_name =  `Cornwall`;
    displayNames.region_url = "https://www.cioslep.com/";
  }
    
  var businessType = req.session.data['businessType'];
  //console.log(businessType);
  //console.log(legalStructure[businessType]);
  if(businessType){
      displayNames.businessType = legalStructure[businessType];
  }
  

/* 
  // TYPE OF SUPPORT CHECKBOXES
  var types = [
    null,
    "finance",
    "equity",
    "grant",
    "loan",
    "expertise-and-advice",
    "recognition-award",
  ];

  var typeOfSupport = req.session.data['typeOfSupport'];
  var typeArray = []
  if(typeOfSupport){
    for (var i=0;i<typeOfSupport.length;i++){

      if(typeOfSupport[i]==="7"){
        params ="";
        break;
      }else{
        
        typeArray[i] = types[typeOfSupport[i]];
        if (i===0){
          params = "";
          //params = "?";
        }else{
          params += "&"; 
        }
        params += "types_of_support%5B%5D=" + typeArray[i];
        displayNames.types_of_support.push(typeArray[i].toLowerCase().split("-").join(" "));
      }
    }
  }
 */


  // SIZE RADIO BUTTONS
  var sizes = [null, 'under-10', 'between-10-and-249', 'between-250-and-500','over-500'];
  var businessSize = req.session.data['businessSize'];
  if(businessSize){
    if (params.length===0){
      params = "";
      //params = "?";
    }else{
      params += "&"; 
    }
    params += "business_sizes%5B%5D=" + sizes[businessSize];
    displayNames.business_sizes = sizes[businessSize].toLowerCase().split("-").join(" ");
  }

  // STAGE RADIO BUTTONS
  // kept the stage names here as they are used in the redirect filter
  var stages = [null, 'not-yet-trading', 'start-up', 'established'];
  var stages_display = [null, 'pre-start', 'start-up', 'established'];
  var businessStage = req.session.data['businessStage'];
  if(businessStage){
     if (params.length===0){
      params = "";
      //params = "?";
    }else{
      params += "&"; 
    }
    params += "business_stages%5B%5D=" + stages[businessStage];
    displayNames.business_stages = stages_display[businessStage];
  }

  // INDUSTRY SELECT MENU
  var industries = [
    null,
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

  var industryType = req.session.data['industryType'];
  var industryArray = [];
  var industryStr = "";
  if(industryType){
    if(industryType==="0"){
      // do nothing
    }else{
      industryStr = industries[ industryType ];
      if (params.length===0){
        params = "";
      //params = "?";
      }else{
        params += "&"; 
      }
      params += "industries%5B%5D=" + industryStr;
      displayNames.industries.push(industryStr.toLowerCase().split("-").join(" "));
    }
  }

  // REGION RADIO BUTTONS
  var region = req.session.data['region']
  if(region){
    region = region;
  }
  if(region){
      if (params.length===0){
      params = "";
      //params = "?";
    }else{
      params += "&"; 
    }
    params += "regions%5B%5D=" + region.toLowerCase().split(" ").join("-");
    displayNames.regions.push(region);
  }
  
  if (params.length>0){
    facets = getFacets(params);
  }

    // then pass these to the pages to render checks and facets/chips
    res.render('summary', {
      facets:facets,
      display:displayNames,
      copy:"copy<br/>goes<br/>here...",
      params:params
    });
   

  });

  
router.get('/results', function(req, res, next) {
  var params = req.session.data['params']
  var url  = "https://www.gov.uk/business-finance-support?"+ params;
  console.log("redirect to " + url);
  // redirect to GOV.UK fund finder with filters
  res.redirect(302, url);
});

global.getFacets = function (arr){
  var params = arr.split("&");

  var facets = {
    types_of_support:{title:"Of Type", listOfItems:[]},
    business_stages:{title:"For Businesses Which Are", listOfItems:[]},
    industries:{title:"For Businesses In", listOfItems:[]},
    business_sizes:{title:"For Businesses With", listOfItems:[]},
    regions:{title:"For Businesses In", listOfItems:[]},
  };

  var len = params.length;
  // loop through params and split out type and values
  // will id check boxes by id eg 'id="types_of_support-finance"'
  for (var i=0;i<len;i++){
    var str = params[i];
    // catch str and url encodes 
    str = str.split("%5B%5D=").join("-");
    str = str.split("[]=").join("-");

    // build separate objects to loop through for the faceted chips
    var filters = str.split("-");
    var group = filters[0];
    // remove group name
    filters.shift();
    // recombine
    filters = filters.join("-");
    facets[group].listOfItems.push(filters);
  }

  return facets
}


router.get('/factsheet', function(req, res, next) {
  console.log("factsheet")
  console.log("nl_aim "+ req.session.data['nl_aim']);
  var businessStage = req.session.data['businessStage'];
  var results = res.app.locals.data;
  var aim = req.session.data['nl_aim'];
  // some sort of filtering based on the company type
  // var stages = [null, 'not-yet-trading', 'start-up', 'established'];
  var stages = [
    null,
    "pre-start",
    "start-up",
    "established"
  ];
  var stageFilter = "";

   
  // filter results 
  if(businessStage){
    stageFilter = stages[businessStage];
  }else{
    stageFilter = stages[1];
  }
  console.log("filter for " + stageFilter);
  results = _.filter(results, function(item){ 
    if (item.who){

      for (var i=0; i<item.who.length; i++){
        if (item.who[i]===stageFilter){
          return item
        }
      }
    }
  });

  //console.log(results)
 
  //AIM filters?
  displayNames.aim = aimList[aim];

  // do some crude filtering based on aims?
  // eg reset the results arrays for non-applicable results?

  var procurement = _.filter(results, function(item){ return item.category === "Procurement" });
  var support     = _.filter(results, function(item){ return item.category === "Business Support" });
  var legal       = _.filter(results, function(item){ return item.category === "Legal" });
  var finance     = _.filter(results, function(item){ return item.category === "Sources of Finance" });
  var events      = _.filter(results, function(item){ return item.category === "Events and Networking" });
  var premises    = _.filter(results, function(item){ return item.category === "Premises" });

  var totalSupport = 0;
/*   
  if(support.length>5){
    totalSupport = support.length;
    support = support.slice(0, 5);
    console.warn("ONLY 5 RESULTS HARD CODED")
  }
 */
  // then pass these to the pages to render
  res.render('factsheet', {
    results: res.app.locals.data,
    support: support,
    legal: legal,
    finance: finance,
    events: events,
    premises: premises,
    procurement: procurement,
    totalSupport: totalSupport,
    display: displayNames,
    location:postcodeLocation
  });

});



// custom filtered result page
router.get('/test', function(req, res, next) {
 
  // render a local version of the results
  var len;
  var facets;

  if(req._parsedUrl.query){
    params = req._parsedUrl.query.split("&");
    len = params.length;
    facets = getFacets(params);
  }

  var checks = {};

  // loop through params and split out type and values
  // will id check boxes by id eg 'id="types_of_support-finance"'
  for (var i=0;i<len;i++){
    var str = params[i];
    // catch str and url encodes 
    str = str.split("%5B%5D=").join("-");
    str = str.split("[]=").join("-");
     // populate a checks var to pre-tick checkboxes
    checks[str] = true;
  }

  // then pass these to the pages to render checks and facets/chips
  res.render('results', {
    results: sampleResults,
    checks: checks,
    facets:facets
  });
 
});


router.get('/postcode', function(req, res, next) {
  //console.log(req.query)
  //console.log(req.query.postcode)

  /*   
  if(req._parsedUrl.query){
    params = req._parsedUrl.query.split("&");
    len = params.length;
    facets = getFacets(params);
  }
  */

  if(req.query.postcode){
    var str = req.query.postcode;
    var cleaned = str.split('%20').join('');
    cleaned = cleaned.split(' ').join('');
    //console.log("GOT CODE " + cleaned)

    //https://mapit.mysociety.org/postcode/SW1A1AA

    request(MYSOCIETY_API_URL + cleaned, {
      method: "GET",
      headers: {
          //'Authorization': process.env.EPC_API_KEY,
          'Accept': 'application/json'
        }
      }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            if(body) {
              dataset = JSON.parse(body);
              //console.log(dataset);

              res.send(dataset);

              // get the json dataset

              // loop through all the areas and look for codes that match the ""

              // step back up to the parent and extarct the actual _gss_ values/
            
              // use this value to look up the name of the LEP

            } else {

            }
          } else {
            res.redirect('/error');
          }
      });
 
  }else{
    res.send('no data');
  }

});

var description = [
  "Innovative",
  "Competitive",
  "Profit-focused",
  "Powered by technology",
  "Efficient",
  "Stable",
  "Traditional",
  "Powered by people",
  "Part of the community"
];
router.get('/nl', function(req, res, next) {
  res.render('nl', {
    description: description
  });
});

router.get('/nl-growth-hub', function(req, res, next) {
  //res.send( req.session.data );
  //displayNames.region_name="Cornwall"; 
  //console.log(bus_aim, bus_type)
  res.render('nl-growth-hub', {
    display: displayNames,
    //aim:bus_aim,
    //type:bus_type,
    location:postcodeLocation
  });
});

router.get('/nl-recommendations', function(req, res, next) {
  //res.send( req.session.data );
  //displayNames.region_name="Cornwall";
  var results = res.app.locals.data;
  // do some crude filtering based on aims?
  // eg reset the results arrays for non-applicable results?
  var procurement = _.filter(results, function(item){ return item.category === "Procurement" });
  var support     = _.filter(results, function(item){ return item.category === "Business Support" });
  var legal       = _.filter(results, function(item){ return item.category === "Legal" });
  var finance     = _.filter(results, function(item){ return item.category === "Sources of Finance" });
  var events      = _.filter(results, function(item){ return item.category === "Events and Networking" });
  var premises    = _.filter(results, function(item){ return item.category === "Premises" });

  //var totalSupport = 0;

  // then pass these to the pages to render
  res.render('nl-recommendations', {
    results: res.app.locals.data,
    support: support,
    legal: legal,
    finance: finance,
    events: events,
    premises: premises,
    procurement: procurement,
    //totalSupport: totalSupport,
    //display: displayNames,
    location:postcodeLocation
  });

});

var ages = [
  null,
"not started trading",
"been trading for under a year",
"been trading for 1-2 years",
"been trading for 2-5 years",
"been trading for over 5 years"

];

router.get('/nl-pre-start', function(req, res, next) {
  let bus_age = req.session.data['nl_age'];
  let bus_size = req.session.data['nl_count'];
  //console.log("pre-start " + postcodeLocation)
  displayNames.age = ages[bus_age];
  displayNames.size = bus_size;
  //displayNames.region_name="Cornwall"; 
  res.render('nl-pre-start', {
    display: displayNames,
    country:country,
    location:postcodeLocation
  });
});

router.get('/confirmation', function(req, res, next) {
  res.render('confirmation', {
    location:postcodeLocation
  });
});


// 
router.get('/nl-branch', function(req, res, next) {
  let bus_age = req.session.data['nl_age'];
  let postcode = req.session.data['nl_postcode'];
  let peopleCount = req.session.data['nl_count'];
  let turnover = req.session.data['nl_turnover'];
  let turnoverChange = req.session.data['nl_turnover_change'];
  let description = req.session.data['nl_description'];
  var isReady = false;
  
  if(description){
    if(description.indexOf("Innovative")>-1 || description.indexOf("Competitive")>-1 || description.indexOf("Profit-focused")>-1){
      isReady = true;
    }
  }

  console.log(req.session.data)
  console.log(description)


  // TEST
  //postcode = "TR1 1XU";

  if(postcode){
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
            if(body) {
              dataset = JSON.parse(body);

              // get the json dataset
              var areas = dataset.areas;
              var selectedLA;

              // loop through all the areas and look for codes that match the ""
              for ( var area in areas){
                if(areas[area].codes && areas[area].codes["local-authority-eng"]){
                  // step back up to the parent and extract the actual _gss_ values/
                  selectedLA = areas[area].codes.gss;
                }
                //also get the country code for use on the pre-start hand off?
                if(areas[area].country_name!=="-"){
                  country = areas[area].country_name
                }
              }

              console.log("Got selectedLA:" + selectedLA)
              console.log("Got country:" + country)
            
              if(selectedLA){
                // use this value to look up the name of the LEP
                var lepDictionary= res.app.locals.dictionary;
                postcodeLocation = lepDictionary[selectedLA];
                //console.log(postcodeLocation.LEP)
                var hub =  res.app.locals.hubs[postcodeLocation.LEP]
                
                //do the same for LEP contacts
                postcodeLocation.url = hub.url;
                postcodeLocation.telephone = hub.telephone;
                if(hub.email!==""){
                  postcodeLocation.email = hub.email;
                }else{
                  postcodeLocation.email = "advisor@"+hub.url;
                }
                //console.log(postcodeLocation)
              }

              // TRIAGE
                if ( bus_age < 3 ) {
                  res.redirect('nl-pre-start');               // getting starters & companies under 1 year old
                } else if (peopleCount <=5 ) {
                  res.redirect('nl-pre-start');               // getting starters & companies under 1 year old
                  //res.redirect('nl-one');                     // 'one man band' 
                } else if( turnover>1 && turnoverChange>2 && isReady){   // form vars are strings so could parseInt or turnoverChange==='3'                                 
                  res.redirect('nl-growth-hub');              // READY TO SCALE: target audience 
                } else {                                     
                  res.redirect('nl-recommendations');         // LOW_PRODUCTIVE: getting neither (!)
                }
 
            } else {
              res.redirect('/error');

            }
          } else {
            res.redirect('/error');

          }
      }
    );
  }else{
/* 
    if ( bus_age < 3 ) {
      res.redirect('nl-pre-start');               // getting starters & companies under 1 year old
    } else if (peopleCount <=5 ) {
      res.redirect('nl-pre-start');               // getting starters & companies under 1 year old
      //res.redirect('nl-one');                     // 'one man band' 
    } else if( turnover>1 && turnoverChange>2 && isReady){   // form vars are strings so could parseInt or turnoverChange==='3'                                 
      res.redirect('nl-growth-hub');              // READY TO SCALE: target audience 
    } else {                                     
      res.redirect('nl-recommendations');         // LOW_PRODUCTIVE: getting neither (!)
    }
     */
  }
  
});



module.exports = router
