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
    const jobGear = await axios.get(`https://xivapi.com/search?string=&columns=ID,Icon,IconHD,Url,Name,LevelItem,EquipSlotCategory&indexes=Item&filters=LevelItem=${ilvl},ClassJobCategory.${job}=1,IsUntradable=0&sort_field=LevelItem&sort_order=desc&limit=11`)
    const jobResults = jobGear.data.Results
    if(dohl) {
        jobAcc = await axios.get(`https://xivapi.com/search?string=&columns=ID,Icon,IconHD,Url,Name,LevelItem,EquipSlotCategory&indexes=Item&filters=LevelItem=${process.env.dohlacc},ClassJobCategory.${job}=1,IsUntradable=0&sort_field=LevelItem&sort_order=desc&limit=11`)
        for(const piece of jobAcc.data.Results){
            if(piece.EquipSlotCategory){
                slot = Object.keys(piece.EquipSlotCategory).find(key => piece.EquipSlotCategory[key] === 1)
                if(accSlots.includes(slot)) jobResults.push(piece)
            }
        }
    }
    for(const piece of jobResults){
        if(piece.EquipSlotCategory){
            delete piece.EquipSlotCategory.ID
            delete piece.EquipSlotCategory.SoulCrystal
            slot = Object.keys(piece.EquipSlotCategory).find(key => piece.EquipSlotCategory[key] === 1)
            delete piece.EquipSlotCategory
            piece.slot = slot
            if(slot && !piece.Name.includes('Ornate') && gearSet[slot]) gearSet[slot] = piece
            if(gearSet["FingerR"] && slot === "FingerL"){
            gearSet["FingerR"] = piece
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
            console.log(options)
            return options
        }
        case "select" :{
            const order =  {}
            for(const gear of Object.keys(gearSet)){
                order[gear+"ID"] = gearSet[gear]["ID"]
                order[gear+"Icon"] = gearSet[gear]["IconHD"]
                order[gear+"Name"] = gearSet[gear]["Name"]
            }
            return order
        }
    }
}

