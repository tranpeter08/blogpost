const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog posts", function(){

    before(function(){
        return runServer();
    });

    after(function(){
        return closeServer();
    });

    //test GET
    it("should list blog posts on GET", function(){
        return chai
        .request(app)
        .get("/blog")
        .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.an("array");
            expect(res.body.length).to.be.at.least(1);

            const expectedKeys = ["id","title","content","author","publishDate"];
            res.body.forEach(function(item){
                expect(item).to.be.an("object");
                expect(item).to.include.keys(expectedKeys);
            });
        });
    });

    //test for POST
    it("should create a blog post on POST", function(){
        const newItem = {
            'title': 'A title',
            'content':'an entry',
            'author':'an author', 
            "publishDate":"01-01-01"
        };
        return chai
        .request(app)
        .post("/blog")
        .send(newItem)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.an("object");
            expect(res.body).to.include.keys("id", "title", "content","author");
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(
                Object.assign(newItem,{id: res.body.id})
            );
        });
    })

    //test for PUT
    it("should update a blog post on PUT", function(){
        const updateData = {
            'title': 'An updated title',
            'content':'an updated entry',
            'author':'an updated author', 
            "publishDate":"01-01-01"
        };
        return (
            chai
            .request(app)
            .get("/blog")
            .then(function(res){
                updateData.id = res.body[0].id;
                return chai
                .request(app)
                .put(`/blog/${updateData.id}`)
                .send(updateData);
            })
            .then(function(res){
                expect(res).to.have.status(204);
            })
        );
    });

    //test for DELETE
    it("should delete a blog post on DELETE", function(){
        return (
            chai
            .request(app)
            .get("/blog")
            .then(function(res){
                let anID = res.body[0].id;
                return chai
                .request(app)
                .delete(`/blog/${anID}`)
            })
            .then(function(res){
                expect(res).to.have.status(204);
            })
        )
    })
});