const db = require("../dbConfig.js")

module.exports = {
    createEvent,
    resolveEvent,
    checkEvent,
    updateEvent
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

function updateEvent(event){
    return db("Movies").update(event, "Title")
}