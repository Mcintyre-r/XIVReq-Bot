const {Client, MessageAttachment, MessageEmbed, Guild} = require('discord.js')
const bot  = new Client();
const axios = require('axios');
const { CronJob } = require('cron');
require('ffmpeg')
require('ffmpeg-static')
require('dotenv').config({path:'./.env'})

const PREFIX = '?'

bot.on('ready', () =>{
    console.log('Req-Bot Online')
})

const onHour = new CronJob('0 0 * * * *',  async function statusUpdate() {
    const botChannel = await bot.channels.fetch("785363660305596416")
    const status = await botChannel.messages.fetch("788828444288614413")
    axios.get('https://xivreq.herokuapp.com/api/requests')
                    .then( requests => {
                        let unclaimed = 0
                        for(const request of requests.data.Requests){
                            if(!request.claimed){
                                unclaimed++
                            }
                        }     
                        status.edit(`There ${unclaimed===1?'is':'are'} currently **${unclaimed}** unclaimed ${unclaimed===1? 'request':'requests'}\n To view the status of or claim requests head to: https://XIVREQ.com\n Type \`?help\` for information on available bot commands.`)
                    })
                    .catch( err => {
                        console.log(err)
                    })
})
const halfHour = new CronJob('0 30 * * * *',  async function statusUpdate() {
    const botChannel = await bot.channels.fetch("785363660305596416")
    const status = await botChannel.messages.fetch("788828444288614413")
    axios.get('https://xivreq.herokuapp.com/api/requests')
                    .then( requests => {
                        let unclaimed = 0
                        for(const request of requests.data.Requests){
                            if(!request.claimed){
                                unclaimed++
                            }
                        }     
                        status.edit(`There ${unclaimed===1?'is':'are'} currently **${unclaimed}** unclaimed ${unclaimed===1? 'request':'requests'}\n To view the status of or claim requests head to: https://XIVREQ.com \n Type \`?help\` for information on available bot commands.  `)
                    })
                    .catch( err => {
                        console.log(err)
                    })
})
const twitch = new CronJob('0 * * * * *', async function (){
    const twitchChannel = await bot.channels.fetch("791486341337972747")
    const trackerMessage = await twitchChannel.messages.fetch("791488829110222879")
    const twitchUsers = {
        PhiiDelity: 'offline',
        GlemyToto: 'offline',
        OrbitalFramework: 'offline',
        Ophie_v: 'offline',
        EpicDragonzord: 'offline',
        HiImNewInTown: 'offline',
        Tyyrm: 'offline'
    } 
    for(const user of Object.keys(twitchUsers)){
        const userData = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${user}`, {
            headers: {
                'Authorization': process.env.TWITCH_AUTH,
                'Client-Id': process.env.TWITCH_SECRET
            }
        })
        if(userData.data.data.length){
            twitchUsers[user] = `**live**
        Title: ${userData.data.data[0].title}
        URL: https://www.twitch.tv/${user}
        `
        }
    }
    trackerMessage.edit(`**Ward Twitch channels** \n 
**Cucktales: **

    Phii Delity: ${twitchUsers['PhiiDelity']}
    Ophelia Varus: ${twitchUsers['Ophie_v']} 
    Nivie Carrilaut: ${twitchUsers['GlemyToto']} 

**Abusement Park: **

    Senretsu Kokousen: ${twitchUsers['HiImNewInTown']}
    Jarl Nilmerg: ${twitchUsers['EpicDragonzord']} 

**Thunder Thighs: **

    Insta Bility: ${twitchUsers['OrbitalFramework']}
    Tyyrm Mahonokishi: ${twitchUsers['Tyyrm']}
                        `)
    trackerMessage.suppressEmbeds(true)
})

const fish = new CronJob('0 * * * * *',  async function statusUpdate() {
    const botChannel = await bot.channels.fetch("791486341337972747")
    const fishMes = await botChannel.messages.fetch("")
    const time = new Date()
    const hour = time.getHours()%2
    const minute = 60-time.getMinutes()
    let hourString = ''
    let minuteString = ''
    if(hour) hourString = `1 hour ${minute? '' : 'and'}`
    if(minute) minuteString = `${minute} ${minute === 1 ? 'minute': 'minutes'} `
    if(!hour && !minute){ fishMes.edit(`**Ocean Fishing Tracker**
Fishing boat leaving now`) }
    else(fishMes.edit(`**Ocean Fishing Tracker**
Next fishing boat leaving in ${hourString} ${minuteString}`))
            
})
onHour.start()
halfHour.start()
twitch.start()
// fish.start()

bot.on('raw', async (packet) => {
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t) || packet.d.message_id !== '791174012741877760' ) return;
    
    const channel = await bot.channels.fetch(packet.d.channel_id);
    const message = await channel.messages.fetch(packet.d.message_id);
    const roles = {
        '791167942921551882' : 'Oongaboonga',
        '791168038262276156' : 'MineCrafties',
        '791168065337163796' : 'PVPers',
        // '791560712584560670' : '??????'
    }
    const keys = Object.keys(roles)

    if(!keys.includes(packet.d.emoji.id)){
        message.reactions.cache.each( react =>{
            if(!keys.includes(react._emoji.id)){
                react.remove()
            }
        })
        packet.t === 'MESSAGE_REACTION_ADD' ? message.reactions.cache.get(packet.d.emoji.id).remove().catch(error => console.error('Failed to remove reactions: ', error)): null;
        return;
    }

    const user = await message.guild.members.fetch(packet.d.user_id)
    const role = message.guild.roles.cache.find(role => role.name === roles[packet.d.emoji.id]);
    if(packet.t === 'MESSAGE_REACTION_ADD'){
        user.roles.add(role)
    } else if (packet.t === 'MESSAGE_REACTION_REMOVE'){
        user.roles.remove(role)
    }

});

// bot.on('voiceStateUpdate', async (oldMember, newMember) => {
//     const channel = await bot.channels.fetch('791561945047760937');
//     let newUserChannel = newMember.channel
//     if(newMember.channel != null){
//         if(newUserChannel.name === '??????'){
//             const connection = await channel.join();
//             let users = Array.from(channel.members.keys());
//             if(users.length > 1){
//                 const dispatcher = connection.play('./assets/numbers.mp3');
    
//                 dispatcher.on('start', () => {
//                     console.log('???????????');
//                 });
    
//                 dispatcher.on('finish', () => {
//                     console.log('audio.mp3 has finished playing!');
//                     channel.leave()
//                 });
//                 dispatcher.on('error', console.error);
//             }  
//         }
//     }
//     if(oldMember.channel != null){
//         if(oldMember.channel.name === '??????'){
//             channel.leave()
//         }
//     }
// })
// bot.on('message', async message => {
//     const user = await message.guild.members.fetch(message.author.id)
//     const role = message.guild.roles.cache.find( role => role.name === 'dear')
//     const role2 = message.guild.roles.cache.find( role => role.name === 'adventurer')
//     const role3 = message.guild.roles.cache.find( role => role.name === 'never')
//     const role4 = message.guild.roles.cache.find( role => role.name === 'trust')
//     const role5 = message.guild.roles.cache.find( role => role.name === 'elavor')
//     const role6 = message.guild.roles.cache.find( role => role.name === 'violence')
//     const tank = [ '<:war:232433632705380352>','<:GNB:598582951512506379>','<:drk:232434213612158976>','<:pld:232433599796871178>']
//     const melee = ['<:nin:232434147401007104>','<:mnk:232433560525471744>','<:drg:232433525972926464>']
//     const ranged = ['<:DNC:598583058743951360>','<:RDM:598584807051493378>', '<:mch:232434259632062464>','<:smn:232434101611659264>','<:blm:232433670110183424>', '<:brd:232433491927629824>']
//     const healer = ['<:whm:232433710828486656>', '<:sch:232433749042659328>','<:ast:232434181907546113>']
//     let mes = message.content.toLowerCase()
//     //layer 1
//     if(message.channel.id === '791774466886729758'){
//         if(mes.includes('nevermore')){
//             message.reply('Tis some visitor, tapping at my chamber door...').then( r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//             user.roles.add(role)
//             message.delete({ timeout: 5000 })
//         }
//     }
//     //layer 2
//     if(message.channel.id === '791777788302327870'){
//         if(mes.includes('macbeth')){
//             message.reply('I will not yield...').then( r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//             user.roles.add(role2)
//             message.delete({ timeout: 5000 })
//         }
//     }
//     //layer 3
//     if(message.channel.id === '791800103399849994'){
//         // console.log(user._roles)
        
//         let correct = 0
//         const answer = message.content.split(' ')
//         if(answer.length === 4){
//             if(tank.includes(answer[0])){
//                 correct+=1
//             }
//             if(melee.includes(answer[1])){
//                 correct+=1
//             }
//             if(ranged.includes(answer[2])){
//                 correct+=1
//             }
//             if(healer.includes(answer[3])){
//                 correct+=1
//             }
//             if(correct === 4){
//                 message.reply('All the panels darken, and the path is clear.. ').then( r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//                 user.roles.add(role3)
//                 message.delete({ timeout: 5000 })
//             } else {
//                 message.reply(`${correct} light panels darken`).then( r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//                 message.delete({ timeout: 5000 })
//             }
//         }
//     }
//     //layer 4
//     if(message.channel.id === '791800327925792808'){}
//     //layer 5
//     if(message.channel.id === '791800408884117534'){}
//     //layer 6
//     if(message.channel.id === '791800484834574347'){
//         if(mes.includes('inferno')){
//             message.reply('This path leads only to violence...').then( r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//             user.roles.add(role6)
//             message.delete({ timeout: 5000 })
//         }
//     }
//     //layer 7
//     if(message.channel.id === '791802171599486976'){}
// })

bot.on( 'message' , async message => {
    if(!['791171226026246145','785363660305596416','791486341337972747','791774466886729758','791777788302327870', '791800484834574347', '791800103399849994'].includes(message.channel.id) && message.author.id !== '706669135915909140'){
    } else {



    let item = message.content.toLowerCase()
    let post = {
        item: '',
        quantity: 0,
        requestedBy: ''
    }

    let args = message.content.substring(PREFIX.length).split(" ");
    const filter = m => m.author.id === message.author.id;

    
    switch(args[0].toLowerCase()){

        // submits item request for request project
        case 'request' :
            message.delete({ timeout: 20000 })
            message.reply("Please submit a quantity... Answer must be an integer... Will expire in 15 seconds..").then(r => r.delete ({timeout: 15000})).catch(err => console.log(err))
            message.channel.awaitMessages(filter, { max: 1, time: 15000}).then(collected => {
                const quantity = collected.first().content
                collected.first().delete({timeout: 1000 * 15})

            // User Checks if submitted request exists and then formats request for submission.     
            if(item !== '?request') {
                // parses given number from string to int
                const trueQuan = parseInt(quantity)      
                const itemSubmit = item.replace("?request", "")
                post.quantity = trueQuan;
                post.requestedBy = message.author.username+'#'+message.author.discriminator;
                post.requesterId = message.author.id;
                post.requesterPicture = message.author.avatar;
                post.item = itemSubmit.trimStart()
                const user = message.author
    
                axios.get(`https://xivapi.com/search?string=${post.item}&private_key=${process.env.XIVAPI}`)
                .then(response => {
                    const apiItem = response.data.Results
                    if(apiItem[0]){
                    post.item = apiItem[0].Name
                    post.itemIcon = `https://xivapi.com${apiItem[0].Icon}`
                    post.itemID = apiItem[0].ID
                    axios.post('https://xivreq.herokuapp.com/api/requests/submit', {post, user} )
                    .then(res => message.channel.send('Request submitted, check status at https://xivreq.com\n\nWhile you are waiting for your request to be claimed, please gather the materials required.\nExport the request to teamcraft via the website if you are unsure of the required materials.\nThank you :) ').then( r => r.delete ({timeout: 25000})).catch(err => console.log(err)))
                    .catch(err => message.channel.send('There was an error submitting your request. \n Please check the request and try again.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)))
                    } else {
                        message.channel.send('Cannot find item, check name submission').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
                    }
                })
                .catch(err => {
                    console.log(err)
                    message.channel.send('Cannot find item, check name submission').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
                })
            } else {
                message.channel.send('Requests cannot be empty.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
            }
            })
            break;
        case 'crafter' :
            message.delete({ timeout: 20000 })
            const user = {
                uuid: message.author.id,
                username: message.author.username,
                avatar: message.author.avatar,
                discriminator: message.author.discriminator,
                crafter: true
            }
            axios.get('https://xivreq.herokuapp.com/api/user/', { params: {'uuid': user.uuid}})
                .then( retUser => {
                    if(retUser.data){
                        if(retUser.data.crafter){
                            message.reply('You are already registered as a crafter :)').then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
                        } else {
                            message.reply("Are you sure you want to become a crafter? (response valid for 10 seconds)").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
                                message.channel.awaitMessages(filter, { max: 1, time: 10000}).then(collected => {
                                    let answer = collected.first().content
                                    collected.first().delete({timeout: 1000 * 10})
                                    answer = answer.toLowerCase()
                                    if(answer.includes('yes')){
                                        axios.put('https://xivreq.herokuapp.com/api/user/crafter', user)
                                            .then( added => message.channel.send('You are now registered as a crafter!\nYou can claim requests to complete at: https://xivreq.com\nHappy Crafting!').then( r => r.delete ({timeout: 25000})).catch(err => console.log(err)))
                                            .catch( err => {
                                                console.log(err)
                                                message.channel.send('Something went wrong while processing your request.\nPlease try again shortly, or contact Exa#0469 if the problem persists').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
                                            })
                                    } else{
                                        message.channel.send('Request Voided...').then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
                                    }
                        })}
                    } else {
                        message.reply("Are you sure you want to become a crafter? (response valid for 10 seconds)").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
                                message.channel.awaitMessages(filter, { max: 1, time: 10000}).then(collected => {
                                    let answer = collected.first().content
                                    collected.first().delete({timeout: 1000 * 10})
                                    answer = answer.toLowerCase()
                                    if(answer.includes('yes')){
                                        axios.put('https://xivreq.herokuapp.com/api/user/crafter', user)
                                            .then( added => message.channel.send('You are now registered as a crafter!\nYou can claim requests to complete at: https://xivreq.com\nHappy Crafting!').then( r => r.delete ({timeout: 25000})).catch(err => console.log(err)))
                                            .catch( err => message.channel.send('Something went wrong while processing your request.\nPlease try again shortly, or contact Exa#0469 if the problem persists').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)))
                                        } else{
                                            message.channel.send('Request Voided...').then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
                                        }
                                    })
                                }
                })
            break;
        case 'clear' :
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                console.log('Action: Clearing Messages')
                message.channel.messages.fetch({limit:100})
                .then(fetched => {
                    const notPinned = fetched.filter( fetchedMsg => !fetchedMsg.pinned)
                    message.channel.bulkDelete(notPinned, true)
                   .then(res => {message.channel.send(`Bulk deleted ${res.size} messages`).then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))}) 
                    .catch(err => {
                    message.channel.send("Well you broke something... ").then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)) 
                    console.log(err)})     
                })
                                   
            }
            break;
        case 'status' :
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send('There are Currently **0** unclaimed requests.')
            }
            break;
        case 'update' :
            message.delete({ timeout: 20000 })
                const botChannel = await bot.channels.fetch("785363660305596416")
                const status = await botChannel.messages.fetch("788828444288614413")
                axios.get('https://xivreq.herokuapp.com/api/requests')
                                .then( requests => {
                                    let unclaimed = 0
                                    for(const request of requests.data.Requests){
                                        if(!request.claimed){
                                            unclaimed++
                                        }
                                    }     
                                    status.edit(`There ${unclaimed===1?'is':'are'} currently **${unclaimed}** unclaimed ${unclaimed===1? 'request':'requests'}\n To view the status of or claim requests head to: https://XIVREQ.com\n Type \`?help\` for information on available bot commands.`)
                                })
                                .catch( err => {
                                    console.log(err)
                                })
            break;
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
                    {name: '?request ItemName', value: ['- Starts a request for chosen item.','- Will prompt for quantity once entered','- The XIVAPI is fairly smart with searches, but if wrong item is requests simply delete, and re-request with more specificity','\n']},
                    {name: '?crafter', value: ['- Used to register as a crafter within the system','- Will prompt user for confirmation that they want to become a crafter','- After using this command if you were logged in on the site you will need to relog to see changes','\n']},
                    {name: '?update', value: ['- Forces pinned message to update with current amount of unclaimed requests','- Note that this will naturally happen every thirty minutes regardless','\n']},
                    {name: '?set job', value: ['- Requests a full set of Exarchic gear','- Use job abreviations instead of full name. I.E. ?set nin, ?set drk, ?set pld, ?set sch','- Request is kept as one full request, but can still be exported to teamcraft.','\n']}
                )
                message.reply(helpEmbed).then( r => r.delete ({timeout: 60000})).catch(err => console.log(err)) 
                break;
            case 'set' :
                message.delete({ timeout: 20000 })
                if(item !== '?set') {           
                    const setSubmit = item.replace("?set", "");
                    post.quantity = 1;
                    post.requestedBy = message.author.username+'#'+message.author.discriminator;
                    post.requesterId = message.author.id;
                    post.requesterPicture = message.author.avatar;
                    post.item = setSubmit.trimStart();
                    const user = message.author;
        
                    axios.get(`https://xivreq.herokuapp.com/api/set?name=${post.item}`)
                    .then(res => {
                        const job = res.data.class
                        const jobs = {
                            drk: 'darkknight',
                            mch: 'machinist',
                            whm: 'whitemage',
                            gnb: 'gunbreaker',
                            ast: 'astrologian',
                            blm: 'blackmage',
                            brd: 'bard',
                            dnc: 'dancer',
                            drg: 'dragoon',
                            mnk: 'monk',
                            nin: 'ninja',
                            pld: 'paladin',
                            rdm: 'redmage',
                            sam: 'samurai',
                            war: 'warrior',
                            sch: 'scholar',
                            smn: 'summoner',
                        }
                        console.log(job)
                        if(job){
                        post.item = `${job.toUpperCase()} set`
                        post.itemIcon = `https://xivapi.com/cj/1/${jobs[job]}.png`
                        post.itemID = 00000
                        post.set = true
                        post.setClass = job
                        axios.post('https://xivreq.herokuapp.com/api/requests/submit', {post, user} )
                        .then(res => message.channel.send('Request submitted, check status at https://xivreq.com\n\nWhile you are waiting for your request to be claimed, please gather the materials required.\nExport the request to teamcraft via the website if you are unsure of the required materials.\nThank you :) ').then( r => r.delete ({timeout: 25000})).catch(err => console.log(err)))
                        .catch(err => message.channel.send('There was an error submitting your request. \n Please check the request and try again.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)))
                        } else {
                            message.channel.send('Cannot find set, check job submitted').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        message.channel.send('Cannot find set, check job submitted').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
                    })
                } else {
                    message.channel.send('Requests cannot be empty.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
                }
                
                break;   
            case 'reaction':
                    console.log('Action: Showing Reaction info')
                    const reactEmbed = new MessageEmbed()
                        .setColor('#FFA500')
                        .setAuthor('Role Selection')
                        .setDescription('React to this message to obtain the following roles: \n')
                        .addFields(
                            {name: '<:PVP:791168065337163796> : PVPers', value:['Access to the PVP channel','--'], inline: false},
                            {name: '<:ARK:791167942921551882> : Oongaboonga', value:['Access to the Ark Survival Evolved channel','--'], inline: false},
                            {name: '<:MC:791168038262276156> : Minecrafties', value:['Access to the Minecraft Channel','--'], inline: false},
                        )
                    message.channel.send(reactEmbed).then( mes => {
                        mes.react(message.guild.emojis.cache.get('791168065337163796'))
                        mes.react(message.guild.emojis.cache.get('791167942921551882'))
                        mes.react(message.guild.emojis.cache.get('791168038262276156'))
                    })
                break; 
            case 'setMessage':
                message.channel.send('dumb bitch')
                break; 
//             case 'layer1':
//                 message.channel.send('The numbers Warden, what do they mean?')
//                 break;
//             case 'layer2':
//                 message.channel.send(`**A**h, distinctly I remember it was in the bleak **December**;

// Fayaddai, mzp fayaddai, mzp fayaddai,
// Odqqbe uz ftue bqffk bmoq rday pmk fa pmk,
// Fa ftq xmef ekxxmnxq ar dqoadpqp fuyq;
// Mzp mxx agd kqefqdpmke tmhq xustfqp raaxe
// Ftq imk fa pgefk pqmft. Agf, agf, nduqr omzpxq!
// Xurq'e ngf m imxwuzs etmpai, m baad bxmkqd,
// Ftmf efdgfe mzp rdqfe tue tagd gbaz ftq efmsq,
// Mzp ftqz ue tqmdp za yadq. Uf ue m fmxq
// Faxp nk mz upuaf, rgxx ar eagzp mzp rgdk,
// Euszurkuzs zaftuzs.
//                     `)
//                 break;
//             case 'layer3':
//                 message.channel.send(`Lying before you are four panels of **light**, and enscribed before them reads:
                
// "From front to back your brave **party** ventures forth"
// `)
//                 break;
//             case 'layer6':
//                 message.channel.send('Everyone on this journey has their roles to play...')
//                 break;
        }}
})   
 
bot.login(process.env.discordAPI)