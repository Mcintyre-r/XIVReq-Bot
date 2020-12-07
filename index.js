const {Client, MessageAttachment, MessageEmbed, Guild} = require('discord.js')
const bot  = new Client();
const axios = require('axios')
require('dotenv').config({path:'./.env'})

const PREFIX = '?'

bot.on('ready', () =>{
    console.log('Req-Bot Online')
})
 
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
                post.requestedBy = message.author.username+'#'+message.author.discriminator;
                post.requesterId = message.author.id;
                post.requesterPicture = message.author.avatar;
                post.item = itemSubmit.trimStart()
                const user = message.author
    
                axios.get(`https://xivapi.com/search?string=${post.item}&private_key=73bc4666b8044a95acbe3b469b59c0079beaf9666d164a35a68846fbd4f99f2f`)
                .then(response => {
                    const apiItem = response.data.Results
                    if(apiItem[0]){
                    post.item = apiItem[0].Name
                    post.itemIcon = `https://xivapi.com${apiItem[0].Icon}`
                    post.itemID = apiItem[0].ID
                    axios.post('https://xivreq.herokuapp.com/api/requests/submit', {post, user} )
                    .then(res => message.channel.send('Request submitted, check status at http://xivreq.com\n\nWhile you are waiting for your request to be claimed, please gather the materials required.\nExport the request to teamcraft via the website if you are unsure of the required materials.\nThank you :) ').then( r => r.delete ({timeout: 25000})).catch(err => console.log(err)))
                    .catch(err => message.channel.send('There was an error submitting your request. \n Please check the request and try again.').then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)))
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

        case 'clear' :
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                console.log('Action: Clearing Messages')
                message.channel.bulkDelete(100, true)
                   .then(res => {message.channel.send(`Bulk deleted ${res.size} messages`).then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))}) 
                    .catch(err => {
                    message.channel.send("Well you broke something... ").then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)) 
                    console.log(err)})                        
            }
            break;
        
    }
}
})   
 
bot.login(process.env.discordAPI)