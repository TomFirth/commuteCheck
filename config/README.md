# Setup of configuration

The below config and descriptions will allow you to set this script up in the way that suits you best.

`connect.json` should be set up with the access keys that are requested.

`excludes.json` is a list of words to be excluded from the Google response.

### details.json

```
{
  "duration": 12.3, // the normal time it would take you to travel to work in minutes
  "email": "", // your email address, to be contacted with the Google, Twitter and Waze responses
  "home": {
    "leave": "00:00", // 24hr format time for when you would normally leave work
    "postcode": "", // the postcode of your home address
    "lat": "", // latitude of your home address
    "long": "" // longitude of your home address
  },
  "lang": "", // the primary language of the country you live in (this is used for text searches)
  "radius": "20mi", // the radius of searches to be made from your geographical location
  "twitter": {
    "count": 100, // how many tweets to get back in the response
    "hoursBefore": 3 // search for tweets 3hrs before the time you leave your origin
  },
  "work": {
    "leave": "00:00", // same as above
    "postcode": "",
    "lat": "",
    "long": ""
  }
}
```
