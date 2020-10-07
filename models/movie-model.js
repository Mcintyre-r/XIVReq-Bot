const db = require("../dbConfig.js")

module.exports = {
    createEvent,
    resolveEvent,
    checkEvent
}

function createEvent(event){
    return db("Movies").insert(event, "Title")
}

function resolveEvent(){
    return db("Movies").del();
}

function checkEvent(){
    return db("Movies")
}