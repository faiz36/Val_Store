const { REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {SlashCommandBuilder} = require("@discordjs/builders");
const token = 'Your Bot Token' // PLS CHANGE YOUR BOT TOKEN
const clientId = 'Your Bot Client_Id'; // PLS CHANGE YOUR BOT CLIENT_ID
const guildId = 'Your Discord Server ID'; // PLS CHANGE YOUR DISCORD SERVER ID

const rest = new REST({version: '9'}).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId,guildId),
            { body: [data = new SlashCommandBuilder()
                    .setName('로그인')
                    .setDescription('발로란트 상점 로그인')
                    .addStringOption(option => option.setName("아이디").setDescription("발로란트 아이디를 넣어주세요").setRequired(true))
                    .addStringOption(option => option.setName("비밀번호").setDescription("발로란트 아이디를 넣어주세요").setRequired(true))
                    .addStringOption(option => option.setName("지역").setDescription("발로란트 상점을 확인할 지역을 골라주세요!").setRequired(true)
                        .addChoice("한국","KR")
                        .addChoice("유럽","EU")
                        .addChoice("북아메리카","NA")
                        .addChoice("아시아","AP")
                    )] }
        )
    } catch (error){
        console.log(error);
    }
})();
