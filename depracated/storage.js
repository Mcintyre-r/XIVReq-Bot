
// const requestUpdate = new CronJob('0 * * * * *',  async function statusUpdate() {
//     const botChannel = await bot.channels.fetch("898766114190950440")
//     const status = await botChannel.messages.fetch("898771122638708767")
//     axios.get('https://xivreq.herokuapp.com/api/requests')
//                     .then( requests => {
//                         let unclaimed = 0
//                         for(const request of requests.data.Requests){
//                             if(!request.claimed){
//                                 unclaimed++
//                             }
//                         }     
//                         status.edit(`There ${unclaimed===1?'is':'are'} currently **${unclaimed}** unclaimed ${unclaimed===1? 'request':'requests'}\n To view the status of or claim requests head to: https://XIVREQ.com\n Type \`?help\` for information on available bot commands.`)
//                     })
//                     .catch( err => {
//                         console.log(err)
//                     })
// })

// const twitch = new CronJob('0 * * * * *', async function (){
//     const twitchChannel = await bot.channels.fetch("791486341337972747")
//     const trackerMessage = await twitchChannel.messages.fetch("792920520277360701")
//     const twitchUsers = {
//         PhiiDelity: 'offline',
//         GlemyToto: 'offline',
//         OrbitalFramework: 'offline',
//         EpicDragonzord: 'offline',
//         HiImNewInTown: 'offline',
//         Tyyrm: 'offline'
//     } 
//     const count = {
//         CuckTales: 0,
//         AbusementPark: 0,
//         ThunderThighs: 0
//     }

//     const members = {
//         CuckTales: ['PhiiDelity', 'GlemyToto'],
//         AbusementPark: ['EpicDragonzord', 'HiImNewInTown'],
//         ThunderThighs: ['Tyyrm']
//     }
//     const multi = {
//         CuckTales: 'https://multistre.am/',
//         AbusementPark: 'https://multistre.am/',
//         ThunderThighs: 'https://multistre.am/'
//     }


//     for(const user of Object.keys(twitchUsers)){
//         const userData = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${user}`, {
//             headers: {
//                 'Authorization': process.env.TWITCH_AUTH,             
//                 'client-Id':process.env.TWITCH_SECRET
//             }
//         }).catch(err =>  console.log(err))
//         if(userData.data.data.length){
//             for(const member of Object.keys(members)){
//                 if(members[member].includes(user)) {
//                     count[member] = count[member]+1
//                     multi[member] = multi[member] + user + '/'
//                 }
//             }
//             twitchUsers[user] = `**live**
//         Title: ${userData.data.data[0].title}
//         URL: https://www.twitch.tv/${user}
//         `
//         }
//     }
//     trackerMessage.edit(`**Ward Twitch channels** \n 
// **Cucktales: **
//     ${count.CuckTales > 1 ? 'Multi: ' + multi.CuckTales + '\n' : ''}
//     Phii Delity: ${twitchUsers['PhiiDelity']}
//     Nivie Carrilaut: ${twitchUsers['GlemyToto']} 

// **Abusement Park: **
//     ${count.AbusementPark > 1 ? 'Multi: '+multi.AbusementPark + '\n' : ''}
//     Senretsu Kokousen: ${twitchUsers['HiImNewInTown']}
//     Jarl Nilmerg: ${twitchUsers['EpicDragonzord']} 

// **Thunder Thighs: **
//     ${count.ThunderThighs > 1 ? 'Multi: ' + multi.ThunderThighs + '\n': ''}
//     Tyyrm Mahonokishi: ${twitchUsers['Tyyrm']}

// **Others: **
//     Insta Bility: ${twitchUsers['OrbitalFramework']}
//                         `)
//     trackerMessage.suppressEmbeds(true)
// })

// const fish = new CronJob('0 * * * * *',  async function statusUpdate() {
//     const botChannel = await bot.channels.fetch("898766114190950440")
//     const fishMes = await botChannel.messages.fetch("899421470244110336")
//     const time = new Date()
//     const hour = time.getHours()%2
//     const minute = 60-time.getMinutes()
//     let hourString = ''
//     let minuteString = ''
//     if(hour === 0) hourString = `1 hour ${minute? 'and' : ''}`
//     if(minute) minuteString = `${minute} ${minute === 1 ? 'minute': 'minutes'} `
//     if(!hour && !minute){ fishMes.edit(`**Ocean Fishing Tracker**
// Fishing boat leaving now`) }
//     else(fishMes.edit(`**Ocean Fishing Tracker**
// Next fishing boat leaving in ${hourString} ${minuteString}`))

// })
// requestUpdate.start()
// twitch.start()
// fish.start()

// const test = new CronJob('0 * * * * *', async function () {
//     const roleChannel = await bot.channels.fetch("791171226026246145");
//     const roleMes = await roleChannel.messages.fetch("791174012741877760");
// //     // roleMes.reactions.cache.each( react => {
// //     //     if(react.emoji.id === '791560712584560670'){
// //     //         react.remove()
// //     //     }
// //     // })

//         const reactEmbed = new MessageEmbed()
//                         .setColor('#FFA500')
//                         .setAuthor('Role Selection')
//                         .setDescription('React to this message to obtain the following roles: \n')
//                         .addFields(
//                             {name: '<:PVP:791168065337163796> : PVPers', value:['Access to the PVP channel','--'], inline: false},
//                             {name: '<:ARK:791167942921551882> : Oongaboonga', value:['Access to the Ark Survival Evolved channel','--'], inline: false},
//                             {name: '<:MC:791168038262276156> : Minecrafties', value:['Access to the Minecraft channel','--'], inline: false},
//                             {name: '<:tabletop:805672549634932746> : Tabletop', value:['Grants Tabletop Sim role','--'], inline: false},
//                         )
//         roleMes.edit(reactEmbed)





// //     roleMes.react('805672549634932746')

// })
// test.start()
// bot.on('raw', async (packet) => {
//     if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t) || packet.d.message_id !== '791174012741877760' ) return;
    
//     const channel = await bot.channels.fetch(packet.d.channel_id);
//     const message = await channel.messages.fetch(packet.d.message_id);
//     const roles = {
//         '791167942921551882' : 'Oongaboonga',
//         '791168038262276156' : 'MineCrafties',
//         '791168065337163796' : 'PVPers',
//         '805672549634932746' : 'Tabletop'
//         // '791560712584560670' : '??????'
//     }
//     const keys = Object.keys(roles)
//     console.log(packet.d.emoji.id)
//     if(!keys.includes(packet.d.emoji.id)){
//         message.reactions.cache.each( react =>{
//             if(!keys.includes(react._emoji.id)){
//                 react.remove()
//             }
//         })
//         packet.t === 'MESSAGE_REACTION_ADD' ? message.reactions.cache.get(packet.d.emoji.id).remove().catch(error => console.error('Failed to remove reactions: ', error)): null;
//         return;
//     }

//     const user = await message.guild.members.fetch(packet.d.user_id)
//     const role = message.guild.roles.cache.find(role => role.name === roles[packet.d.emoji.id]);
//     if(packet.t === 'MESSAGE_REACTION_ADD'){
//         user.roles.add(role)
//     } else if (packet.t === 'MESSAGE_REACTION_REMOVE'){
//         user.roles.remove(role)
//     }

// });





// const filter = m => m.author.id === mes.author.id;


    // let item = mes.content.toLowerCase()
    // let post = {
    //     item: '',
    //     quantity: 0,
    //     requestedBy: ''
    // }
