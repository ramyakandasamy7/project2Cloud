const gym = require("express");
const gymRouter = gym.Router();
const aws = require("aws-sdk");
const bodyParser = require("body-parser");
gymRouter.use(bodyParser.json());
gymRouter.use(bodyParser.urlencoded({ extended: true }));

aws.config.update({
  region: "us-east-1",
  endpoint: "http://dynamodb.us-east-1.amazonaws.com"
});
var docClient = new aws.DynamoDB.DocumentClient();
gymRouter.post("/creategym", (req, res) => {
  var ID = Math.random()
    .toString(36)
    .substr(2, 9);
  var paramsaddGym = {
    TableName: "gymDatabase",
    Item: {
      gymID: ID,
      gymOwner: req.body.ownerID,
      cost: req.body.cost,
      rating: 0,
      locationofGym: req.body.location,
      attributes: req.body.attributes
    }
  };
  docClient.put(paramsaddGym, function(err, data) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return createFolder(ID, res);
      //name folder the id of the owner and pictures should be easier to parse
    }
  });
});

function createFolder(ID, res) {
  aws.config.update({
    region: "us-west",
    endpoint: "https://s3.amazonaws.com"
  });
  var bucketParams = {
    Bucket: "ramyakandasamy",
    Key: ID + "/",
    ACL: "public-read"
  };
  const s3 = new aws.S3({ apiVersion: "2006-03-1" });
  s3.putObject(bucketParams, function(err, data) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json({ message: ID + "folder created", gymID: ID });
    }
  });
}

//delete gym
gymRouter.post("/deletegym", (req, res) => {
  aws.config.update({
    region: "us-east-1",
    endpoint: "http://dynamodb.us-east-1.amazonaws.com"
  });
  var params = {
    TableName: "gymDatabase",
    Key: {
      gymID: req.body.gymID
    }
  };
  docClient.delete(params, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: "unable to delete gym " + req.body.gymID + " error is:" + err
      });
    } else {
      return res.status(200).json({ message: req.body.gymID + "gym deleted" });
    }
  });
});

//modify gym attributes
//cost, type of equipment[], owner_id, description, days available
gymRouter.post("/modifygym", (req, res) => {
  var paramsaddGym = {
    TableName: "gymDatabase",
    Key: {
      gymID: req.body.gymID
    },
    UpdateExpression: " set cost =:x, location=:y, attributes=:z,gymrating=:a",
    ExpressionAttributeValues: {
      ":x": req.body.cost,
      ":y": req.body.location,
      ":z": req.body.attributes,
      ":a": req.body.gymrating
    },
    ReturnValues: "UPDATED_NEW"
  };
  docClient.update(paramsaddGym, function(err, data) {
    if (err) {
      return res.status(400).json({
        message: "unable to modify gym " + req.body.gymID + " error is: " + err
      });
    } else {
      return res
        .status(200)
        .json({ message: req.body.gymID + "updated to" + data });
    }
  });
});

//upload a gym picture to Bucket
gymRouter.post("/gymPictureUpload", (req, res) => {
	console.log(req);
	console.log(req.files);
	var file = req.files.file;
	var gymID = req.body.gymID;
	var fileName = "gym.jpg";
	var base64file = new Buffer(file.data.buffer, 'binary');
	var folderKey = encodeURIComponent(gymID) + "/gym.jpg"; 

	var upload = new aws.S3.ManagedUpload({
		params: {
			Bucket: "ramyakandasamy",
			Key: folderKey,
			Body: base64file,
			ACL: "public-read"
		}
	});

	var promise = upload.promise();

	promise.then(
		function(data) {
			res.status(200);
			res.send("ok");
		},
		function(err) {
			res.status(400);
			res.send(err);
		}
	);
});

//get all Bucket folders
gymRouter.get("/gymPictures", (req, res) => {
	aws.config.update({
    		region: "us-west",
    		endpoint: "https://s3.amazonaws.com"
  	});
	const s3 = new aws.S3({ 
		apiVersion: "2006-03-1",
		params: { Bucket: "ramyakandasamy" }
	});
	s3.listObjects(function(err, data){
		if (err) {
			res.send(err);
		}
		res.status(200);
		res.json(data);
	});
});

//get a gym picture
gymRouter.get("/gymPicture", (req, res) => {
  aws.config.update({
    region: "us-west",
    endpoint: "https://s3.amazonaws.com"
  });
  const s3 = new aws.S3({ apiVersion: "2006-03-1" });
  const params = {
    Bucket: "ramyakandasamy",
    Key: req.body.id + "/gym.jpg"
  };
  const url = s3.getSignedUrl("getObject", params, function(err, data) {
  	if (err) {
		res.send(err);
	} else {
		res.status(200);
		res.json(data);
	}
  });
});

//delete a gym picture
gymRouter.post("/deleteFolder", (req, res) => {
	let key = req.body.key;
	aws.config.update({
    		region: "us-west",
    		endpoint: "https://s3.amazonaws.com"
  	});
	const s3 = new aws.S3({apiVersion: "2006-03-1"});
	var params = { 
			Bucket: "ramyakandasamy",
			Key: key
	};
	s3.deleteObject(params, function(err, data) {
		if (err) {
			res.send(err);
		} else {
			res.status(200);
			res.json(data);
		}
	});
});

//get all gyms from owner
gymRouter.get("/gyms/:id", (req, res) => {
  console.log(req.params);
  var params = {
    TableName: "gymDatabase",
    IndexName: "gymOwner-index",
    KeyConditionExpression: "gymOwner = :g",
    ExpressionAttributeValues: {
      ":g": req.params.id
    }
  };
  docClient.query(params, function(err, data) {
    if (err) {
      //res.status(400);
      res.send(err);
      console.log(err);
    } else {
      console.log(data);
      res.status(200);
      res.json(data);
    }
  });
});

//get a gym
gymRouter.get("/gym/:id", (req, res) => {
  console.log(req.params);
  var params = {
    TableName: "gymDatabase",
    KeyConditionExpression: "gymID = :g",
    ExpressionAttributeValues: {
      ":g": req.params.id
    }
  };
  docClient.query(params, function(err, data) {
    if (err) {
      //res.status(400);
      res.send(err);
      console.log(err);
    } else {
      console.log(data);
      res.status(200);
      res.json(data);
    }
  });
});

//get all gyms
gymRouter.get("/gyms", (req, res) => {
  var params = {
    TableName: "gymDatabase"
  };
  var requests = [];
  docClient.scan(params, (err, data) => {
    data.Items.forEach(function(item) {
      console.log(item);
      requests.push(item);
    });
    res.send(requests);
  });
});
module.exports = gymRouter;
