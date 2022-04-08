const { Client, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });
const axios = require('axios');
const fs = require('fs');
const { token, client_id } = require('./config.json')
const ncrypt = require("ncrypt-js");
const ValAPI = require("./ValorantAPI")
let {access} = require("fs");
let amount = 0
var offers = {}
client.once('ready', client => {
    console.log("준비됨!");
    let repeat = setInterval(()=>{
        if (amount === 0){
            client.user.setActivity('도움말 명령어는 /도움말 로 확인하세요!',{type: "PLAYING"})
            amount = 1
        }else if (amount === 1){
            client.user.setActivity('/상점확인 명령어로 상점을 확인해보세요!',{type: "PLAYING"})
            amount = 0
        }
    },1000*60)
});

client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;

    let data;
    let dt;
    let jsdt;
    if (interaction.commandName === "상점확인") {
        try {
            let access;
            const id = interaction.options.getString('아이디');
            const pw = interaction.options.getString('비밀번호');
            const region = interaction.options.getString('지역');
            try {
                fs.accessSync(`./data/${interaction.user.id}.json`, fs.constants.F_OK)
                access = true
            } catch (e) {
                access = false
            }
            if (id != null && pw != null) {
                data = await ValAPI.getData(id, pw);
                if (data["error"] === true) {
                    interaction.reply("에러가 발생하였습니다! 아이디와 비밀번호를 확인해 주세요!")
                    return;
                }
                interaction.reply({content: "잠시후 나오는 결과를 확인해 주세요!", ephemeral: true})
                let shop = await ValAPI.getShop(data["userId"],data["ent_token"],data["access_token"],region);
                for (let i = 0; i < 4; i++) {
                    let item = shop[i];
                    let embed = new MessageEmbed()
                        .setTitle(item["displayName"])
                        .setImage(item["displayIcon"])
                        .setAuthor(interaction.user.username, interaction.user.avatarURL())
                        .addField('가격', "<:vp:954160736828018748>" + item["price"].toString())
                        .addField('지역', region)
                    interaction.channel.send({embeds: [embed]});
                }
            } else {
                if (access) {
                    dt = fs.readFileSync(`./data/${interaction.user.id}.json`, 'utf-8')
                    jsdt = JSON.parse(dt);
                    var nobj = new ncrypt(interaction.user.id);
                    const id = nobj.decrypt(jsdt["id"])
                    const pw = nobj.decrypt(jsdt["pw"])
                    data = await ValAPI.getData(id, pw);
                    if (data["error"] === true) {
                        interaction.reply("에러가 발생하였습니다! 아이디와 비밀번호를 확인해 주세요!")
                        return;
                    }
                    interaction.reply("곧 나오는 결과를 확인해 주세요!")
                    let shop = await ValAPI.getShop(data["userId"], data["ent_token"], data["accessToken"], region);
                    for (let i = 0; i < 4; i++) {
                        let item = shop[i];
                        let embed = new MessageEmbed()
                            .setTitle(item["displayName"])
                            .setImage(item["displayIcon"])
                            .setAuthor(interaction.user.username, interaction.user.avatarURL())
                            .addField('가격', "<:vp:954160736828018748>" + item["price"].toString())
                            .addField('지역', region)
                        interaction.channel.send({embeds: [embed]});
                    }
                } else {
                    interaction.reply("파일이 존재하지 않습니다!");
                }
            }

        }catch (e) {
            interaction.reply("에러가 발생하였습니다! 다시한번 시도해 주세요! 반복된다면 관리자에게 문의해 주세요!\n에러목록`" + e+"`")
        }}

    if (interaction.commandName === "야시장"){
        let access;
        const id = interaction.options.getString('아이디');
        const pw = interaction.options.getString('비밀번호');
        const region = interaction.options.getString('지역');

        try {
            fs.accessSync(`./data/${interaction.user.id}.json`, fs.constants.F_OK)
            access = true
        } catch (e) {
            access = false
        }

        if (id != null && pw != null) {
            data = await ValAPI.getData(id, pw);
            if (data["error"] === true) {
                interaction.reply("에러가 발생하였습니다! 아이디와 비밀번호를 확인해 주세요!")
                return;
            }
            interaction.reply({content: "잠시후 나오는 결과를 확인해 주세요!", ephemeral: true})
            let shop = await ValAPI.getNightMarket(data["userId"], data["ent_token"], data["accessToken"], region);
            if (shop == []){
              interaction.reply("야시장이 오픈되지 않았습니다!")
              return;
            }
            for (let i = 0; i < 6; i++) {
                let item = shop[i];
                let embed = new MessageEmbed()
                    .setTitle(item["displayName"])
                        .setImage(item["displayIcon"])
                        .setAuthor(interaction.user.username, interaction.user.avatarURL())
                        .addField('가격', "<:vp:954160736828018748>" + item["discountPrice"].toString())
                        .addField('할인율',item["discountPercent"]+"%")
                        .addField('지역', region)
                interaction.channel.send({embeds: [embed]});
            }
        } else {
            if (access) {
                dt = fs.readFileSync(`./data/${interaction.user.id}.json`, 'utf-8')
                jsdt = JSON.parse(dt);
                var nobj = new ncrypt(interaction.user.id);
                const id = nobj.decrypt(jsdt["id"])
                const pw = nobj.decrypt(jsdt["pw"])
                data = await ValAPI.getData(id, pw);
                if (data["error"] === true) {
                    interaction.reply("에러가 발생하였습니다! 아이디와 비밀번호를 확인해 주세요!")
                    return;
                }
                interaction.reply("곧 나오는 결과를 확인해 주세요!")
                let shop = await ValAPI.getNightMarket(data["userId"], data["ent_token"], data["accessToken"], region);
                if (shop == []){
                  interaction.reply("야시장이 오픈되지 않았습니다!")
                  return;
                }
                for (let i = 0; i < 6; i++) {
                    let item = shop[i];
                    let embed = new MessageEmbed()
                        .setTitle(item["displayName"])
                        .setImage(item["displayIcon"])
                        .setAuthor(interaction.user.username, interaction.user.avatarURL())
                        .addField('가격', "<:vp:954160736828018748>" + item["discountPrice"].toString())
                        .addField('할인율',item["discountPercent"]+"%")
                        .addField('지역', region)
                    interaction.channel.send({embeds: [embed]});
                }
            } else {
                interaction.reply("파일이 존재하지 않습니다!");
            }
        }

    }

    if (interaction.commandName === "도움말"){
        let embed = new MessageEmbed()
            .setTitle("Val Store의 도움말 입니다!")
            .setDescription("{}는 필수 항목, []는 선택 항목입니다!")
            .setColor("6E9C57")
            .addFields(
                { name: "/로그인 {아이디} {비밀번호}", value: "서버에 자신의 발로란트 아이디 비밀번호를 저장합니다."},
                { name: "/상점확인 {지역} [아이디] [비밀번호]", value: "발로란트 상점을 확인합니다! {지역}은 서버 위치를 확인하고 [아이디],[비밀번호]는 1회용으로(보안성) 로그인해 확인합니다."},
                { name: "/야시장 {지역} [아이디] [비밀번호]", value: "발로란트 야시장을 확인합니다! {지역}은 서버 위치를 확인하고 [아이디],[비밀번호]는 1회용으로(보안성) 로그인해 확인합니다.(야시장이 열릴때만 가능합니다)"},
                { name: "/도움말", value: "도움말을 출력합니다."}

            )
            .setThumbnail("https://cdn.discordapp.com/app-icons/909941322482339920/29c60fdf67bfde572c1ee5b02fa0c1ae.png")
        interaction.reply({embeds: [embed]})
    }

    if (interaction.commandName === "탈퇴"){
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('yes')
                    .setLabel('네')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('no')
                    .setLabel('아니요')
                    .setStyle('DANGER')
            );
        await interaction.reply({content: "탈퇴하시겠습니까?",components: [row]})
    }

    if (interaction.commandName === "로그인") {

        const id = interaction.options.getString('아이디');
        const pw = interaction.options.getString('비밀번호');
        var nobj = new ncrypt(interaction.user.id)
        const enid = nobj.encrypt(id)
        const enpw = nobj.encrypt(pw)
        let data = {
            id: enid,
            pw: enpw
        }
        const jsonData = JSON.stringify(data);
        fs.writeFile(`./data/${interaction.user.id}.json`,jsonData,function (err) {
            if (err) console.log(err);
        })
        interaction.reply({content: "저장되었습니다!", ephemeral: true});
    }

})

client.on('interactionCreate', async int => {
    if (!int.isButton()) return;

    const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
    };

    int.channel.awaitMessageComponent(filter,{ component_type: 'SELECT_MENU', time: 3000})
        .then(int => {
                if (int.customId === "yes"){
                    fs.unlink(`./data/${int.user.id}.json`,function (err){
                        if (err){
                            int.update({content: "이미 존재하지 않습니다!", components: []})
                        }else{
                            int.update({content: "삭제되었습니다!", components: []})
                        }
                    })
                }else if(int.customId === "no"){
                    int.update({content: "취소되었습니다!", components: []})
                }
        })
        .catch(err => {
            err.update({content:"시간이 지나 취소되었습니다",components: []})
        })
})

client.login(token);
