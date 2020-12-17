const {Client, MessageAttachment, MessageEmbed, Guild} = require('discord.js')
const bot  = new Client();
const axios = require('axios');
const { CronJob } = require('cron');
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

onHour.start()
halfHour.start()


bot.on( 'message' , async message => {
    if(message.channel.id !== '785363660305596416' && message.author.id !== '706669135915909140'){
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
                    {name: '?update', value: ['- Forces pinned message to update with current amount of unclaimed requests','- Note that this will naturally happen every thirty minutes regardless','\n']}
                )
                message.reply(helpEmbed).then( r => r.delete ({timeout: 60000})).catch(err => console.log(err)) 
                break;
            case 'set' :
                if(item !== '?set') {
                    // parses given number from string to int
                         
                    const setSubmit = item.replace("?set", "")
                    post.quantity = 1;
                    post.requestedBy = message.author.username+'#'+message.author.discriminator;
                    post.requesterId = message.author.id;
                    post.requesterPicture = message.author.avatar;
                    post.item = setSubmit.trimStart()
                    const user = message.author
        
                    axios.get(`https://xivreq.herokuapp.com/api/set?name=${setSubmit}`)
                    .then(setClass => {
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
                        if(setClass){
                        post.item = `${setClass.toUppercase()} set`
                        post.itemIcon = `https://xivapi.com/cj/1/${jobs[setClass]}.png`
                        post.itemID = 00000
                        post.set = true
                        post.setClass = setClass
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
    }
}
})   
 
bot.login(process.env.discordAPI)