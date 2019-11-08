const gym = require("express");
const gymRouter = gym.Router();
const aws = require("aws-sdk");
aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();

//create a gym
gymRouter.post(
  "/creategym/:gymOwner/:location/:cost/:cardioequipment/:dumbbell/:barbell/:urltoPictures",
  (req, res) => {
    var ID = Math.random()
      .toString(36)
      .substr(2, 9);
    var paramsaddGym = {
      TableName: "gymDatabase",
      Item: {
        gymID: ID,
        gymOwner: req.params.gymOwner,
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
gymRouter.post("/deleterequest/:gymID", (req, res) => {
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

//modify gym attributes
gymRouter.post(
  "/modifygym/:gymID/:location/:cost/:cardioequipment/:dumbbell/:barbell",
  (req, res) => {
    var paramsaddGym = {
      TableName: "gymDatabase",
      Key: {
        gymID: req.params.gymID
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

//get all gyms
gymRouter.get("/gyms", (req, res) => {
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
module.exports = gymRouter;
