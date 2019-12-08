var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server=require("../app");
let should = chai.should();
chai.use(chaiHttp);

var gym_id = 0;
var global_owner = 0;
describe ("GET ALL GYMS", function(){
    it("should get all gyms in the database", done=>{
        chai.request("http://localhost:3000")
            .get("/gyms")
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                gym_id = a[0].gymID;
                global_owner = a[0].gymOwner;
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

describe ("GET ONE GYM", function(){
    it("should get first gym in the database", done=>{
        chai.request("http://localhost:3000")
            .get("/gym/" + gym_id)
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

describe ("GET ONE GYM BY FIRST OWNER", function(){
    it("should get all gyms by first owner", done=>{
        chai.request("http://localhost:3000")
            .get("/gyms/" + global_owner)
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

describe ("GET GYM PICTURE FOR FIRST GYM", function(){
    it("should get cloudfront gym url for first gym", done=>{
        chai.request("http://localhost:3000")
            .get("/gymPicture/" + gym_id)
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                console.log(a);
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

describe ("GET ALL GYM BUCKET FOLDERS", function(){
    it("should get names of all s3 bucket folders", done=>{
        chai.request("http://localhost:3000")
            .get("/gymPictures/")
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                console.log(a);
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

//ownersAPI
var owner_id = 0;
describe ("GET ALL OWNERS", function(){
    it("should get all owners in the database", done=>{
        chai.request("http://localhost:3000")
            .get("/owners")
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                owner_id = a[0].ownerID;
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

describe ("GET ONE OWNER BY OWNER_ID", function(){
    it("should get first owner in the database", done=>{
        chai.request("http://localhost:3000")
            .get("/owners/" + owner_id)
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

//ratings
describe ("GET RATINGS FOR GYM", function(){
    it("should get ratings of first gym in the database", done=>{
        chai.request("http://localhost:3000")
            .get("/ratings/" + gym_id)
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

//request
describe ("GET ALL REQUESTS", function(){
    it("should get all requests in the database", done=>{
        chai.request("http://localhost:3000")
            .get("/requests/")
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

describe ("GET REQUESTS FOR FIRST OWNER", function(){
    it("should get all gyms by first owner", done=>{
        chai.request("http://localhost:3000")
            .get("/requests/" + global_owner)
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})

//user
describe ("GET ALL USERS", function(){
    it("should get all users in the database", done=>{
        chai.request("http://localhost:3000")
            .get("/users")
            .end((err,res)=>{
                res.should.have.status(200);
                var a = JSON.parse(res.text);
                console.log(a);
                var hasError = a.code
                chai.assert.equal(hasError, undefined);
                done()
            })
    })
})