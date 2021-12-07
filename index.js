const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Record = require("./models/record_model");
const moment = require("moment");

const url =
  "mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((error) => {
    console.log(error);
    
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(process.env.PORT ||80, () => {
  console.log(`Example app listening at 80`);
});

app.post("/file", async (req, res) => {
  try {
    const { startDate, endDate, minCount, maxCount } = req.body;
    if (typeof minCount !== "number") {
      res.json({
        code: 400,
        msg: "Minimum count has to be integer",
      });
    } else if (typeof maxCount !== "number") {
      res.json({
        code: 400,
        msg: "Max count has to be integer",
      });
    } else if (!moment(endDate, "YYYY-MM-DD", true).isValid()) {
      res.json({
        code: 400,
        msg: "EndDate has to be contain the in  a “YYYY-MM-DD” format",
      });
    } else if (!moment(startDate, "YYYY-MM-DD", true).isValid()) {
      res.json({
        code: 400,
        msg: "StartDate has to be contain the in  a “YYYY-MM-DD” format",
      });
    } else {
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

      if (startDate) matches.push({ createdAt: { $gt: new Date(startDate) } });
      if (endDate) matches.push({ createdAt: { $lt: new Date(endDate) } });
      if (minCount !== undefined)
        matches.push({ totalCount: { $gt: minCount } });
      if (maxCount !== undefined)
        matches.push({ totalCount: { $lt: maxCount } });
      if (matches.length !== 0) {
        aggregationQuery.push({
          $match: {
            $and: matches,
          },
        });
      }

      const records = await Record.aggregate(aggregationQuery);

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
app.get("/", async (req, res) => {
  
    res.end(" ")
  
});
app.use(function(req, res, next){ 
    res.json({
      code: 404,
      msg: "eror",
    });
});


module.exports = app;
