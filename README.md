# Telegram messages into SimpleFX orders
I decided to make this repo public for whoever want to use m code as a referance, I haven't used this in a while so I might be outdated. 

# Usage

1. create a telegram bot by connecting with the [BotFather](https://telegram.me/BotFather), start the bot, click /newbot, give your bot a name and you have yourself a bot. KEEP THE API TOKEN SAFE!
2. Make an account on [SimpleFX](https://simplefx.com/n/_23326), go to the [API Client](https://app.simplefx.com/api-client) and create a API key
3. Edit the config.js file and add the required values
4. Start the bot with `node telegram-bot.js`
5. Interact with your bot by chatting with it

## A sample order would be
```
BUY AUDJPY
sl 12.001
tp 15.500
```