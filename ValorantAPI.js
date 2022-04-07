const axios = require("axios");
let offers = {};
async function  getData(username, pw) {
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

    await loadOffers(userid, ent_token, access_token, region)

    for (var i = 0; i < singleItems.length; i++) {
        singleItems[i] = (
            (
                await axios({
                    url: `https://valorant-api.com/v1/weapons/skinlevels/${singleItems[i]}`,
                    method: "GET",
                })
            ).data
        ).data;
        singleItems[i].price = offers[singleItems[i].uuid];
    }

    return singleItems;
}
async function getNightMarket(userid,ent_token,access_token,region){
  let error = false;

    let res =( await axios({
        url: `https://pd.${region}.a.pvp.net/store/v2/storefront/${userid}`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Riot-Entitlements-JWT": ent_token,
            Authorization: `Bearer ${access_token}`,
        },
        withCredentials: true
    })).data
    
    if(res.BonusStore.BonusStoreOffers === undefined){
      return [];
    }

    var nm = res.BonusStore.BonusStoreOffers;

    var arr = [];
    for (var i = 0; i < nm.length; i++) {
        let itemid = nm[i].Offer.Rewards[0].ItemID;
        arr[i] = (
            (
                await axios({
                    url: `https://valorant-api.com/v1/weapons/skinlevels/${itemid}`,
                    method: "GET",
                })
            ).data
        ).data;
        arr[i].price =
            nm[i].Offer.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"];
        arr[i].discountPrice =
            nm[i].DiscountCosts["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"];
        arr[i].discountPercent = nm[i].DiscountPercent;
    }

    cachedNightShop = arr;

    return arr;

}

async function loadOffers(userid,ent_token,access_token,region) {
    let response = (
        await axios({
            url: `https://pd.${region}.a.pvp.net/store/v1/offers`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Riot-Entitlements-JWT": ent_token,
                Authorization: `Bearer ${access_token}`,
            },
            withCredentials: true,
        })
    ).data;

    for (var i = 0; i < response.Offers.length; i++) {
        let offer = response.Offers[i];
        offers[offer.OfferID] = offer.Cost["85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741"];
    }
}
module.exports = { getData, getShop, getNightMarket }
