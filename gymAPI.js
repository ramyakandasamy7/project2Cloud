const express = require("express");
const app = express();
const aws = require("aws-sdk");
var requests = new Array();
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
var gymRequestor = "Ramya";
var gymOwner = "Sample Owner";

//create Gym
app.post(
  "/creategym/:gymOwner/:location/:cost/:cardioequipment/:dumbbell/:barbell",
  (req, res) => {
    var paramsaddGym = {
      TableName: "gymDatabase",
      Item: {
        gymID: req.params.gymOwner,
        cost: req.params.cost,
        locationofGym: req.params.location,
        attributes: {
          cardioequipment: req.params.cardioequipment,
          dumbbell: req.params.dumbbell,
          barbell: req.params.barbell
        }
      }
    };
    docClient.put(paramsaddGym, function(err, data) {
      if (err) {
        console.log("Unable to add item" + JSON.stringify(err));
      } else {
        console.log("Added item", JSON.stringify(data, null, 2));
      }
    });
  }
);

//delete gym
app.post("/deleterequest/:gymID", (req, res) => {
  var params = {
    TableName: "gymDatabase",
    Key: {
      gymID: req.params.gymID
    }
  };
  docClient.delete(params, (err, data) => {
    if (err) {
      console.log("unable to delete item");
    } else {
      console.log("Delete Item succeeded");
    }
  });
});

//update gym attributes
app.post(
  "/modifygym/:gymOwner/:location/:cost/:cardioequipment/:dumbbell/:barbell",
  (req, res) => {
    var paramsaddGym = {
      TableName: "gymDatabase",
      Key: {
        gymID: req.params.gymOwner
      },
      UpdateExpression:
        " set cost =:x, locationofGym=:y, attributes.cardioequipment =:z, attributes.dumbbell =:a, attributes.barbell =:b",
      ExpressionAttributeValues: {
        ":x": req.params.cost,
        ":y": req.params.location,
        ":z": req.params.cardioequipment,
        ":a": req.params.dumbbell,
        ":b": req.params.barbell
      },
      ReturnValues: "UPDATED_NEW"
    };
    docClient.update(paramsaddGym, function(err, data) {
      if (err) {
        console.log("Unable to modify item" + JSON.stringify(err));
      } else {
        console.log("Added item", JSON.stringify(data, null, 2));
      }
    });
  }
);

app.get("/gyms", (req, res) => {
  var params = {
    TableName: "gymDatabase"
  };
  docClient.scan(params, (err, data) => {
    data.Items.forEach(function(item) {
      console.log(item);
      requests.push(item);
    });
    res.send(requests);
  });
});

//returns all requests
app.get("/requests", (req, res) => {
  var params = {
    TableName: "requestDatabase"
  };
  docClient.scan(params, (err, data) => {
    data.Items.forEach(function(item) {
      console.log(item);
      requests.push(item);
    });
    res.send(requests);
  });
});

//create a request to workout
app.post("/createrequest/:date/:startTime/:endTime", (req, res) => {
  var ID = Math.random()
    .toString(36)
    .substr(2, 9);
  var paramsaddRequest = {
    TableName: "requestDatabase",
    Item: {
      requestID: ID,
      dateRequest: req.params.date,
      startTime: req.params.startTime,
      endTime: req.params.endTime,
      requestee: gymRequestor,
      owner: gymOwner
    }
  };
  docClient.update(paramsaddRequest, function(err, data) {
    if (err) {
      console.log("Unable to add item" + JSON.stringify(err));
    } else {
      console.log("Added item", JSON.stringify(data, null, 2));
    }
  });
});
//delete request to workout
app.post("/deleterequest/:requestID", (req, res) => {
  var params = {
    TableName: "requestDatabase",
    Key: {
      requestID: req.params.requestID
    }
  };
  docClient.delete(params, (err, data) => {
    if (err) {
      console.log("unable to delete item");
    } else {
      console.log("Delete Item succeeded");
    }
  });
});

//modify request to workout
app.post("/modifyrequest/:requestID/:date/:startTime/:endTime", (req, res) => {
  var params = {
    TableName: "requestDatabase",
    Key: {
      requestID: req.params.requestID
    },
    UpdateExpression: "set dateRequest =:x, startTime =:y, endTime=:z",
    ExpressionAttributeValues: {
      ":x": req.params.date,
      ":y": req.params.startTime,
      ":z": req.params.endTime
    },
    ReturnValues: "UPDATED_NEW"
  };
  docClient.update(params, function(err, data) {
    if (err) {
      console.error("unable to update item", err);
    } else {
      console.log("success");
    }
  });
});
app.listen(3000, function() {
  console.log("Listening on port 3000");
});
