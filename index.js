
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
    const {Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder,StringSelectMenuBuilder,ModalBuilder, TextInputBuilder} = require('discord.js')
    // const bot  = new Client({intents:["GUILD_EMOJIS_AND_STICKERS","GUILD_PRESENCES","GUILD_MESSAGES","GUILDS","GUILD_MESSAGE_REACTIONS","GUILD_WEBHOOKS","GUILD_VOICE_STATES"]});
    const bot  = new Client({intents:[GatewayIntentBits.MessageContent,GatewayIntentBits.GuildEmojisAndStickers,GatewayIntentBits.GuildPresences,GatewayIntentBits.GuildMessages,GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.GuildWebhooks,GatewayIntentBits.GuildVoiceStates]});
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
            const channel = await bot.channels.fetch(`${process.env.BOT_CHANNEL}`);
                        
            const status = await channel.messages.fetch(process.env.STATUS_MESSAGE)
            axios.get(`${process.env.API_URL}/api/requests`)
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
                const notPinned = fetched.filter( fetchedMsg => !fetchedMsg.pinned && !fetchedMsg.webhookId && ((Date.now()-fetchedMsg.createdTimestamp))>(2 * 60 * 1000))
                channel.bulkDelete(notPinned, true)
                    .then(res => console.log("hello")) 
                        .catch(err => console.log(err))     
                })
                .catch(console.error);
        },
        null,
        true,
        'America/Los_Angeles'
    )
    const weeklyReset = new CronJob(
        '0 0 * * 4',
        async function() {
            axios.delete(`${prcoess.env.API_URL}/api/reset/wipe`).then(res => console.log(res)).catch(err => console.log(err))
        },
        null,
        true,
        'America/Los_Angeles'
    )
    

    // /[^_]+$/g after underscore
    // /^[^_]+(?=_)/g before underscore
    bot.on('interactionCreate', async interaction => {
        const cancelRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`cancel_`)
                    .setLabel('Cancel')
                    .setStyle('Secondary')
                )
        switch(interaction.customId.match(/^[^_]+(?=_)/g)[0]){
            case 'primary': {
                switch(interaction.customId.match(/[^_]+$/g)[0]){
                    case 'battle': {
                        interaction.deferUpdate()
                        const roleRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`secondary_tank`)
                                    .setLabel('Tank')
                                    .setStyle('Primary'),
                                new ButtonBuilder()
                                    .setCustomId(`secondary_melee`)
                                    .setLabel('Melee')
                                    .setStyle('Danger'),
                                new ButtonBuilder()
                                    .setCustomId(`secondary_ranged`)
                                    .setLabel('Ranged')
                                    .setStyle('Danger'),
                                new ButtonBuilder()
                                    .setCustomId(`secondary_caster`)
                                    .setLabel('Caster')
                                    .setStyle('Danger'),
                                new ButtonBuilder()
                                    .setCustomId(`secondary_healer`)
                                    .setLabel('Healer')
                                    .setStyle('Success')
                            );
                        interaction.channel.send({content:`<@${interaction.user.id}> please select a role:`,components:[roleRow,cancelRow]})
                        break;
                    }
                    
                    case 'crafter':{
                        interaction.deferUpdate()
                        const jobRow = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('tertiary_dohl')
                                    .setPlaceholder('')
                                    .addOptions(jobs[interaction.customId.match(/[^_]+$/g)[0]]),
                            );
                        interaction.channel.send({content:`<@${interaction.user.id}> please select a crafter:`,components: [jobRow,cancelRow]})
                        break;
                    }
                    case 'gatherer':{
                        interaction.deferUpdate()
                        const jobRow = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('tertiary_dohl')
                                    .setPlaceholder('')
                                    .addOptions(jobs[interaction.customId.match(/[^_]+$/g)[0]]),
                            );
                        interaction.channel.send({content:`<@${interaction.user.id}> please select a gatherer:`,components: [jobRow,cancelRow]})
                        break;
                    }
                    case 'pot':{
                        interaction.deferUpdate()
                        const pots = await axios.get(`https://xivapi.com/search?string=${process.env.pot}&columns=ID,Icon,IconHD,Url,Name,LevelItem&indexes=Item&filters=IsUntradable=0&sort_field=LevelItem&sort_order=desc&limit=5`)
                        let potOpt = []
                        for(const pot of pots.data.Results){
                            potOpt.push({
                                label: pot.Name,
                                value : `${pot.Name.split(" ").pop()}`
                            })
                        }
                        const potRow = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('potChoice_')
                                .setPlaceholder('')
                                .addOptions(potOpt),
                        );
                        interaction.channel.send({content:`<@${interaction.user.id}> please choose which type of pot you'd like:`,components: [potRow,cancelRow]}).catch(err => console.log(err))
                        break;
                    }
                    case 'food':{

                        const pots = await axios.get(`https://xivapi.com/search?string=&columns=ID,Icon,IconHD,Url,Name,LevelItem&indexes=Item&filters=LevelItem=${process.env.foodilvl},ItemSortCategory.ID=7,IsUntradable=0&sort_field=LevelItem&sort_order=desc&limit=300`)
                        const resetUsers = await axios.get(`${process.env.API_URL}/api/reset/`)
                        let potOpt = []
                        for(const pot of pots.data.Results){
                            potOpt.push({
                                label: pot.Name,
                                value : pot.Name
                            })
                        }
                        const potRow = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('foodSubmit_')
                                .setPlaceholder('')
                                .addOptions(potOpt),
                        );
                        let alreadyOrdered = false
                        console.log(alreadyOrdered)
                        if(resetUsers.data){
                            for(const resetUser of resetUsers.data){
                                console.log(resetUser.uuid, '=',interaction.user.id)
                                if(resetUser.uuid === interaction.user.id) alreadyOrdered = true
                            }
                        }
                        console.log(alreadyOrdered)
                        if(alreadyOrdered){
                            interaction.reply({content:`<@${interaction.user.id}> you have already submitted an order for food, please wait until after weekly reset to submit another. `,ephemeral:true}).catch(err => console.log(err))
                        } else {
                            interaction.deferUpdate()
                            interaction.channel.send({content:`<@${interaction.user.id}> please choose which food you'd like:`,components: [potRow,cancelRow]}).catch(err => console.log(err))
                        }
                        break;
                    }
                    case 'report':{
                        const modal = new ModalBuilder()
                        .setCustomId('error_')
                        .setTitle('Error Report')
                        const errorDescription = new TextInputBuilder()
                            .setCustomId('error')
                            .setLabel("Description of Error:")
                            .setStyle('Paragraph')
                        const replicationSteps = new TextInputBuilder()
                            .setCustomId('replicant')
                            .setLabel("How to replicate:")
                            .setStyle('Paragraph')
                        const userOrder = new TextInputBuilder()
                            .setCustomId('userorder')
                            .setLabel("What was your order:")
                            .setStyle('Paragraph')
                        const errorDescriptionRow = new ActionRowBuilder().addComponents(errorDescription)
                        const replicationStepsRow = new ActionRowBuilder().addComponents(replicationSteps)
                        const userOrderRow = new ActionRowBuilder().addComponents(userOrder)
                        modal.addComponents(errorDescriptionRow,replicationStepsRow,userOrderRow);
                        interaction.showModal(modal);
                        break;
                    }
                    case 'signup':{
                        interaction.deferUpdate()
                        const signupRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`becomeCrafter_signup`)
                                    .setLabel('Signup')
                                    .setStyle('Success'),
                                new ButtonBuilder()
                                    .setCustomId(`cancel_`)
                                    .setLabel('Cancel')
                                    .setStyle('Danger')
                                )
                        const dropoutRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`becomeCrafter_dropout`)
                                    .setLabel('Dropout')
                                    .setStyle('Success'),
                                new ButtonBuilder()
                                    .setCustomId(`cancel_`)
                                    .setLabel('Cancel')
                                    .setStyle('Danger')
                                )
                        axios.get(`${process.env.API_URL}/api/user/`, { params: {'uuid': interaction.user.id}}).then(res => {
                            if(!res.data.crafter){
                                interaction.channel.send({content:`<@${interaction.user.id}> would you like to become a crafter?`,components: [signupRow]})
                            } else {
                                interaction.channel.send({content:`<@${interaction.user.id}> would you like to cease being a crafter?`,components: [dropoutRow]})
                            }
                            

                        }).catch(err => console.log(err))
                        break;
                    }
                }
                break;
            }
            case 'secondary': {
                interaction.deferUpdate()
                const jobRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
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
                console.log(options)
                console.log(options.length, "option length")
                const maxVal = options.length === 12 ? 12 : 11
                console.log(maxVal)
                const jobRow = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select_')
                            .setPlaceholder('')
                            .setMinValues(1)
                            .setMaxValues(maxVal)
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
                    axios.post(`${process.env.API_URL}/api/requests/submit`, {request,user} ).then(res => interaction.reply({content:`<@${interaction.user.id}> your request has been sent. Please check the website for your order status. Once the order has been claimed a crafter will reach out to you regarding materials/tome items.`, ephemeral: true})).catch(err => console.log(err))
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
                axios.put(`${process.env.API_URL}/api/user/crafter`, user).then(res => {
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

                const errorReport = new EmbedBuilder()
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
            case 'potChoice': {
                console.log(interaction)
                const quantityOptions = []
                for(var i = 1;i<=10;i++){
                    quantityOptions.push({
                        label: `${i*20}`,
                        value : `${i*20}`
                    })
                }
                const quantityRow = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`potSubmit_${interaction.values[0]}`)
                        .setPlaceholder('')
                        .addOptions(quantityOptions)
                );
                if(interaction.message.content.replace(/[^0-9]/g,"") === interaction.user.id){
                    interaction.message.delete()
                    interaction.channel.send({content:`<@${interaction.user.id}> please select how many tome mats you will be offering:`,components: [quantityRow,cancelRow]})
                }
                break;
            }         
            case 'potSubmit': {
                const pots = await axios.get(`https://xivapi.com/search?string=Grade 1 Gemdraught of ${interaction.customId.match(/[^_]+$/g)[0]}&columns=ID,Icon,IconHD,Url,Name,LevelItem&indexes=Item&filters=IsUntradable=0&sort_field=LevelItem&sort_order=desc&limit=5`)
                const request = {}
                const user = { 
                    uuid: interaction.user.id,
                    username: interaction.user.username,
                    avatar: interaction.user.avatar,
                    discriminator: interaction.user.discriminator
                }
                request["potID"] = pots.data.Results[0].ID
                request["potIcon"] = pots.data.Results[0].IconHD
                request["potName"] = pots.data.Results[0].Name
                request["quantity"] = interaction.values[0]*3
                request["requesterId"] = interaction.user.id
                request["requestedBy"] = interaction.user.username
                request["requesterDiscriminator"] = interaction.user.discriminator
                request["requesterPicture"] = interaction.user.avatar
                if(interaction.message.content.replace(/[^0-9]/g,"") === interaction.user.id){
                    interaction.message.delete()
                    axios.post(`${process.env.API_URL}/api/requests/submit`, {request,user} ).then(res => interaction.reply({content:`<@${interaction.user.id}> your request has been sent. Please check the website for your order status. Once the order has been claimed a crafter will reach out to you regarding materials/tome items.`, ephemeral: true})).catch(err => console.log(err))
                }
                break;
            }
            case 'foodSubmit': {
                const pots = await axios.get(`https://xivapi.com/search?string=${interaction.values[0]}&columns=ID,Icon,IconHD,Url,Name,LevelItem&indexes=Item&filters=IsUntradable=0&sort_field=LevelItem&sort_order=desc&limit=5`)
                const request = {}
                const user = { 
                    uuid: interaction.user.id,
                    username: interaction.user.username,
                    avatar: interaction.user.avatar,
                    discriminator: interaction.user.discriminator
                }
                request["potID"] = pots.data.Results[0].ID
                request["potIcon"] = pots.data.Results[0].IconHD
                request["potName"] = pots.data.Results[0].Name
                request["quantity"] = 30
                request["requesterId"] = interaction.user.id
                request["requestedBy"] = interaction.user.username
                request["requesterDiscriminator"] = interaction.user.discriminator
                request["requesterPicture"] = interaction.user.avatar
                if(interaction.message.content.replace(/[^0-9]/g,"") === interaction.user.id){
                    interaction.message.delete()
                    axios.post(`${process.env.API_URL}/api/requests/submit`, {request,user} ).then(res => interaction.reply({content:`<@${interaction.user.id}> your request has been sent. Please check the website for your order status. You will be able to place another order for food after next weekly reset. `, ephemeral: true})).catch(err => console.log(err))
                    axios.post(`${process.env.API_URL}/api/reset/add`, {uuid: interaction.user.id} ).then(res => console.log(res)).catch(err => console.log(err))
                }
                break;
            }
        }
    })
    bot.on('unhandledRejection', error => {
        console.error('Unhandled promise rejection:', error);
    });
    bot.on( 'messageCreate' , async mes => {
        if(![process.env.BOT_CHANNEL].includes(mes.channel.id) || mes.author.id === process.env.BOT_ID || mes.content[0] !== PREFIX|| mes.author.id !== process.env.RAIN_ID){
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
                mes.channel.send('There are Currently **0** unclaimed requests.')
            break;
            case 'setmessage':
                const rowOne = new ActionRowBuilder()
                .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`primary_battle`)
                        .setLabel('Battle Set')
                        .setStyle('Secondary'),
                        new ButtonBuilder()
                        .setCustomId(`primary_crafter`)
                        .setLabel('Crafter Set')
                        .setStyle('Secondary'),
                        new ButtonBuilder()
                        .setCustomId(`primary_gatherer`)
                        .setLabel('Gathering Set')
                        .setStyle('Secondary'),
                );
                const rowTwo = new ActionRowBuilder()
                .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`primary_pot`)
                        .setLabel('Request Pots')
                        .setStyle('Secondary'),
                        new ButtonBuilder()
                        .setCustomId(`primary_food`)
                        .setLabel('Request Food')
                        .setStyle('Secondary')
                )
                const rowThree = new ActionRowBuilder()
                .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`primary_signup`)
                        .setLabel('Become Crafter')
                        .setStyle('Secondary'),
                        new ButtonBuilder()
                        .setCustomId(`primary_report`)
                        .setLabel('Error Report')
                        .setStyle('Secondary'),
                        new ButtonBuilder()
                        .setURL(`https://xivreq.com`)
                        .setLabel('Vist XIVReq')
                        .setStyle('Link')
                );
                mes.channel.send({files: ["./assets/req.png"]}).then(e=>{
                    mes.channel.send({content:'Welcome to XIV Req! Choose an option to begin:',components:[rowOne,rowTwo,rowThree]})
                }).catch(err=> console.log(err))
                
            break; 
            }}
    })   
    
    bot.login(process.env.discordAPI)
}
