# Knowledge Bank Scraper
Scrapes local fact sheets from Business Support Helpline knowledge bank

## installation
```
npm install
```

## usage
Download the HTML page of a local fact sheet, e.g. by using DOM inspector and copying the contents of the `<html>` tag into a `.html` file (it appears to be modified by JavaScript so this seems to be the safest way).

```
cat manchester.html | node main.js > manchester.json
```

Alternatively you could scrape the contents directly using curl/httpie and pipe it into the script, but you'd have to pass the ASP.NET cookies.
