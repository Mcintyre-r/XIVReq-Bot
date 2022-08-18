
var cluster = require('cluster');
if (cluster.isMaster) {
   var i = 0;
   for (i; i< 1; i++){
     cluster.fork();
   }
   //if the worker dies, restart it.
   cluster.on('exit', function(worker){
      console.log('Worker ' + worker.id + ' died..');
      cluster.fork();
   });
}
else{
    const {Client, MessageAttachment, MessageEmbed, Guild, MessageActionRow, MessageButton,MessageSelectMenu,Modal, TextInputComponent} = require('discord.js')
    const bot  = new Client({intents:["GUILD_EMOJIS_AND_STICKERS","GUILD_PRESENCES","GUILD_MESSAGES","GUILDS","GUILD_MESSAGE_REACTIONS","GUILD_WEBHOOKS","GUILD_VOICE_STATES"]});
    const { CronJob } = require('cron');
    const {requestAndFormat} = require('./utils')
    const axios= require('axios');
    require('ffmpeg')
    require('ffmpeg-static')
    require('dotenv').config({path:'./.env'})
    const jobs = require('./jobs.json')
    const PREFIX = '!'
    bot.on('ready', () =>{
        console.log('Req-Bot Online')
    })

    const interactionSweeper = new CronJob(
        '* * * * *',
        async function() {
            const channel = await bot.channels.fetch(`${process.env.botChannel}`);
                        
            const status = await botChannel.messages.fetch(process.env.status)
            axios.get('https://xivreq.herokuapp.com/api/requests')
                .then( requests => {
                    let unclaimed = 0
                    for(const request of requests.data.Requests){
                        if(!request.claimed){
                            unclaimed++
                        }
                    }     
                    status.edit(`There ${unclaimed===1?'is':'are'} currently **${unclaimed}** unclaimed ${unclaimed===1? 'request':'requests'}.`)
                })
                .catch( err => {
                    console.log(err)
                })
            channel.messages.fetch({limit:100})
                .then(fetched => {
                    console.log(fetched.first())
                const notPinned = fetched.filter( fetchedMsg => !fetchedMsg.pinned && !fetchedMsg.webhookId && ((Date.now()-fetchedMsg.createdTimestamp))>(2 * 60 * 1000))
                channel.bulkDelete(notPinned, true)
                    .then(res => console.log(res)) 
                        .catch(err => console.log(err))     
                })
                .catch(console.error);
        },
        null,
        true,
        'America/Los_Angeles'
    )

    // /[^_]+$/g after underscore
    // /^[^_]+(?=_)/g before underscore
    bot.on('interactionCreate', async interaction => {
        const cancelRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`cancel_`)
                    .setLabel('Cancel')
                    .setStyle('SECONDARY')
                )
        switch(interaction.customId.match(/^[^_]+(?=_)/g)[0]){
            case 'primary': {
                switch(interaction.customId.match(/[^_]+$/g)[0]){
                    case 'battle': {
                        interaction.deferUpdate()
                        const roleRow = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(`secondary_tank`)
                                    .setLabel('Tank')
                                    .setStyle('PRIMARY'),
                                new MessageButton()
                                    .setCustomId(`secondary_melee`)
                                    .setLabel('Melee')
                                    .setStyle('DANGER'),
                                new MessageButton()
                                    .setCustomId(`secondary_ranged`)
                                    .setLabel('Ranged')
                                    .setStyle('DANGER'),
                                new MessageButton()
                                    .setCustomId(`secondary_caster`)
                                    .setLabel('Caster')
                                    .setStyle('DANGER'),
                                new MessageButton()
                                    .setCustomId(`secondary_healer`)
                                    .setLabel('Healer')
                                    .setStyle('SUCCESS')
                            );
                        interaction.channel.send({content:`<@${interaction.user.id}> please select a role:`,components:[roleRow,cancelRow]})
                        break;
                    }
                    
                    case 'crafter':{
                        interaction.deferUpdate()
                        const jobRow = new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('tertiary_dohl')
                                    .setPlaceholder('')
                                    .addOptions(jobs[interaction.customId.match(/[^_]+$/g)[0]]),
                            );
                        interaction.channel.send({content:`<@${interaction.user.id}> please select a crafter:`,components: [jobRow,cancelRow]})
                        break;
                    }
                    case 'gatherer':{
                        interaction.deferUpdate()
                        const jobRow = new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('tertiary_dohl')
                                    .setPlaceholder('')
                                    .addOptions(jobs[interaction.customId.match(/[^_]+$/g)[0]]),
                            );
                        interaction.channel.send({content:`<@${interaction.user.id}> please select a gatherer:`,components: [jobRow,cancelRow]})
                        break;
                    }
                    case 'report':{
                        const modal = new Modal()
                        .setCustomId('error_')
                        .setTitle('Error Report')
                        const errorDescription = new TextInputComponent()
                            .setCustomId('error')
                            .setLabel("Description of Error:")
                            .setStyle('PARAGRAPH')
                        const replicationSteps = new TextInputComponent()
                            .setCustomId('replicant')
                            .setLabel("How to replicate:")
                            .setStyle('PARAGRAPH')
                        const userOrder = new TextInputComponent()
                            .setCustomId('userorder')
                            .setLabel("What was your order:")
                            .setStyle('PARAGRAPH')
                        const errorDescriptionRow = new MessageActionRow().addComponents(errorDescription)
                        const replicationStepsRow = new MessageActionRow().addComponents(replicationSteps)
                        const userOrderRow = new MessageActionRow().addComponents(userOrder)
                        modal.addComponents(errorDescriptionRow,replicationStepsRow,userOrderRow);
                        interaction.showModal(modal);
                        break;
                    }
                    case 'signup':{
                        interaction.deferUpdate()
                        const signupRow = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(`becomeCrafter_signup`)
                                    .setLabel('Signup')
                                    .setStyle('SUCCESS'),
                                new MessageButton()
                                    .setCustomId(`cancel_`)
                                    .setLabel('Cancel')
                                    .setStyle('DANGER')
                                )
                        const dropoutRow = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId(`becomeCrafter_dropout`)
                                    .setLabel('Dropout')
                                    .setStyle('SUCCESS'),
                                new MessageButton()
                                    .setCustomId(`cancel_`)
                                    .setLabel('Cancel')
                                    .setStyle('DANGER')
                                )
                        axios.get(`${process.env.apiUrl}/api/user/`, { params: {'uuid': interaction.user.id}}).then(res => {
                            if(!res.data.crafter){
                                interaction.channel.send({content:`<@${interaction.user.id}> would you like to become a crafter?`,components: [signupRow]})
                            } else {
                                interaction.channel.send({content:`<@${interaction.user.id}> would you like to cease being a crafter?`,components: [dropoutRow]})
                            }
                            

                        }).catch(err => console.log(err))
                    }
                }
                break;
            }
            case 'secondary': {
                interaction.deferUpdate()
                const jobRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('tertiary_')
                            .setPlaceholder('')
                            .addOptions(jobs[interaction.customId.match(/[^_]+$/g)[0]])
                    );
                if(interaction.message.content.replace(/[^0-9]/g,"") === interaction.user.id){
                    interaction.message.delete()
                    interaction.channel.send({content:`<@${interaction.user.id}> please select a job:`,components: [jobRow,cancelRow]})
                }
                break;
            }
            case 'tertiary': {
                interaction.deferUpdate()
                const options = await requestAndFormat(interaction.values[0],interaction.customId.match(/^[^_]+(?=_)/g)[0])
                const jobRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('select_')
                            .setPlaceholder('')
                            .setMinValues(1)
                            .addOptions(options)
                    );
                if(interaction.message.content.replace(/[^0-9]/g,"") === interaction.user.id){
                    interaction.message.delete()
                    interaction.channel.send({content:`<@${interaction.user.id}> please select all pieces you'd like to request:`,components: [jobRow,cancelRow]})
                }
                break;
            }
            case 'select': {
                const user = {
                    uuid: interaction.user.id,
                    username: interaction.user.username,
                    avatar: interaction.user.avatar,
                    discriminator: interaction.user.discriminator
                }
                const pieces = []
                for(const piece of interaction.values){
                    pieces.push(piece.match(/[^_]+$/g)[0])
                }
                const request = await requestAndFormat(interaction.values[0].match(/^[^_]+(?=_)/g)[0],interaction.customId.match(/^[^_]+(?=_)/g)[0],pieces)
                request["requesterId"] = interaction.user.id
                request["requestedBy"] = interaction.user.username
                request["requesterDiscriminator"] = interaction.user.discriminator
                request["requesterPicture"] = interaction.user.avatar
                request["Class"] = interaction.values[0].match(/^[^_]+(?=_)/g)[0]
                if(interaction.message.content.replace(/[^0-9]/g,"") === interaction.user.id || interaction.isModalSubmit()){
                    if(!interaction.isModalSubmit()) interaction.message.delete();
                    axios.post(`${process.env.apiUrl}/api/requests/submit`, {request,user} ).then(res => interaction.reply({content:`<@${interaction.user.id}> your request has been sent. Please check the website for your order status. Once the order has been claimed a crafter will reach out to you regarding materials/tome items.`, ephemeral: true})).catch(err => console.log(err))
                }
                break;
            }
            case 'cancel': {
                interaction.deferUpdate()
                interaction.message.delete()
                break;
            }
            case 'becomeCrafter':{
                // interaction.customId.match(/[^_]+$/g)[0])
                const crafter = interaction.customId.match(/[^_]+$/g)[0] === 'signup' 
                console.log(interaction.customId.match(/[^_]+$/g)[0], crafter)
                const user = {
                    uuid: interaction.user.id,
                    username: interaction.user.username,
                    avatar: interaction.user.avatar,
                    discriminator: interaction.user.discriminator,
                    crafter: crafter
                }
                axios.put(`${process.env.apiUrl}/api/user/crafter`, user).then(res => {
                    if(!interaction.isModalSubmit()) interaction.message.delete();
                    interaction.reply({content:`<@${interaction.user.id}> your user profile has now been updated!`, ephemeral: true})
                }).catch(err => console.log(err))
                break;
            }
            case 'error': {
                let errorDescriptor;
                let errorReplicator;
                let userorder;
                for(const value of interaction.fields.components){
                    if(value.components[0].customId === 'error') errorDescriptor = value.components[0].value
                    if(value.components[0].customId === 'replicant') errorReplicator = value.components[0].value
                    if(value.components[0].customId === 'userorder') userorder = value.components[0].value
                }
                const channel = await bot.channels.fetch(`${process.env.errorChannel}`);
                const randomBetween = (min, max) => Math.floor(Math.random()*(max-min+1)+min);

                const errorReport = new MessageEmbed()
                                    .setTitle("Error Log")
                                    .setColor([
                                        randomBetween(0, 255),
                                        randomBetween(0, 255),
                                        randomBetween(0, 255)
                                      ])
                                    .setTimestamp(Date.now())
                                    .addFields(
                                        {name:'Description',value:errorDescriptor},
                                        {name:'How to reproduce',value:errorReplicator},
                                        {name:'Users Order',value:userorder},
                                        {name:'User Reporting',value: interaction.user.username+'#'+interaction.user.discriminator}
                                    )
                channel.send({embeds:[errorReport]})
                interaction.reply({content:`<@${interaction.user.id}> Thank you for the report, your order will be manually made, and an admin will reach out for more info if needed.`, ephemeral: true})
               
                break; 
            }
        }
    })
    bot.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection:', error);
    });
    bot.on( 'messageCreate' , async mes => {
        if(!['1009632907645685882'].includes(mes.channel.id) || mes.author.id === '706669135915909140' || mes.content[0] !== PREFIX|| mes.author.id !== '59423394055069696'){
        } else {
        let args = mes.content.substring(PREFIX.length).split(" ");
        switch(args[0].toLowerCase()){
            case 'clear' :
                    console.log('Action: Clearing Messages')
                    mes.channel.messages.fetch({limit:100})
                    .then(fetched => {
                        const notPinned = fetched.filter( fetchedMsg => !fetchedMsg.pinned)
                        mes.channel.bulkDelete(notPinned, true)
                    .then(res => {mes.channel.send(`Bulk deleted ${res.size} messages`).then( r => r.delete ({timeout: 15000})).catch(err => console.log(err))}) 
                        .catch(err => {
                        mes.channel.send("Well you broke something... ").then( r => r.delete ({timeout: 15000})).catch(err => console.log(err)) 
                        console.log(err)})     
                    })                  
            break;
            case 'status' :
                if (message.member.hasPermission("MANAGE_MESSAGES")) {
                message.channel.send('There are Currently **0** unclaimed requests.')
                }
            break;
            case 'setmessage':
                const rowOne = new MessageActionRow()
                .addComponents(
                        new MessageButton()
                        .setCustomId(`primary_battle`)
                        .setLabel('Battle Set')
                        .setStyle('SECONDARY'),
                        new MessageButton()
                        .setCustomId(`primary_crafter`)
                        .setLabel('Crafter Set')
                        .setStyle('SECONDARY'),
                        new MessageButton()
                        .setCustomId(`primary_gatherer`)
                        .setLabel('Gathering Set')
                        .setStyle('SECONDARY'),
                );
                const rowTwo = new MessageActionRow()
                .addComponents(
                        new MessageButton()
                        .setCustomId(`primary_signup`)
                        .setLabel('Become Crafter')
                        .setStyle('SECONDARY'),
                        new MessageButton()
                        .setCustomId(`primary_report`)
                        .setLabel('Error Report')
                        .setStyle('SECONDARY'),
                        new MessageButton()
                        .setURL(`https://xivreq.com`)
                        .setLabel('Vist XIVReq')
                        .setStyle('LINK')
                );
                mes.channel.send({files: ["./assets/req.png"]}).then(e=>{
                    mes.channel.send({content:'Welcome to XIV Req! Choose an option to begin:',components:[rowOne,rowTwo]})
                }).catch(err=> console.log(err))
                
            break; 
            }}
    })   
    
    bot.login(process.env.discordAPI)
}1