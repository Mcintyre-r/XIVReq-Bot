const db = require("../dbConfig.js")

module.exports = {
    createEvent,
    resolveEvent,
    checkEvent,
    updateEvent
}

function createPower(truth){
    return db("Power").insert(truth, "Power")
}

function emptyPower(){
    return db("Power").del();
}

function checkPower(){
    return db("Power").first()
}

function updatePower(truth){
    return db("Power").update(truth, "Power")
}