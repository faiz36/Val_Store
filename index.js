const { Client, MessageEmbed} = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });
const axios = require('axios');
client.once('ready', () => {
    console.log("준비됨!");
});

client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;

    if (interaction.commandName === "로그인") {
        const id = interaction.options.getString('아이디');
        const pw = interaction.options.getString('비밀번호');
        const region = interaction.options.getString('지역');
        interaction.reply("잠시후 나오는 결과를 확인해 주세요!");
        let data = await getData(id, pw);
        let shop = await getShop(data["userId"], data["ent_token"], data["accessToken"],region);
        for (var i = 0; i < 4; i++){
            let item = shop[i];
            let embed = new MessageEmbed()
                .setTitle(item["displayName"])
                .setImage(item["displayIcon"])
                .setAuthor(interaction.user.username, interaction.user.avatarURL())
            interaction.channel.send({embeds: [embed]});
        }
    }
})

client.login('OTA5OTQxMzIyNDgyMzM5OTIw.YZLm5Q.HeGEKLcZ7nZ7ky8O2qQf96NCXK0');

async function getData(username, pw) {
    let accessToken;
    let ent_token;
    let userId;
    let expiresIn;
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
    return {
        accessToken,
        ent_token,
        userId,
        expiresIn,
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
