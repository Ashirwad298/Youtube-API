
# Youtube API
An API to fetch latest videos from youtube sorted in reverse chronological order of their publishing date-time from YouTube for a given tag/search query in a paginated response.



## Setup Guide
* Clone the project 
* As this project is based on Node, your system need to have proper Node setup, refer [this](/https://phoenixnap.com/kb/install-node-js-npm-on-windows)
* Go the project through the terminal and install all dependencies by using typing npm install
* For getting Youtube API key follow [this](/https://blog.hubspot.com/website/how-to-get-youtube-api-key)
* Type node app.js in the terminal to start the server


## Search Page

* Two forms are provided on search page
* user can search videos using the title or description

## API Reference

#### Get all videos as a paginated response

```http
  GET /videos
```



#### Search by title

```http
  GET /video?title=[string]
```



#### Search by description

```http
  GET /video?description=[string] 

