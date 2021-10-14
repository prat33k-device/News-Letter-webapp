//jshint esverison: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");

//API data
const list_id = "12cc7b93fe";
const apiKey = "af3a3d69bfddcce94045ddaab7c2ab3e-us5";


// new instance of express
const app = express();

// specifices static folder for server
// Now, you can load the files that are in the public directory:
app.use(express.static("public")); 

// use bodyParser in our server
app.use(bodyParser.urlencoded({extended: true}));



// when get request is made to our home root
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
});

// to handle any post requests that come to our home route
app.post("/", function(req, res) {

    // tap into data that our user is sending us to home route
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    // console.log(firstname, lastname, email);

    // this is the JSON data format that we need to send to our API (refer API reference of mailchimp) 
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };

    // this is what we send to mailchimp
    const jsonData = JSON.stringify(data);

    const url = "https://us" + apiKey[apiKey.length-1] + ".api.mailchimp.com/3.0/lists/" + list_id;
    const options = {
        method: "POST",
        auth: "Prat33k:" + apiKey          // username:apikey as a password
    };
    
    // make request to mailchimp and save it in request const variable
    // we can use this constant request later on to end our data to mailchimp using request.write()
    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            //listen for any data send back form mailchimp server and call then call the callback function
            // console.log(JSON.parse(data));
        });

    });


    request.write(jsonData);    // SEND LOGIN DATA to mailchimp

    // when we're done with request
    request.end(); 

});


// when post request is made to /failure route this function is called 
app.post("/failure", function(req, res) {

    // redirect to "/" route
    res.redirect("/");
});


// setup server and listen on port 3000 or the port which heroku provides
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});



// api key
// af3a3d69bfddcce94045ddaab7c2ab3e-us5

// audience ID
// 12cc7b93fe
// this is added in vim
