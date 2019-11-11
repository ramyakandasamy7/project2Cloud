const gym = require("express");
const gymRouter = gym.Router();
const aws = require("aws-sdk");

aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
gymRouter.post(
  "/creategym/:ownerID/:location/:cost/:attributes/:gymrating",
  (req, res) => {
    var ID = Math.random()
      .toString(36)
      .substr(2, 9);
    var paramsaddGym = {
      TableName: "gymDatabase",
      Item: {
        gymID: ID,
        gymOwner: req.params.ownerID,
        cost: req.params.cost,
        locationofGym: req.params.location,
        attributes: req.params.attributes,
        rating: req.params.gymrating
      }
    };
    docClient.put(paramsaddGym, function(err, data) {
      if (err) {
        console.log("Unable to add item" + JSON.stringify(err));
      } else {
        console.log("Added item", JSON.stringify(data, null, 2));
        createFolder(ID);
        //name folder the id of the owner and pictures should be easier to parse
      }
    });
  }
);

function createFolder(ID) {
  aws.config.update({
    region: "us-west",
    endpoint: "https://s3.amazonaws.com"
  });
  var bucketParams = {
    Bucket: "ramyakandasamy",
    Key: ID + "/",
    ACL: "public-read"
  };
  console.log(aws.config.region + aws.config.endpoint);
  const s3 = new aws.S3({ apiVersion: "2006-03-1" });
  s3.putObject(bucketParams, function(err, data) {
    console.log(s3);
    if (err) {
      console.log("Error creating the folder", err);
    } else {
      console.log("Successfully created a folder");
    }
  });
}

//delete gym
gymRouter.post("/deleterequest/:gymID", (req, res) => {
  aws.config.update({
    region: "us-east-1",
    endpoint: "http://dynamodb.us-east-1.amazonaws.com"
  });
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
//cost, type of equipment[], owner_id, description, days available
gymRouter.post(
  "/modifygym/:gymID/:location/:cost/:attributes/:gymrating",
  (req, res) => {
    var paramsaddGym = {
      TableName: "gymDatabase",
      Key: {
        gymID: req.params.gymID
      },
      UpdateExpression:
        " set cost =:x, location=:y, attributes=:z,gymrating=:a",
      ExpressionAttributeValues: {
        ":x": req.params.cost,
        ":y": req.params.location,
        ":z": req.params.attributes,
        ":a": req.params.gymrating
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
