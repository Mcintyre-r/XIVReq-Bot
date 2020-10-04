const {Client, MessageAttachment, MessageEmbed, Guild} = require('discord.js')
const axios = require('axios')
const bot  = new Client();
const Queue = require('smart-request-balancer');
const CronJob = require('cron').CronJob
// const monado = require('./assets/monado.mp4')
require('ffmpeg')
require('ffmpeg-static')
require('dotenv').config()

// Queue for handling api requests
const queue = new Queue({
    rules: {                     // Describing our rules by rule name
      common: {                  // Common rule. Will be used if you won't provide rule argument
        rate: 10,                // Allow to send 10 messages
        limit: 1,                // per 1 second
        priority: 1,             // Rule priority. The lower priority is, the higher chance that
                                 // this rule will execute faster 
      }
    },
    default: {                   // Default rules (if provided rule name is not found)
      rate: 10,
      limit: 1
    },
    overall: {                   // Overall queue rates and limits
      rate: 10,
      limit: 1
    },
    retryTime: 10,              // Default retry time, in seconds. Can be configured in retry fn
    ignoreOverallOverheat: true  // Should we ignore overheat of queue itself
  })

  // Compare function to sort
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

// state for event
let event = {
    'title': '',
    'time': '',
    'viewer': []
}
// template to reset event
const template = {
    'title': '',
    'time': '',
    'viewer': []
}


const PREFIX = '?'



bot.on('ready', () =>{
    console.log('Exa-Bot Online')
})


const job = new CronJob('0 0 0 * * 1', async function(){
    const textChat = await bot.channels.fetch('716015727630483579')
    const monadoVid = new MessageAttachment('https://cdn.discordapp.com/attachments/407627504598253580/760254205868113940/monado.mp4')
    textChat.send(monadoVid)
    console.log('Job: MONADO MONDAYYYY')
})

const movieJob = new CronJob('0 0 20 * * 5', async function(){
    const movieChat = await bot.channels.fetch('761671840845791242')
    movieChat.send('<@&761665699407200286> Movie starting in one hour!')
})

const TusdayJob = new CronJob('0 30 19 * * 2', async function(){
    const raidChat = await bot.channels.fetch('755361261679804496')
    raidChat.send('<@&755361410074017843> Raid in 30')
})
const MondayJob = new CronJob('0 30 20 * * 1', async function(){
    const raidChat = await bot.channels.fetch('755361261679804496')
    raidChat.send('<@&755361410074017843> Raid in 30')
})
const ThursdayJob = new CronJob('0 30 20 * * 4', async function(){
    const raidChat = await bot.channels.fetch('755361261679804496')
    raidChat.send('<@&755361410074017843> Raid in 30')
})

job.start()
TusdayJob.start()
MondayJob.start()
ThursdayJob.start()
movieJob.start()

bot.on('message',async req => {
    const attachment = new MessageAttachment('https://cdn.discordapp.com/attachments/313148981502935040/697154625815707798/image0.gif');
    const channel = await bot.channels.fetch('716015727630483580');
    const raidChannel = await bot.channels.fetch('747097374312103977')
    let users = Array.from(channel.members.keys());
    let raidUsers = Array.from(raidChannel.members.keys());

    message = req.content.toLowerCase()

    words = ["mean","bully" , "rude" , "bulli", "rood", 'm e a n']
    words.forEach( e => {
        if(message.includes(e) && req.author.id == 211556765492314112){
            i=0
            console.log('Bullying Sophia')
            while(i<10){
                req.channel.send("<:peepo:738255120554262575>".repeat(10))
                i++
            }
            
        }
    })
    // list of clip names
    const clips = ['women', 'scissors','eekum bokum','really gay','law','gay','center', 'news', 'army', 'leader', 'yeet', 'lid', 'console', 'joker', 'rainbow', 'reyn', 'head', 'good thing', 'tough', 'jump', 'ooph', 'oof', 'vsauce', 'mario']
    clips.forEach( async e =>{
        if(message.includes(e) && req.author.id != 738254569238167643){
            if(e === 'eekum bokum'){
                req.channel.send("<a:mumbo:751666416335192114> *eekum bokum* <a:mumbo:751666416335192114>".repeat(3))
            }
            if(raidUsers.length >= 1 && req.author.id === '59423394055069696'){
                const conn = await raidChannel.join();
                const dispatcher = conn.play(`./assets/${e}.mp3`);
    
                dispatcher.on('start', () => {
                    console.log('Clip:', e);
                });
    
                dispatcher.on('finish', () => {
                    raidChannel.leave()
                });
                dispatcher.on('error', console.error);
            }  
            else if(users.length >= 1){
                const conn = await channel.join();
                const dispatcher = conn.play(`./assets/${e}.mp3`);
    
                dispatcher.on('start', () => {
                    console.log('Clip:', e);
                });
    
                dispatcher.on('finish', () => {
                    channel.leave()
                });
                dispatcher.on('error', console.error);
            }  
        }
    })

    if(req.content.includes("uptime")){
        console.log('Uptime')
        req.channel.send(attachment)
    }
    
})


bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    const channel = await bot.channels.fetch('716015727630483580');
    const raidChannel = await bot.channels.fetch('747097374312103977')
    const textChannel = await bot.channels.fetch('753831898559545384');
    const role = channel.guild.roles.cache.find(role => role.name === 'Voice');
    const serverMembers = []
    const channelMembers = []
    console.log('Action: Adding and Removing Roles')

    for(let e of channel.guild.members.cache.keys()){
        serverMembers.push(e)
    }
    for(let e of raidChannel.members.keys()){
        channelMembers.push(e)
    }
    for(let i of channel.members.keys()){
        channelMembers.push(i)
    }
    if(channelMembers.length === 0){
        console.log('Action: Channel empty clearing Voice Chatter.')
        textChannel.bulkDelete(100, true)                      
        }
    for(let i of serverMembers){
        if(i){
            let member = channel.guild.members.cache.get(i)
            if(channelMembers.includes(i)){
                member.roles.add(role)
            } else {
                member.roles.remove(role)
            }
        }
    }
})


bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    const channel = await bot.channels.fetch('722372816619569263');
    const choices = ['./assets/deja.mp3','./assets/burn.mp3','./assets/kill.mp3','./assets/rem.mp3','./assets/gas.mp3','./assets/night.mp3','./assets/run.mp3']
    const index = Math.floor(Math.random() * choices.length)
    let newUserChannel = newMember.channel
    if(newMember.channel != null){
        if(newUserChannel.name === 'Initial D-tention'){
            const connection = await channel.join();
            let users = Array.from(channel.members.keys());
            if(users.length > 1){
                const dispatcher = connection.play(choices[index]);
    
                dispatcher.on('start', () => {
                    console.log('audio.mp3 is now playing!', choices[index]);
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
    }
    if(oldMember.channel != null){
        if(oldMember.channel.name === 'Initial D-tention'){
            channel.leave()
        }
    }

})





bot.on( 'message' , async message => {
    const item = message.content.toLowerCase()
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

        // submits item request for request project
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
        
        // returns a list of members in ward fc that either do or dont have the queried minion
        case 'minion' :
            message.reply("Specify True or False... Expires in 10s...").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
            collected = await message.channel.awaitMessages(filter, { max: 1, time: 10000})
            bool = collected.first().content
            collected.first().delete({timeout: 1000 * 10})
            if(item !== '?minion') {
                const MinSubmit = item.replace("?minion ", "")
                message.channel.send('Please Wait I\'m doing my best...').then( r => r.delete ({timeout: 40000})).catch(err => console.log(err))
                console.log('Action: Searching for', MinSubmit)
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
        
        // returns a list of members in ward fc that either do or dont have the queried mount
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
        
        // clears last 100 messages in channel called
        case 'clear' :
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                console.log('Action: Clearing Messages')
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
        
        // list of commands
        case 'help' :
            console.log('Action: Offering help')
            message.delete({timeout: 1000 * 20})
            const helpEmbed = new MessageEmbed()
            .setColor('#FFA500')
            .setAuthor('Bot Commands')
            .setTitle('Enter any of the following commands:')
            .setDescription('The prefix for all commands is ? followed by the command (I.E. ?help) Then any parameters required.')
            .addFields(
                {name: '?help', value:['- Returns this reply showing all possible commands','\n']},
                {name: '?minion <argument>', value:['- Returns a list of all members in the ward FC that either do or don\'t have the specified minion','- Takes one argument that is a minion name', '- Example: ?minion Goobbue Sproutling','\n']},
                {name: '?mount <argument>', value:['- Returns a list of all members in the ward FC that either do or don\'t have the specified mount','- Takes one argument that is a mount name', '- Example: ?mount Flying Chair','\n']},
                {name: '?Mincraft', value:['- Return a short embed containing all info regarding Exa\'s Minecraft Server','\n']},
                {name: '?setevent <argument>', value:['- Creates a FFXIV party event, cannot be used if one is currently pending', '- Takes a single arguement that is the name of the event.', '- Example: ?setevent Shiva Unreal','\n']},
                {name: '?signup <arguement>', value:['- Registers you for FFXIV part if one is currently pending, cannot use if no party is pending, or already signed up','- Takes a single arguement or the role you would like to sign up as', '- Example: ?signup Tank','\n']},
                {name: '?resolve', value: ['- Ends the current pending event, and resets back to before it was made','\n']},
                {name: '?check', value: ['- Returns the current event if one is pending','\n']},
                {name: '?clear', value: ['- Clears the channel of messages, Can only be used by Exa.','\n']},
                {name: '?request <arguement>', value: ['- Currently being worked on.','\n']}

            )
            message.reply(helpEmbed)
            break;
        
        // creates a movie event 
        case 'setevent':

            message.reply("Please submit a time... Will expire in 10 seconds..").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
            message.channel.awaitMessages(filter, { max: 1, time: 10000}).then(collected => {
                const time = collected.first().content
                collected.first().delete({timeout: 1000 * 10})
            if(event['title'] == ''){
                if(item !== '?setevent') {
                    message.delete({timeout: 1000 * 20})
                    const rec = message.content.replace("?setevent ", "")
                    event['title'] = rec
                    event['time'] = time
                    message.reply("Record has been updated").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
                }
                else{
                    message.reply("Please include a title for the event").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 
                } 
            } else {
                message.reply("There is already a pending event").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
            }
            })
            break;
        
        // registers user for movie event, and gives them the appropriate role
        case 'signup':
            // console.log(event)
            let signedup = false
            for(let id of event['viewer']){
                // console.log(id, message.author.id)
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
            else {
                       event['viewer'].push(message.author.id)
                       console.log(event['viewer'])
                       const user = message.guild.members.cache.get(message.author.id)
                       const role = message.guild.roles.cache.find(role => role.name === 'Signed up for Movie');
                       user.roles.add(role)
                       message.reply("You are registered for the movie").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err)) 

            }
            break;
        
        // clears any pending event and resets roles
        case 'resolve':
            message.delete({timeout: 1000 * 20})
            if(event['title'] != ''){
                console.log(message.guild.members.cache.keys())
                for(let i of message.guild.members.cache.keys()){
                    // console.log(i)
                    const user = message.guild.members.cache.get(i)
                    const role = message.guild.roles.cache.find(role => role.name === 'Signed up for Movie');
                    user.roles.remove(role)
                }
                
                event = template
                message.reply("Event has been cleared").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
            } else {
                message.reply("There is no pending event").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
            }
            break;

        // info about currently pending movie event
        case 'movie':
                message.delete({timeout: 1000 * 20})
                if(event['title'] != ''){
                message.reply(`Upcoming Movie is ${event['title']}, at ${event['time']}`).then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
                } else {
                    message.reply("There is no pending event").then( r => r.delete ({timeout: 20000})).catch(err => console.log(err))
                }
            break;

        // info for minecraft server
        case 'minecraft':
            console.log('Action: Showing Minecraft info')
            const mineEmbed = new MessageEmbed()
                .setColor('#FFA500')
                .setAuthor('Minecraft Server Info')
                .setTitle('Info to setup:')
                .setURL('https://www.curseforge.com/minecraft/modpacks/valhelsia-3')
                .setDescription('The following info is everything needed to join the server.')
                .addFields(
                    {name: 'Twitch App', value:'https://www.twitch.tv/downloads/', inline: true},
                    {name: 'Mod Pack', value: ['Valhelsia 3', 'Choose version 3.0.14'], inline: true},
                    {name: 'Server Address', value: 'exa-li.com'},
                    {name: 'Set Memory to atleast 7gb', value: 'https://puu.sh/GmPYE/a1780d409e.png'},
                    {name: 'Addition Mods', value: ['https://www.curseforge.com/minecraft/mc-mods/morevanillalib/files/3003835','https://www.curseforge.com/minecraft/mc-mods/vanilla-hammers-forge/files/2991221']},
                    {name: 'If you need help ping:', value: '@Exa'}
                )
            message.reply(mineEmbed)
            break;

// tank :Tank~1:748933412093689889
// dps 748933412093689889 

    }
})

bot.login(process.env.discordAPI)