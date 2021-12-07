const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Record = require("./models/record_model");
const moment = require("moment");

const url =
  "mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true";

//A connection is created with the running mango database at the given url.
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((error) => {
    console.log(error);
    
  });

app.use(express.urlencoded({ extended: true }));

// parse json request body
app.use(express.json());

//Server starts listening for requests on port 80
app.listen(process.env.PORT ||80, () => {
  console.log(`Example app listening at 80`);
});

// a single endpoint that fetches the data in the provided MongoDB collection and return the results in the requested format.
app.post("/file", async (req, res) => {
  try {
    
    //Retrieves variables that must be present in the body of the request
    const { startDate, endDate, minCount, maxCount } = req.body;
    
    //It is checked whether the relevant variables are in the desired format and type.
    if (typeof minCount !== "number") {
      
      //If there is no data in the desired format, the error message is returned.
      res.json({
        code: 400,
        msg: "Minimum count has to be integer",
      });
    } else if (typeof maxCount !== "number") {
      
      //If there is no data in the desired format, the error message is returned.
      res.json({
        code: 400,
        msg: "Max count has to be integer",
      });
    } else if (!moment(endDate, "YYYY-MM-DD", true).isValid()) {
      
      //If there is no data in the desired format, the error message is returned.
      res.json({
        code: 400,
        msg: "EndDate has to be contain the in  a “YYYY-MM-DD” format",
      });
    } else if (!moment(startDate, "YYYY-MM-DD", true).isValid()) {
      
      ////If there is no data in the desired format, the error message is returned.
      res.json({
        code: 400,
        msg: "StartDate has to be contain the in  a “YYYY-MM-DD” format",
      });
    } else {
      //If all the data in the request body is in the desired format, this part works.
      
      //The array in which the appropriate data is stored and the format they contain are prepared
      const matches = [];
      const aggregationQuery = [
        {
          $project: {
            _id: 0,
            key: 1,
            createdAt: 1,
            totalCount: { $sum: "$counts" },
          },
        },
      ];

      //the data is filtered by the createdAt filter and the appropriate data is added to the array in the prepared format
      if (startDate) matches.push({ createdAt: { $gt: new Date(startDate) } });
      if (endDate) matches.push({ createdAt: { $lt: new Date(endDate) } });
      
      //The data with the desired count value is also filtered and the compatible ones are added to the array.
      if (minCount !== undefined)
        matches.push({ totalCount: { $gt: minCount } });
      if (maxCount !== undefined)
        matches.push({ totalCount: { $lt: maxCount } });
      
      //the array is passed to the output of the function if there is at least one compatible data
      if (matches.length !== 0) {
        aggregationQuery.push({
          $match: {
            $and: matches,
          },
        });
      }

      const records = await Record.aggregate(aggregationQuery);
      
      
//and a response with the desired format and code is sent.
      res.json({
        code: 0,
        msg: "Success",
        records: records,
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      msg: "eror",
    });
  }
});

/////Returns a blank page for its published version on heroku
app.get("/", async (req, res) => {
  
    res.end(" ")
  
});

//// send back a 404 error for any unknown api request
app.use(function(req, res, next){ 
    res.json({
      code: 404,
      msg: "eror",
    });
});


module.exports = app;
