const {Client, MessageAttachment} = require('discord.js')
const axios = require('axios')
const bot  = new Client();
const token = process.env.token;




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



// Request function for XIV Request project
const PREFIX = '?'
bot.on( 'message' , message => {
    let post = {
        item: '',
        quantity: 0,
        requestedBy: '',
        completed: false
    }
    let args = message.content.substring(PREFIX.length).split(" ");
    switch(args[0]){
        case 'Request' :
            const item = message.content 
            const filter = m => m.author.id === message.author.id;
            message.delete({timeout: 1000 * 10})
            message.reply("Please submit a quantity... Will expire in 10 seconds..").then(r => r.delete ({timeout: 10000})).catch(err => console.log(err))
            message.channel.awaitMessages(filter, { max: 1, time: 10000}).then(collected => {
                const quantity = collected.first().content
                collected.first().delete({timeout: 1000 * 10})

            // User Checks if submitted request exists and then formats request for submission.     
            if(item !== '?Request') {
                // parses given number from string to int
                const trueQuan = parseInt(quantity)      
                const itemSubmit = item.replace("?Request", "")
                post.quantity = trueQuan;
                post.requestedBy = message.author.username;
                post.requesterId = message.author.id;
                post.item = itemSubmit.trimStart()

                axios.get(`https://xivapi.com/search?string=${post.item}`)
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
    }
})

bot.login(token)
