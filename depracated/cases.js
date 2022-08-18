
// // submits item request for request project
// case 'request' :
//     message.delete({ timeout: 20000 })
//     message.reply("Please submit a quantity... Answer must be an integer... Will expire in 15 seconds..").then(r => r.delete ({timeout: 15000})).catch(err => console.log(err))
//     message.channel.awaitMessages(filter, { max: 1, time: 15000}).then(collected => {
//         const quantity = collected.first().content
//         collected.first().delete({timeout: 1000 * 15})

//     // User Checks if submitted request exists and then formats request for submission.     
//     if(item !== '!request') {
//         // parses given number from string to int
//         const trueQuan = parseInt(quantity)      
//         const itemSubmit = item.replace("!request", "")
//         post.quantity = trueQuan;
//         post.requestedBy = message.author.username+'#'+message.author.discriminator;
//         post.requesterId = message.author.id;
//         post.requesterPicture = message.author.avatar;
//         post.item = itemSubmit.trimStart()
//         const user = message.author

//         axios.get(`https://xivapi.com/search?string=${post.item}&private_key=${process.env.XIVAPI}`)
//         .then(response => {
//             const apiItem = response.data.Results
//             if(apiItem[0]){
//             post.item = apiItem[0].Name
//             post.itemIcon = `https://xivapi.com${apiItem[0].Icon}`
//             post.itemID = apiItem[0].ID
//             axios.post('https://xivreq.herokuapp.com/api/requests/submit', {post, user} )
//             .then(res => message.channel.send('Request submitted, check status at https://xivreq.com\n\nWhile you are waiting for your request to be claimed, please gather the materials required.\nExport the request to teamcraft via the website if you are unsure of the required materials.\nThank you :) ').then( r => r.delete ({timeout: 25000})).catch(err => console.log(err)))
//             .catch(err => message.channel.send('There was an error submitting your request. \n Please check the request and try again.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)))
//             } else {
//                 message.channel.send('Cannot find item, check name submission').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
//             }
//         })
//         .catch(err => {
//             console.log(err)
//             message.channel.send('Cannot find item, check name submission').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
//         })
//     } else {
//         message.channel.send('Requests cannot be empty.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
//     }
//     })
// break;
// case 'crafter' :
//     message.delete({ timeout: 20000 })
//     const user = {
//         uuid: message.author.id,
//         username: message.author.username,
//         avatar: message.author.avatar,
//         discriminator: message.author.discriminator,
//         crafter: true
//     }
//     axios.get('https://xivreq.herokuapp.com/api/user/', { params: {'uuid': user.uuid}})
//         .then( retUser => {
//             if(retUser.data){
//                 if(retUser.data.crafter){
//                     message.reply('You are already registered as a crafter :)').then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//                 } else {
//                     message.reply("Are you sure you want to become a crafter? (response valid for 10 seconds)").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//                         message.channel.awaitMessages(filter, { max: 1, time: 10000}).then(collected => {
//                             let answer = collected.first().content
//                             collected.first().delete({timeout: 1000 * 10})
//                             answer = answer.toLowerCase()
//                             if(answer.includes('yes')){
//                                 axios.put('https://xivreq.herokuapp.com/api/user/crafter', user)
//                                     .then( added => message.channel.send('You are now registered as a crafter!\nYou can claim requests to complete at: https://xivreq.com\nHappy Crafting!').then( r => r.delete ({timeout: 25000})).catch(err => console.log(err)))
//                                     .catch( err => {
//                                         console.log(err)
//                                         message.channel.send('Something went wrong while processing your request.\nPlease try again shortly, or contact Exa#0469 if the problem persists').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
//                                     })
//                             } else{
//                                 message.channel.send('Request Voided...').then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//                             }
//                 })}
//             } else {
//                 message.reply("Are you sure you want to become a crafter? (response valid for 10 seconds)").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//                         message.channel.awaitMessages(filter, { max: 1, time: 10000}).then(collected => {
//                             let answer = collected.first().content
//                             collected.first().delete({timeout: 1000 * 10})
//                             answer = answer.toLowerCase()
//                             if(answer.includes('yes')){
//                                 axios.put('https://xivreq.herokuapp.com/api/user/crafter', user)
//                                     .then( added => message.channel.send('You are now registered as a crafter!\nYou can claim requests to complete at: https://xivreq.com\nHappy Crafting!').then( r => r.delete ({timeout: 25000})).catch(err => console.log(err)))
//                                     .catch( err => message.channel.send('Something went wrong while processing your request.\nPlease try again shortly, or contact Exa#0469 if the problem persists').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)))
//                                 } else{
//                                     message.channel.send('Request Voided...').then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
//                                 }
//                             })
//                         }
//         })
//     break;
// case 'status' :
//     if (message.member.hasPermission("MANAGE_MESSAGES")) {
//     message.channel.send('There are Currently **0** unclaimed requests.')
//     }
// break;
// case 'update' :
//     message.delete({ timeout: 20000 })
//     const botChannel = await bot.channels.fetch("898766114190950440")
//     const status = await botChannel.messages.fetch("898771122638708767")
//     axios.get('https://xivreq.herokuapp.com/api/requests')
//         .then( requests => {
//             let unclaimed = 0
//             for(const request of requests.data.Requests){
//                 if(!request.claimed){
//                     unclaimed++
//                 }
//             }     
//             status.edit(`There ${unclaimed===1?'is':'are'} currently **${unclaimed}** unclaimed ${unclaimed===1? 'request':'requests'}\n To view the status of or claim requests head to: https://XIVREQ.com\n Type \`?help\` for information on available bot commands.`)
//         })
//         .catch( err => {
//             console.log(err)
//         })
// break;
// case 'help' :
//     console.log('Action: Offering help')
//     message.delete({timeout: 1000 * 20})
//     const helpEmbed = new MessageEmbed()
//     .setColor('#FFA500')
//     .setAuthor('Bot Commands')
//     .setTitle('Enter any of the following commands:')
//     .setDescription('The prefix for all commands is ? followed by the command (I.E. ?help) Then any parameters required.')
//     .addFields(
//         {name: '?help', value:['- Returns this reply showing all possible commands','\n']},
//         {name: '?request ItemName', value: ['- Starts a request for chosen item.','- Will prompt for quantity once entered','- The XIVAPI is fairly smart with searches, but if wrong item is requests simply delete, and re-request with more specificity','\n']},
//         {name: '?crafter', value: ['- Used to register as a crafter within the system','- Will prompt user for confirmation that they want to become a crafter','- After using this command if you were logged in on the site you will need to relog to see changes','\n']},
//         {name: '?update', value: ['- Forces pinned message to update with current amount of unclaimed requests','- Note that this will naturally happen every thirty minutes regardless','\n']},
//         {name: '?set job', value: ['- Requests a full set of Exarchic gear','- Use job abreviations instead of full name. I.E. ?set nin, ?set drk, ?set pld, ?set sch','- Request is kept as one full request, but can still be exported to teamcraft.','\n']}
//     )
//     message.reply(helpEmbed).then( r => r.delete ({timeout: 60000})).catch(err => console.log(err)) 
// break;
// case 'set' :
//     message.delete({ timeout: 20000 })
//     if(item !== '!set') {           
//         const setSubmit = item.replace("!set", "");
//         post.quantity = 1;
//         post.requestedBy = message.author.username+'#'+message.author.discriminator;
//         post.requesterId = message.author.id;
//         post.requesterPicture = message.author.avatar;
//         post.item = setSubmit.trimStart();
//         const user = message.author;

//         axios.get(`https://xivreq.herokuapp.com/api/set?name=${post.item}`)
//         .then(res => {
//             const job = res.data.class
//             const jobs = {
//                 drk: 'darkknight',
//                 mch: 'machinist',
//                 whm: 'whitemage',
//                 gnb: 'gunbreaker',
//                 ast: 'astrologian',
//                 blm: 'blackmage',
//                 brd: 'bard',
//                 dnc: 'dancer',
//                 drg: 'dragoon',
//                 mnk: 'monk',
//                 nin: 'ninja',
//                 pld: 'paladin',
//                 rdm: 'redmage',
//                 sam: 'samurai',
//                 war: 'warrior',
//                 sch: 'scholar',
//                 smn: 'summoner',
//             }
//             console.log(job)
//             if(job){
//             post.item = `${job.toUpperCase()} set`
//             post.itemIcon = `https://xivapi.com/cj/1/${jobs[job]}.png`
//             post.itemID = 00000
//             post.set = true
//             post.setClass = job
//             axios.post('https://xivreq.herokuapp.com/api/requests/submit', {post, user} )
//             .then(res => message.channel.send('Request submitted, check status at https://xivreq.com\n\nWhile you are waiting for your request to be claimed, please gather the materials required.\nExport the request to teamcraft via the website if you are unsure of the required materials.\nThank you :) ').then( r => r.delete ({timeout: 25000})).catch(err => console.log(err)))
//             .catch(err => message.channel.send('There was an error submitting your request. \n Please check the request and try again.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)))
//             } else {
//                 message.channel.send('Cannot find set, check job submitted').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
//             }
//         })
//         .catch(err => {
//             console.log(err)
//             message.channel.send('Cannot find set, check job submitted').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
//         })
//     } else {
//         message.channel.send('Requests cannot be empty.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))
//     }
    
// break;   

// case 'reaction':
//     console.log('Action: Showing Reaction info')
//     const reactEmbed = new MessageEmbed()
//         .setColor('#FFA500')
//         .setAuthor('Role Selection')
//         .setDescription('React to this message to obtain the following roles: \n')
//         .addFields(
//             {name: '<:PVP:791168065337163796> : PVPers', value:['Access to the PVP channel','--'], inline: false},
//             {name: '<:ARK:791167942921551882> : Oongaboonga', value:['Access to the Ark Survival Evolved channel','--'], inline: false},
//             {name: '<:MC:791168038262276156> : Minecrafties', value:['Access to the Minecraft Channel','--'], inline: false},
//         )
//     message.channel.send(reactEmbed).then( mes => {
//         mes.react(message.guild.emojis.cache.get('791168065337163796'))
//         mes.react(message.guild.emojis.cache.get('791167942921551882'))
//         mes.react(message.guild.emojis.cache.get('791168038262276156'))
//     })
// break; 