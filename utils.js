const axios = require('axios');

exports.requestAndFormat = async (job,step,choices = ["all"]) => {
    let dohl = false
    const dohlJobs = ["BSM","ALC","WVR","CRP","CUL","ARM","GSM","LTW","BTN","MIN","FSH"]
    const accSlots = ["Ears","Neck","Wrists","FingerL"]
    if(dohlJobs.includes(job)) dohl = true
    let ilvl = dohl?process.env.dohlbody:process.env.dow
    let slot = ''
    let gearSet = {}
    let jobAcc;
    if(choices.includes("all")){
        gearSet = {
            "MainHand" : {},
            "OffHand": '',
            "Head": {},
            "Body": {},
            "Gloves": {},
            "Legs": {},
            "Feet": {},
            "Ears": {},
            "Neck": {},
            "Wrists": {},
            "FingerL": {},
            "FingerR": {}
        }
        if(dohlJobs.includes(job) || job === "PLD") job==="FSH"?{}:gearSet["OffHand"]={}
    } else {
        for(const choice of choices){
            gearSet[choice] = {}
        }
    }
    const jobGear = await axios.get(`https://beta.xivapi.com/api/1/search?sheets=Item&fields=Icon,Url,Name,EquipSlotCategory&query=%2BLevelItem=${ilvl}%20%2BClassJobCategory.${job}=true%20%2BIsUntradable=false&sort_field=LevelItem&sort_order=desc&limit=11`)
    const jobResults = jobGear.data.results
    // console.log("results", jobResults.data)
    if(dohl) {
        jobAcc = await axios.get(`https://beta.xivapi.com/api/1/search?sheets=Item&fields=Icon,Url,Name,EquipSlotCategory&query=%2BLevelItem=${process.env.dohlacc}%20%2BClassJobCategory.${job}=true%20%2bIsUntradable=false&sort_field=LevelItem&sort_order=desc&limit=20`)
        console.log("JobAcc call: ",jobAcc.data.results)
        for(const piece of jobAcc.data.results){
            console.log("fields: ",piece.fields)
            if(piece.fields.EquipSlotCategory){
                slot = Object.keys(piece.fields.EquipSlotCategory.fields).find(key => piece.fields.EquipSlotCategory.fields[key] === 1)
                console.log("slot: ",slot)
                if(accSlots.includes(slot)) jobResults.push(piece)
            }
        }
    }
    for(const itemPiece of jobResults){
        let piece = itemPiece.fields
        piece.ID = itemPiece.row_id
        // console.log("piece sanity",piece)
        if(piece.EquipSlotCategory){
            delete piece.EquipSlotCategory.ID
            delete piece.EquipSlotCategory.fields.SoulCrystal
            slot = Object.keys(piece.EquipSlotCategory.fields).find(key => piece.EquipSlotCategory.fields[key] === 1)
            delete piece.EquipSlotCategory
            piece.slot = slot
            if(slot && !piece.Name.includes('Ornate') && gearSet[slot]) gearSet[slot] = piece
            if(gearSet["FingerR"] && slot === "FingerL"){
            gearSet["FingerR"] = Object.assign({}, piece)
            gearSet["FingerR"].slot = "FingerR"
            }

        }
    }
    switch(step){
        case "tertiary":{
            let options= []
            for(const piece in gearSet){
                if(gearSet[piece]){
                    options.push({
                        label: gearSet[piece].slot,
                        description: gearSet[piece].Name,
                        value : `${job}_${gearSet[piece].slot}`
                    })
                }
            }
            return options
        }
        case "select" :{
            const order =  {}
            for(const gear of Object.keys(gearSet)){
                let icon = gearSet[gear]["Icon"]["path"].split("/")
                let iconHD = gearSet[gear]["Icon"]["path_hr1"].split("/")
                order[gear+"ID"] = gearSet[gear]["ID"]
                order[gear+"Icon"] = `/i/${iconHD[2]}/${iconHD[3].slice(0,-4)}.png`
                order[gear+"Name"] = gearSet[gear]["Name"]
            }
            return order
        }
    }
}

