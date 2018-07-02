const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const {BlogPosts} = require('./models');
const jsonParser = bodyParser.json();

BlogPosts.create('I fell for it...','I tripped over a cord and hurt myself','John Doe','01-01-01');
BlogPosts.create('My Dog','I got a new dog.  I call him Borg.  Because he goes "Borg, borg, borg, borg...".','John Doe','02-02-02');

router.get('/', (req,res)=>{
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res)=>{
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
})

router.put('/:id', jsonParser, (req,res)=>{
    console.log('Request Parameter ID', req.param.id);
    const requiredFields = ['title', 'content', 'author', "id"];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    if (req.params.id !== req.body.id){
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
    });
    res.status(204).end();
});

router.delete('/:id', (req,res)=>{
    BlogPosts.delete(req.params.id);
    console.log(`Deleted Blog Entry "${req.params.ID}"`);
    res.status(204).end();
});

module.exports = router;