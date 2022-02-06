const { REST} = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const {SlashCommandBuilder} = require("@discordjs/builders");
const { server, token, client } = require('./config.json')
const rest = new REST({version: '9'}).setToken(token);

if (server === 'null'){
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client),
                { body: [data = new SlashCommandBuilder()
                        .setName('로그인')
                        .setDescription('발로란트 상점 로그인 정보를 입력해 주세요!')
                        .addStringOption(option => option.setName("아이디").setDescription("발로란트 아이디를 넣어주세요").setRequired(true))
                        .addStringOption(option => option.setName("비밀번호").setDescription("발로란트 아이디를 넣어주세요").setRequired(true)),
                        data = new SlashCommandBuilder()
                            .setName("상점확인")
                            .setDescription("발로란트 일일 상점을 확인합니다.")
                            .addStringOption(option => option.setName("지역").setDescription("발로란트 상점을 확인할 지역을 골라주세요!").setRequired(true)
                                .addChoice("한국","KR")
                                .addChoice("유럽","EU")
                                .addChoice("북아메리카","NA")
                                .addChoice("아시아","AP")
                            )
                            .addStringOption(option => option.setName("아이디").setDescription("1회용 로그인 입니다! 등록을 하셨다면 굳이 하실필요 없습니다."))
                            .addStringOption(option => option.setName("비밀번호").setDescription("1회용 로그인 입니다! 등록을 하셨다면 굳이 하실필요 없습니다.")),
                        data = new SlashCommandBuilder()
                            .setName("탈퇴")
                            .setDescription("서버에 있는 정보를 삭제합니다."),
                        data = new SlashCommandBuilder()
                            .setName("도움말")
                            .setDescription("도움말을 확인합니다.")],

                }
            )
            console.log("글로벌 커맨드 등록됨!")
        } catch (error){
            console.log(error);
        }
    })();
}else{
    (async () => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(client,server),
                { body: [data = new SlashCommandBuilder()
                        .setName('로그인')
                        .setDescription('발로란트 상점 로그인 정보를 입력해 주세요!')
                        .addStringOption(option => option.setName("아이디").setDescription("발로란트 아이디를 넣어주세요").setRequired(true))
                        .addStringOption(option => option.setName("비밀번호").setDescription("발로란트 아이디를 넣어주세요").setRequired(true)),
                        data = new SlashCommandBuilder()
                            .setName("상점확인")
                            .setDescription("발로란트 일일 상점을 확인합니다.")
                            .addStringOption(option => option.setName("지역").setDescription("발로란트 상점을 확인할 지역을 골라주세요!").setRequired(true)
                                .addChoice("한국","KR")
                                .addChoice("유럽","EU")
                                .addChoice("북아메리카","NA")
                                .addChoice("아시아","AP")
                            )
                            .addStringOption(option => option.setName("아이디").setDescription("1회용 로그인 입니다! 등록을 하셨다면 굳이 하실필요 없습니다."))
                            .addStringOption(option => option.setName("비밀번호").setDescription("1회용 로그인 입니다! 등록을 하셨다면 굳이 하실필요 없습니다.")),
                        data = new SlashCommandBuilder()
                            .setName("탈퇴")
                            .setDescription("서버에 있는 정보를 삭제합니다."),
                        data = new SlashCommandBuilder()
                            .setName("도움말")
                            .setDescription("도움말을 확인합니다.")],
                }
            )
            console.log("서버 커맨드 등록됨!")
        } catch (error){
            console.log(error);
        }
    })();
}
