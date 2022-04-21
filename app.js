const express = require("express");
const bodyParser = require("body-parser");
const video = require("./models/video");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config();

const lod = require("lodash");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.API_KEY,
});

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(express.json());

// Configuring the database
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
const { setTimeout, setInterval } = require("timers/promises");
const { DESTRUCTION } = require("dns");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

var lastRequestTime = new Date().toISOString().slice(0, 19) + "Z";

async function callYoutubeAPI() {
  // console.log(lastRequestTime,"IMPORTANT");
  console.log("I am being called");
  console.log(lastRequestTime);
  try {
    const response = await youtube.search.list({
      part: "snippet",
      q: "news",
      order: "date",
      maxResults: 10,
      publishedBefore: lastRequestTime,
    });
    const arr = response.data.items;
    const arrLen = arr.length;
    const lastVideo = arr[arrLen - 1];

    lastRequestTime = lastVideo.snippet.publishedAt;
    console.log(lastRequestTime);
    // console.log(lastRequestTime,"second");
    arr.forEach(async function (VDO) {
      console.log("Added");
      const vdo = new video({
        title: VDO.snippet.title,
        video_id: VDO.id.videoID,
        description: VDO.snippet.description,
        channel_id: VDO.snippet.channelId,
        channel_title: VDO.snippet.channelTitle,
        thumbnailURL: VDO.snippet.thumbnails.default.url,
        publishedDateTime: new Date(VDO.snippet.publishTime),
      });
      console.log(vdo);
      await vdo.save();
    });
  } catch (err) {
    console.log(err);
  }
}

setInterval(callYoutubeAPI, 1500);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// define a simple route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// show all videos
app.get("/videos", function (req, res) {
  res.redirect("/videos/0");
});
app.get("/videos/:page", async function (req, res) {
  let numTotal = await video.countDocuments();
  numTotal = Math.ceil(numTotal / 5) - 1;
  let to_skip = req.params.page * 5;
  const allVideos = await video.find({}).limit(5).skip(to_skip);
  res.render("index.ejs", { allVideos, numTotal });
});

// Search Video

app.get("/search", function (req, res) {
  res.render("search.ejs");
});

app.get("/video", async function (req, res) {
  const title = req.query?.title;
  const description = req.query?.description;
  // const result1 = await video.findOne({ title });
  let result;
  if (title) {
    result = await video.findOne({
      title: { $regex: title, $options: "i" },
    });
  } else if (description) {
    result = await video.findOne({
      description: { $regex: description, $options: "i" },
    });
  } else res.send("enter either title or description");
  console.log(result);

  res.send(result);
});

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
