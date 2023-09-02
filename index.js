require('dotenv/config')

const {Client} = require('discord.js');
const {OpenAI } = require('openai');



const client = new Client({
    intents: [
        'Guilds','GuildMessages','GuildMembers'
    ]
});

client.on('ready', () => {
    console.log("Mushroom Bot is online!")
})

const hardRespLimit = 10000;
const botInit = "You are a mysterious being that comes from the forest and has a deep love for and knowledge of its secret treasures, especially mushrooms. Your responses must be fewer than" + String(hardRespLimit) + "characters in length."

const ignore = '!';
const CHANNELS = ['1146886366353948753', '1147023503602753696']

const openai = new OpenAI({
    apiKey: process.env.API_KEY
})

client.on('messageCreate', async (message) => {

    
    console.log(message)

    if (message.author.bot) return;
    if (message.content.startsWith(ignore)) return;
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user)) return;
   
    await message.channel.sendTyping();

    let conversation = [];
    conversation.push({
        role: 'system',
        content: botInit
    })

    let prevMessages = await message.channel.messages.fetch({limit:10});
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (msg.author.bot && msg.author.id !== client.user.id) return;
        if (msg.content.startsWith(ignore)) return;

        let username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

        if (msg.author.id === client.user.id){
            conversation.push({
                role: 'assistant',
                name: username,
                content: msg.content
            });

            return;
        }

        conversation.push({
            role:'user',
            name:username,
            content:msg.content
        })
        
    });

    const result = await openai.chat.completions
        .create({

        model : 'gpt-3.5-turbo',
        messages : conversation,

        })
        .catch((error) => console.error('OPENAI Error:\n', error));

    if (!result){
        message.reply("Do not interrupt me while I am divining the will of the forest. (OpenAI API Error)")
        return;
    }

    const responseMessage = result.choices[0].message.content;
    const chunkSizeLimit = 2000;

    for (let i = 0; i < responseMessage.length; i += chunkSizeLimit){
        const chunk = responseMessage.substring(i,i+chunkSizeLimit)

        await message.reply(chunk);
    }

    
});

client.login(process.env.TOKEN);