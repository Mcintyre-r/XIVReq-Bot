const {Client, MessageAttachment, MessageEmbed} = require('discord.js')
const axios = require('axios')
const bot  = new Client();
const token = 'NzM4MjU0NTY5MjM4MTY3NjQz.XyJPJQ.nC77-OTA1RMvdAXnYs7pfQnCxg0';
const Queue = require('smart-request-balancer');
require('ffmpeg')
require('ffmpeg-static')

const queue = new Queue({
    rules: {                     // Describing our rules by rule name
      common: {                  // Common rule. Will be used if you won't provide rule argument
        rate: 10,                // Allow to send 30 messages
        limit: 1,                // per 1 second
        priority: 1,             // Rule priority. The lower priority is, the higher chance that
                                 // this rule will execute faster 
      }
    },
    default: {                   // Default rules (if provided rule name is not found
      rate: 10,
      limit: 1
    },
    overall: {                   // Overall queue rates and limits
      rate: 10,
      limit: 1
    },
    retryTime: 10,              // Default retry time. Can be configured in retry fn
    ignoreOverallOverheat: true  // Should we ignore overheat of queue itself
  })
  function compare(a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  
    // names must be equal
    return 0
}
let event = {
    'title': '',
    'tank': [],
    'healer': [],
    'dps': [],
    'signedup': []
}
const template = {
    'title': '',
    'tank': [],
    'healer': [],
    'dps': [],
    'signedup': []
}





bot.on('ready', () =>{
    console.log('This bot is online!')
})

 // Returns message with angry bear gif if user mentions their uptime 
bot.on('message', req => {
    const attachment = new MessageAttachment('https://cdn.discordapp.com/attachments/313148981502935040/697154625815707798/image0.gif');
    if(req.content.includes("uptime")){
        req.channel.send(attachment)
    }
})

bot.on('message', req => {
    message = req.content.toLowerCase()
    words = ["mean","bully" , "rude" , "bulli"]
    words.forEach( e => {
        if(message.includes(e) && req.author.id == 211556765492314112){
            i=0
            while(i<10){
                req.channel.send("<:peepo:738255120554262575>".repeat(10))
                i++
            }
            
        }
    })
    
})

bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    const channel = await bot.channels.fetch('722372816619569263');
    const choices = ['./deja.mp3','./burn.mp3','./kill.mp3','./rem.mp3','./gas.mp3','./night.mp3','./run.mp3']
    const index = Math.floor(Math.random() * choices.length)
    let newUserChannel = newMember.channel
    if(newUserChannel.name === 'Initial D-tention'){
        const connection = await channel.join();
        let users = Array.from(channel.members.keys());
        console.log(users.length)
    if(users.length > 1){
        const dispatcher = connection.play(choices[index]);

        dispatcher.on('start', () => {
            console.log('audio.mp3 is now playing!');
        });

        dispatcher.on('finish', () => {
            console.log('audio.mp3 has finished playing!');
            channel.leave()
            let users2 = Array.from(channel.members.keys());
            users2.forEach(async (e) => {
                let current = await bot.user.fetch(e)
                newMember.guild.member(current.id).voice.setChannel(716015727630483580)
            })
        });
        dispatcher.on('error', console.error);
    }  
    }
    if(oldMember.channel.name === 'Initial D-tention'){
        channel.leave()
    }
})


// Request function for XIV Bot
const PREFIX = '?'

bot.on( 'message' , async message => {

    const item = message.content.toLowerCase()
    // message.delete({timeout: 1000 * 10})

    let post = {
        item: '',
        quantity: 0,
        requestedBy: '',
        completed: false
    }

    let args = message.content.substring(PREFIX.length).split(" ");


    let outputIDs = []
    const expectedIdsCallback = (ID,name, desc, item, bool, expec) => {
        check = false
        if(bool.toLowerCase() == 'true'){
            check = true
        }

        console.log('ID:', ID, 'remaining:', expec.length, 'name:', name, 'Desc:', desc)
        console.log('expec', expec)

        outputIDs.push({name, has: desc})

        expec.splice(expec.indexOf(ID), 1);
       
        if (expec.length == 0) {

            let exampleEmbed = new MessageEmbed()
            .setColor('#FF4500')

            let i = 0

            message.channel.send(`Here you go these people have "${item}":`)

            for(let member of outputIDs.sort(compare)){
                if(member.has === check){
                    exampleEmbed.addField(member.name, member.has,true)
                    i++
                    if( i>= 25){
                        message.channel.send(exampleEmbed)
                        i= 0
                        exampleEmbed = new MessageEmbed()
                        .setColor('#FF4500')
                    } 
                }
            }
            if( i>0){
                message.channel.send(exampleEmbed)
                i= 0
                exampleEmbed = new MessageEmbed()
                .setColor('#FF4500')
            }  
            outputIDs = []
            expectedIDs = [];          

        }
    };

    const filter = m => m.author.id === message.author.id;

    let collected = {}
    let bool = ''

    
    switch(args[0].toLowerCase()){


        case 'request' :

            message.reply("Please submit a quantity... Will expire in 10 seconds..").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
            message.channel.awaitMessages(filter, { max: 1, time: 10000}).then(collected => {
                const quantity = collected.first().content
                collected.first().delete({timeout: 1000 * 10})

            // User Checks if submitted request exists and then formats request for submission.     
            if(item !== '?request') {
                // parses given number from string to int
                const trueQuan = parseInt(quantity)      
                const itemSubmit = item.replace("?request", "")
                post.quantity = trueQuan;
                post.requestedBy = message.author.username;
                post.requesterId = message.author.id;
                post.item = itemSubmit.trimStart()

                axios.get(`https://xivapi.com/search?string=${post.item}&private_key=73bc4666b8044a95acbe3b469b59c0079beaf9666d164a35a68846fbd4f99f2f`)
                .then(response => {
                    
                    const apiItem = response.data.Results
                    // console.log(response.data)
                    if(apiItem[0]){
                        console.log(apiItem[0])
                    post.item = apiItem[0].Name
                    post.itemIcon = `https://xivapi.com${apiItem[0].Icon}`
                    post.itemID = apiItem[0].ID
                    console.log(post)
                    // axios.post('http://localhost:8000/api/projects', post)
                    // .then(res => message.channel.send('Request submitted now shut up \n Check status at http://localhost:3000/').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)))
                    // .catch(err => message.channel.send('There was an error submitting your request please check request and try again.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)))
                    } else {
                        message.channel.send('Cannot find item, check name submission').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
                    }
                    
                })
                .catch(err => {
                    message.channel.send('Cannot find item, check name submission').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
                })

               
            } else {
                message.channel.send('Requests cannot be empty.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
            }
            })
            break;


        case 'minion' :
            message.reply("Specify True or False... Expires in 10s...").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
            collected = await message.channel.awaitMessages(filter, { max: 1, time: 10000})
            bool = collected.first().content
            collected.first().delete({timeout: 1000 * 10})
            if(item !== '?minion') {
                const MinSubmit = item.replace("?minion ", "")
                message.channel.send('Please Wait I\'m doing my best...').then( r => r.delete ({timeout: 40000})).catch(err => console.log(err))
                console.log(MinSubmit)
                let expectedIDs = [];
                await axios.get('https://xivapi.com/freecompany/9232519973597979666?data=FCM&private_key=73bc4666b8044a95acbe3b469b59c0079beaf9666d164a35a68846fbd4f99f2f')
                .then(members => {
                    members.data.FreeCompanyMembers.forEach(member => {
                            expectedIDs.push(member.ID)
                            queue.request((retry) => axios.get(`https://xivapi.com/character/${member.ID}?data=MIMO&private_key=73bc4666b8044a95acbe3b469b59c0079beaf9666d164a35a68846fbd4f99f2f`)
                            .then(minions => {
                                let hasMinion = false
                                if(minions.data.Minions.length == 0){
                                    if(member.Name == 'Chi Kiba'){
                                        console.log('skip')
                                    }
                                    else if(member.Name == 'Instant Billy'){
                                        console.log('skip')
                                    }
                                    else{
                                        throw 'empty'
                                    }
                                    
                                }
                                for(let min of minions.data.Minions){
                                    if(min.Name.toLowerCase() == MinSubmit){
                                        hasMinion = true
                                    }
                                }
                                if(!hasMinion){
                                    console.log('Name:',member.ID, 'Minions', minions.data.Minions.length)
                                }
                                
                                
                                expectedIdsCallback(member.ID, member.Name, hasMinion ? true : false, MinSubmit, bool, expectedIDs)
                            })
                            .catch(error => {
                                if(error == 'empty'){
                                    console.log('Name:',member.Name, 'empty minion')
                                    return retry()
                                }
                                else if (error.response == undefined){
                                    console.log(error)
                                }
                                else if (error.response.status === 429) {
                                    console.log('Rate Limit Hit, Retrying with ID:', member.ID)
                                    return retry()
                                }
                                
                                expectedIdsCallback(member.ID, member.Name, 'error', MinSubmit, bool)
                                throw error;
                            }), member.ID, 'common');
        
                        })

                })   
                
                
                
            }
            else{
            message.channel.send('Include a Minion to search for').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
            }

            break;
        


        case 'mount' :
            message.reply("Specify True or False... Expires in 10s...").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
            collected = await message.channel.awaitMessages(filter, { max: 1, time: 10000})
            bool = collected.first().content
            collected.first().delete({timeout: 1000 * 10})
            if(item !== '?mount') {
                const MonSubmit = item.replace("?mount ", "")
            
                message.channel.send('Please Wait I\'m doing my best...').then( r => r.delete ({timeout: 40000})).catch(err => console.log(err))

                let expectedIDs = [];
                await axios.get('https://xivapi.com/freecompany/9232519973597979666?data=FCM&private_key=73bc4666b8044a95acbe3b469b59c0079beaf9666d164a35a68846fbd4f99f2f')
                .then(members => {
                    members.data.FreeCompanyMembers.forEach(member => {
                            expectedIDs.push(member.ID)
                            queue.request((retry) => axios.get(`https://xivapi.com/character/${member.ID}?data=MIMO&private_key=73bc4666b8044a95acbe3b469b59c0079beaf9666d164a35a68846fbd4f99f2f`)
                            .then(mounts => {
                                let hasMount = false
                                if(mounts.data.Mounts.length == 0){
                                    if(member.Name == 'Chi Kiba'){
                                        // console.log('skip')
                                    }
                                    else if(member.Name == 'Instant Billy'){
                                        // console.log('skip')
                                    }
                                    else{
                                        throw 'empty'
                                    }
                                    
                                }
                                for(let mon of mounts.data.Mounts){
                                    if(mon.Name.toLowerCase() == MonSubmit){
                                        hasMount = true
                                    }
                                }
                                
                                
                                expectedIdsCallback(member.ID, member.Name, hasMount ? true : false, MonSubmit,bool, expectedIDs)
                            })
                            .catch(error => {
                                if(error == 'empty'){
                                    console.log('Name:',member.Name, 'empty mount')
                                    return retry()
                                }
                                else if (error.response == undefined){
                                    // console.log(error)
                                }
                                else if (error.response.status === 429) {
                                // console.log('Rate Limit Hit, Retrying with ID:', member.ID)
                                return retry()
                                }
                                
                                expectedIdsCallback(member.ID, member.Name, 'error', MonSubmit, bool, expectedIDs)
                                throw error;
                            }), member.ID, 'common');
        
                        })

                })   
                
            }
            else{
                message.channel.send('Include a Mount to search for').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
            }
            break;



        case 'clear' :
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                message.channel.bulkDelete(100, true)
                   .then(res => {message.channel.send(`Bulk deleted ${res.size} messages`).then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))}) 
                    .catch(err => {
                    message.channel.send("Well you broke something... ").then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)) 
                    console.log(err)})                        
            }
            else{
                i=0
                while(i<10){
                    message.channel.send("<:peepo:738255120554262575>".repeat(10))
                    i++
                }
            }
            break;



        case 'help' :
            message.delete({timeout: 1000 * 20})
            message.reply("---These the commands---").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
            message.channel.send("> ?Minion <-Minion Name->").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
            message.channel.send("> ?Mount <-Mount Name->").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
            break;
        
        case 'setevent':
            if(event['title'] == ''){
                if(item !== '?setevent') {
                    message.delete({timeout: 1000 * 20})
                    const rec = message.content.replace("?SetEvent ", "")
                    event['title'] = rec
                    message.reply("Record has been updated").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
                }
                else{
                    message.reply("Please include a title for the event").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
                } 
            } else {
                message.reply("There is already a pending event").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
            }
            
            break;






        case 'signup':
            console.log(event)
            let signedup = false
            for(let id of event['signedup']){
                console.log(id, message.author.id)
                if(message.author.id == id){ 
                    signedup = true
                }
            }

            if(event['title'] == ''){
                message.reply('There is no event pending atm').then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
            }
            else if(signedup == true){
                message.reply('You are already signed up for this event.').then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
            }
            else if(item !== '?signup') {
                const role = item.replace("?signup ", "")

                if(role == 'tank' || role == 'healer' || role == 'dps'){
                   slots = role == 'dps' ? 4 : 2
                   console.log(slots)
                   if(event[role].length >= slots){
                        message.reply("This role is currently filled").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
                   } else {
                       event[role].push(message.author.id)
                       event['signedup'].push(message.author.id)
                   }
                } else {
                    message.reply("Invalid role!").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
                    message.channel.send("Valid roles include:").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
                    message.channel.send("Tank, Healer, and DPS").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
                }
            } else {
                message.reply("Please include a role to Sign Up for the event").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
            }
            break;


        case 'resolve':
            if(event['title'] != ''){
                event = template
                message.reply("Event has been cleared").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
            } else {
                message.reply("There is no pending event").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
            }
            break;
        case 'check':
                message.delete({timeout: 1000 * 20})
                message.reply(`<:lfg:748934511244345385> ${event['title']}`).then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
            break;

// tank :Tank~1:748933412093689889
// dps 748933412093689889 

    }
})

bot.login(token)