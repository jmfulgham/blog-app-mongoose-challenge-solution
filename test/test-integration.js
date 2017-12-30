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
//tear down db
//create GET test// posts is the end point and posts/:id
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
    })
        .catch( err=> {
            console.log(err);
            res.status(500).json({error: 'Something is wrong!!'});
        });

});

app.get('/posts/:id', (req, res)=>{
    BlogPost
    .findById(req.params.id)
    .then(posts=>
        {res.json(posts.map(post => post.serialize()))
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: 'Cannot compute'});
    });
});

app.post('/posts',(req, res)=>{
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            console.log(`Missing ${field}`);
            return res.status(400).send(`Missing ${field}`);
        }
    }
    BlogPost
    .create({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
    })
    .then(posts =>{
        res.status(201).json(posts.serialize())
        .catch(err =>{
            console.log(err);
            res.status(500).json({error: 'Error. Malfunction'});
        });
    });
});

app.delete('/posts/:id', (req, res)=>{
    BlogPosts
    .findByIdAndRemove(req.params.id)
    .then(()=>{
         res.status(204).json({messge: 'Successfully deleted!'})
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message: "Error, couldn't delete"});
    });
});

app.put('/posts/:id',(req, res)=>{
    BlogPosts
    .findById(req.params.id)
    .then()
})






