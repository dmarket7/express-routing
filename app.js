const express = require("express");
const ExpressError = require("./expressError")

const app = express();

// Helper function
function getMedian(values) {
  if (values.length === 0) return 0;

  values.sort(function (a, b) {
    if (isNaN(parseInt(a))) {
      throw new ExpressError("Use only numbers!", 400);
    }
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return parseInt(values[half]);

  return (parseInt(values[half - 1]) + parseInt(values[half])) / 2.0;
}

// for processing JSON:
app.use(express.json());

app.get("/mean", function (req, res, next) {
  try {
    const nums = req.query.nums.split(',');
    let sum = nums.reduce(function (acc, next) {
      if (isNaN(parseInt(next))) {
        throw new ExpressError("Use only numbers!", 400);
      }
      return acc += parseInt(next);
    }, 0);
    let mean = sum / nums.length;
    console.log("The mean is: ", mean);
    res.json({ operation: "mean", value: mean })
  } catch (err) {
    return next(err);
  }
});

app.get("/median", function (req, res, next) {
  try {
    const nums = req.query.nums.split(',');
    let median = getMedian(nums)
    console.log("The median is: ", median);
    res.json({ operation: "median", value: median })
  } catch (err) {
    return next(err);
  }
});

app.get("/mode", function (req, res, next) {
  try {
    const nums = req.query.nums.split(',');
    let numsCount = {};
    let maxValue = -10000000;
    let mode = 0;
    for (let i = 0; i < nums.length; i++) {
      if (isNaN(parseInt(nums[i]))) {
        throw new ExpressError("Use only numbers!", 400);
      }
      numsCount[nums[i]] = (numsCount[nums[i]] || 0) + 1;
      if (numsCount[nums[i]] > maxValue) {
        maxValue = numsCount[nums[i]];
      }
    }

    for(let key in numsCount) {
      if(numsCount[key] === maxValue){
        mode = key;
      }
    }
    
    console.log("The mode is: ", mode);
    res.json({ operation: "mode", value: mode })
  } catch (err) {
    return next(err);
  }
});


app.use(function (req, res, next) {
  const notFoundError = new ExpressError("Not Found", 404);
  return next(notFoundError);
});

app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status }
  });
});



app.listen(3000, function () {
  console.log("App on port 3000");
});