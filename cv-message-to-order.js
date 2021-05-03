const axios = require('axios');
const ACCOUNT_NUMBER = 604254;
const CONFIG = require("./config");
const REALITY = "DEMO"; // DEMO or LIVE
let AUTH_TOKEN = "";
let headers;

async function getAuthToken() {
    console.log(`[i] Getting token`);
    let token = await axios.post('https://rest.simplefx.com/api/v3/auth/key', {
        "clientId": CONFIG.simpleFXClientId,
        "clientSecret": CONFIG.simpleFXClientSecret
    });
    return "Bearer " + token.data.data.token;
}

async function setToken() {
    AUTH_TOKEN = await getAuthToken();
    headers = {
        headers: {
            'Authorization': `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }
    console.log(AUTH_TOKEN);
}

async function marketOrder(SYMBOL, TYPE, VOLUME, TP, SL) {
    console.log(`[i] Placing Order`);
    let body = {
        "Reality": REALITY,
        "Login": CONFIG.simpleFXAccount,
        "Symbol": SYMBOL,
        "Side": TYPE,
        "Volume": VOLUME,
        "IsFIFO": false,
        "TakeProfit": TP,
        "StopLoss": SL,
        "RequestId": 1338
    };

    let response = await axios.post('https://rest.simplefx.com/api/v3/trading/orders/market', body, headers);
    if (response.status >= 200 && response.status <= 299) {
        console.log('[i] Order placed', response.data.data);
    } else {
        // Handle errors
        console.log(response.status, response.statusText);
    }
}

function cleanup(text) {

    var replaced = text.replace("Quick pips! Let's go", "")
        .replace("👉Join the Private and trade NFP together", "")
        .replace("/", "")
        .replace("Take profit", "tp")
        .replace("Stop loss", "sl");

    return replaced;
}

function generateOrder(text) {
    
    // remove shit
    var text = cleanup(text);
    console.log(text);

    const pairs = {
        "GOLD": "XAUUSD",
        "gbp/usd": "GBPUSD",
        "AUDJPY": "AUDJPY",
        "NZDJPY": "NZDJPY",
        "EURAUD": "EURAUD",
        "GBPAUD": "GBPAUD",
        "EURNZD": "EURNZD",
        "NZDCHF": "NZDCHF",
        "AUDCHF": "AUDCHF",
        "CADJPY": "CADJPY",
        "GBPJPY": "GBPJPY",
        "NZDUSD": "NZDUSD",
        "AUDNZD": "AUDNZD",
        "USDJPY": "USDJPY",
        "GBPNZD": "GBPNZD",
        "AUDUSD": "AUDUSD",
        "USDCAD": "USDCAD",
        "GBPCHF": "GBPCHF",
        "EURJPY": "EURJPY",
        "AUDCAD": "AUDCAD",
        "EURCHF": "EURCHF",
        "EURCAD": "EURCAD",
        "GBPCAD": "GBPCAD",
        "USDCHF": "USDCHF",
        "CHFJPY": "CHFJPY",
        "EURUSD": "EURUSD",
        "GBPUSD": "GBPUSD",
        "CADCHF": "CADCHF",
        "NZDCAD": "NZDCAD",
        "EURGBP": "EURGBP",
    }

    const order = {};
    order.size = CONFIG.size;

    const splitLines = str => str.split(/\r?\n/);
    const splitted = splitLines(text.toLowerCase());

    splitted.forEach((e) => {
        // check for the pair
        for (let [key, value] of Object.entries(pairs)) {
            if (e.includes(key.toLowerCase())) {
                order.ticker = value;

                // change the size to half when it's the GBP pair
                if(e.includes("gbp")) {
                    order.size = order.size / 2;
                }
            }
        }

        if (e.includes('buy')) {
            order.type = 'BUY'
        } else if (e.includes('sell')) {
            order.type = 'SELL'
        }

        if (e.includes('sl')) {
            order.stop_loss = e.split(" ")[1];
        }

        if (e.includes('tp')) {
          console.log("tp")
            order.take_profit = e.split(" ")[1];
        }
    });

    // fix JPY pairs
    if (order.ticker) {
        order.stop_loss = order.ticker.includes("JPY") ? parseFloat(order.stop_loss).toFixed(3) : parseFloat(order.stop_loss).toFixed(5);
        order.take_profit = order.ticker.includes("JPY") ? parseFloat(order.take_profit).toFixed(3) : parseFloat(order.take_profit).toFixed(5);
    }

    return order;
}

setToken();

module.exports = { setToken, generateOrder, marketOrder };