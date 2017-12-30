'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const seedData= require('../seed-data');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const {BlogPost}= require('../model');
const { runServer, app, closeServer }= require('../server');
const bodyParser = require('body-parser');
mongoose.Promise= global.Promise;

chai.use(chaiHttp);

create seed Data// already created with seedData
send seed data to Db//can just pass through the before function
create call to retrieve data from db// see above
tear down db
create GET test// posts is the end point and posts/:id
create POST test
create PUT test
create DELETE test
update package.json

function tearDownDb(){
console.log('!!! Tearing Down DB');
return mongoose.connection.dropDatabase();
}

app.get('/posts', (req, res)=>{
    BlogPost.find()//find all the documents in the collection
    .then(posts=>{
        res.json(posts.map(post=> post.serialize()))
    });
        .catch( err=> {
            console.log(err);
            res.status(500).json({error: 'Something is wrong!!'});
        });

});
