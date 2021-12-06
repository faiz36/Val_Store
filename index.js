const { Client, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const token = config.env.token;
const client_id = config.env.client;
client.once('ready', () => {
    console.log("준비됨!");
});

client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;

    let data;
    let dt;
    if (interaction.commandName === "상점확인") {
        const region = interaction.options.getString('지역');
        dt = fs.readFileSync(`./data/${interaction.user.id}.json`, 'utf-8')
        jsdt = JSON.parse(dt);
        data = await getData(jsdt["id"], jsdt["pw"]);
        if (data["error"] === true){
            interaction.reply("에러가 발생하였습니다! 아이디와 비밀번호를 확인해 주세요!")
            return;
        }
        interaction.reply("곧 나오는 결과를 확인해 주세요!")
        let shop = await getShop(data["userId"], data["ent_token"], data["accessToken"], region);
        for (let i = 0; i < 4; i++) {
            let item = shop[i];
            let embed = new MessageEmbed()
                .setTitle(item["displayName"])
                .setImage(item["displayIcon"])
                .setAuthor(interaction.user.username, interaction.user.avatarURL())
                .addField('지역',region)
            interaction.channel.send({embeds: [embed]});
        }
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
        await interaction.reply({content: "탈퇴하시겠습니까?(**10초 이내로 선택해주세요!**)",components: [row]})
    }

    if (interaction.commandName === "로그인") {

        const id = interaction.options.getString('아이디');
        const pw = interaction.options.getString('비밀번호');
        let data = {
            id: id,
            pw: pw
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

    const yes = i => i.custom_id === 'yes' && i.user.id === client_id;
    const no = i => i.custom_id === 'no' && i.user.id === client_id;

    const ycollector = int.channel.createMessageComponentCollector({ yes, time: 1000*10});
    const ncollector = int.channel.createMessageComponentCollector({ no });

    ycollector.on('collect', async int => {
        if (int.customId === 'yes') {
            fs.unlink(`./data/${int.user.id}.json`,async function (err){
                if (err){
                    await int.update({content: "이미 존재하지 않습니다!",components: []})
                }else{
                    await int.update({content: "삭제되었습니다!",components: []})
                }
            })
        }
    });

    ncollector.on('collect', async int => {
        if (int.customId === 'no'){
            await int.update({content: "취소되었습니다!",components: []})
        }
    })
})

client.login(token);

async function getData(username, pw) {
    let accessToken;
    let ent_token;
    let userId;
    let expiresIn;
    let error;
    await axios({
        url: "https://auth.riotgames.com/api/v1/authorization",
        method: "POST",
        data: {
            client_id: "play-valorant-web-prod",
            nonce: "1",
            redirect_uri: "https://playvalorant.com/opt_in",
            response_type: "token id_token",
        },
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    }).then(async (response) => {
        let res = (
            await axios({
                url: "https://auth.riotgames.com/api/v1/authorization",
                method: "PUT",
                data: {
                    type: "auth",
                    username: username,
                    password: pw,
                },
                headers: {
                    "Content-Type": "application/json",
                    Cookie: response.headers["set-cookie"],
                },
                withCredentials: true,
            })
        ).data;
        if (res.error === 'auth_failure') {
            error = true
            return;
        }
        const uri = res["response"]["parameters"]["uri"];
        const regexResult = uri.match(
            /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/
        );
        accessToken = regexResult[1];
        expiresIn = regexResult[3];

        const entitlementsToken = (
            (
                await axios({
                    url: "https://entitlements.auth.riotgames.com/api/token/v1",
                    method: "POST",
                    data: {},
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                })
            ).data
        )
        ent_token = entitlementsToken["entitlements_token"];
        userId = (
            (
                await axios({
                    url: "https://auth.riotgames.com/userinfo",
                    method: "POST",
                    data: {},
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    withCredentials: true,
                })
            ).data
        ).sub;
    })
    if (error === true){
        return {
            error: true
        }
    }else{
        return {
            accessToken,
            ent_token,
            userId,
            expiresIn,
            error: false
        }
    }
}

async function getShop(userid, ent_token, access_token, region) {
    const shop = (
        await axios({
            url: `https://pd.${region}.a.pvp.net/store/v2/storefront/${userid}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Riot-Entitlements-JWT": ent_token,
                Authorization: `Bearer ${access_token}`,
            },
            withCredentials: true,
        })
    ).data;

    var singleItems = shop.SkinsPanelLayout.SingleItemOffers;

    for (var i = 0; i < singleItems.length; i++) {
        singleItems[i] = (
            (
                await axios({
                    url: `https://valorant-api.com/v1/weapons/skinlevels/${singleItems[i]}`,
                    method: "GET",
                })
            ).data
        ).data;
    }
    return singleItems;
}
