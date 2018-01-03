'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require('mongoose');
const seedData = require('../seed-data');
const {
  app,
    runServer,
    closeServer
} = require('../server');
const {
  TEST_DATABASE_URL
} = require('../config');
const {
  BlogPost
} = require('../models');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

chai.use(chaiHttp);


//update package.json
//add Travis files

//DB tear down
function tearDownDb() {
    console.log('!!! Tearing Down DB');
    return mongoose.connection.dropDatabase();
}

//CRUD
app.get('/posts', (req, res) => {
    BlogPost.find() //find all the documents in the collection
        .then(posts => {
            res.json(posts.map(post => post.serialize()))
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Something is wrong!!'
            });
        });

});

app.get('/posts/:id', (req, res) => {
    BlogPost
        .findById(req.params.id)
        .then(posts => {
            res.json(posts.map(post => post.serialize()))
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: 'Cannot compute. Ainno get bih'
            });
        });
});

app.post('/posts', (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
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
        .then(posts => {
            res.status(201).json(posts.serialize())
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: 'Error. Malfunction. Could not POST'
                    });
                });
        });
});

app.delete('/posts/:id', (req, res) => {
    BlogPost
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({
                messge: 'Successfully deleted!'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error, couldn't delete"
            });
        });
});

app.put('/posts/:id', (req, res) => {
    if (!(req.body.id === res.body.id)) {
        res.status(400).json({
            message: "ID is not matching "
        });
    }

    const updateFields = ['title', 'content', 'author'];
    const updates = {};
    updateFields.forEach(field => {
        if (field in req.body) {
            update[field] = req.body[field];
        }
    });

    BlogPosts
        .findByIdAndUpdate(req.params.id, {
            $set: updated
        }, {
            new: true
        })
        .then(updatedPost => res.status(204).end())
        .catch(err => {
            console.log(err);
            res.status(404).json({
                message: `Uh oh, we couldn't update ${updatedPost}`
            })
        });
});

//Start the Chai testing
//Start database and seed data
describe('Seed data for testing', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return BlogPost.create(seedData);
    });

    after(function () {
        return closeServer();
    });

    afterEach(function () {
        return tearDownDb();
    });

    //Start testing CRUD functions
    describe('GET endpoint', function () {
        it('should return all blog posts in the database', function () {
            //it should return all records in the DATABASE (count)
            //it should be the right data type (json object)
            let response;
            return chai.request(app)
                .get('/posts')
                .then(function (res) {
                    response = res;
                    response.should.have.status(200);
                })
                .then(function (count) {
                    return BlogPost.count();
                    response.body.should.have.length.of(count);
                });
        });
        //});

        it('should have the right keys', function () {
            let blogger;
            return chai.request(app)
                .get('/posts')
                .then(function (res) {
                    blogger = res;
                    blogger.should.have.status(200);
                    blogger.should.be.json;
                    blogger.should.be.an('object');
                    //check for fields
                    blogger.body.should.be.an('array');
                })
                    .then(function () {
                        for (let i = 0; i < blogger.body.length; i++) {
                            blogger.body[i].should.include.keys(['title', 'author', 'content']);
                        }
                    })

                    //find one blog post 
                    //save that blog post response
                    //and then check its id


                    .then(function () {
                        return BlogPost.findOne()
                        onePost.id.should.equal(BlogPost.id);
                            onePost.title.should.equal(BlogPost.title);
                            onePost.author.should.equal(BlogPost.author);
                            onePost.content.should.equal(BlogPost.content);




                        // it ('should post new blog post', function(){
                        //     let newPost={title: "Awww schucky ducky, I am a new blog post", author:`Mone't Fulgham`, content: `I'm gonna tell you a story about an aspiring web developer...`};
                        //     //return the POST request
                        //     //send new app
                        //     //check it is a JSON object
                        //     //Check the status is correct, 201
                        //     //check there is an id
                        //     return chai.request(app)
                        //     .post('/posts')
                        //     .then(function(res){
                        //         res.status.should.be(201);
                        //         res.should.be.json;
                        //     })
                        //})

                    
                
            
                    })})})})