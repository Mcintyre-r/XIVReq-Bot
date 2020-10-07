const db = require("../dbConfig.js")

module.exports = {
    addViewer,
    clearViewers,
    getViewers
}

function addViewer(UID){
    return db("Viewers").insert(UID, "UID")
}

function clearViewers(){
    return db("Viewers").del();
}

function getViewers(){
    return db("Viewers")
}