var express = require("express");
var app = express();
var alert = require("alert");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
const request = require("request");
var serviceAccount = require("./serviceAccountKey.json");
const token = "5728820105:AAGQOjzWbHIpRDCxiBXi6xXucF0ChCKJ6VA";

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
  credential: cert(serviceAccount),
});
const path = require("path");
const { futimes } = require("fs");
const port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, "public")));
const db = getFirestore();
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});
app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.get("/dashboard", function (req, res) {
  res.sendFile(__dirname + "/dashboard.html");
});
app.get("/error", function (req, res) {
  res.sendFile(__dirname + "/error.html");
});
app.get("/sorry", function (req, res) {
  res.sendFile(__dirname + "/sorry.html");
});
app.get("/intro", function (req, res) {
  res.sendFile(__dirname + "/intro.html");
});
app.get("/signup1info", function (req, res) {
  db.collection("capstone_project")
    .add({
      firstname: req.query.firstname,
      lastname: req.query.lastname,
      email: req.query.email,
      password: req.query.password,
      date: req.query.date,
    })
    .then(() => {
      res.sendFile(__dirname + "/login.html");
    });
});

app.get("/login1info", function (req, res) {
  var user = req.query.username;
  var pass = req.query.password1;
  db.collection("capstone_project")
    .get()
    .then(function (docs) {
      var flag = 0;
      docs.forEach((doc) => {
        if (user == doc.data().email && pass == doc.data().password) {
          flag = 1;
        }
      });
      if (flag == 1) {
        res.sendFile(__dirname + "/dashboard.html");
      } else {
        //alert("Incorrect credentials details...");
        res.sendFile(__dirname + "/error.html");
      }
    });
});

app.get("/dashboardinfo", function (req, res) {
  //console.log("hello");
  const word = req.query.word;
  request(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word,
    function (error, response, body) {
      if (JSON.parse(body).title != null) {
        //res.send("sorry...no word found!!!");
        res.sendFile(__dirname + "/sorry.html");
      } else {
        res.write(
          '<body style="background-image: url(meaning_background5.png);margin-top:250px;" >'
        );
        res.write("<center>");
        res.write(
          "<h1 style = ' color : #154360 '>" +
            JSON.parse(body)[0].word +
            "</h1>"
        );
        res.write(
          "<h2 style = 'color:#A04000'> PHONETIC-" +
            JSON.parse(body)[0].phonetic +
            "</h2>"
        );
        res.write(
          "<h2 style = 'color:#A04000'> PARTS OF SPEECH - " +
            JSON.parse(body)[0].meanings[0].partOfSpeech +
            "</h2>"
        );
        res.write(
          "<h2 style ='margin-left:80px;margin-right:80px;color:#186A3B'> DEFINITION - " +
            JSON.parse(body)[0].meanings[0].definitions[0].definition +
            "</h2>"
        );
        res.write("</center>");
        res.write("</body>");
      }
    }
  );
});

app.get("/error1", function (req, res) {
  res.redirect("/login");
});
app.get("/intro1", function (req, res) {
  res.redirect("/login");
});

app.listen(3000);