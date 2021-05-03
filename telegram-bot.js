const TelegramBot = require('node-telegram-bot-api');
const lib = require('./cv-message-to-order');
const config = require('./config');
const cron = require('node-cron');

const token = config.telegramBotToken;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
bot.on("polling_error", (msg) => console.log(msg));
bot.on('message', (msg) => {

    // get ID from the one who chats
    const chatId = msg.chat.id;
    const text = msg.text ? msg.text: '';
    const trade = lib.generateOrder(text);

    console.log('[i] Order created', trade);

    // send a message to the chat acknowledging receipt of their message
    if (trade.ticker && trade.type && trade.take_profit&& trade.stop_loss) {
        bot.sendMessage(chatId, `Order placed ✅`);
        bot.sendMessage(chatId, JSON.stringify(trade));
        lib.marketOrder(trade.ticker, trade.type, trade.size, trade.take_profit, trade.stop_loss);
    } else {
        bot.sendMessage(chatId, `I don't know fam 🤔`);
        bot.sendMessage(chatId, JSON.stringify(trade));
    }
});

// Node cron to replenish the auth token
cron.schedule('00 */6 * * *', () => {
    lib.setToken();
});