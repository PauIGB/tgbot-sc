/**
 * Primitive tg bot
 * sending just 2 messages in group based on input data
 * required to be added in group and got admin rights
 * @param {string} private_msg 2024-04-03 14:00
 * @author nil
 */

// @ts-check
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const { GROUP_ID, OWNER_ID, TOKEN } = process?.env || {};

// TODO: clear interval needed

const bot = new TelegramBot(TOKEN, { polling: true });

/**
 * Listen to bot messages
 */

bot.on('message', (msg) => {
  // all dotenv values are strings
  console.log('mst', msg)
  const messageText = msg.text;
  // console.log(typeof OWNER_ID);
  if (OWNER_ID !== String(msg?.from?.id)) {
    return;
  }

  const options = { 
    timeZone: 'Asia/Bishkek', 
    weekday: 'long', // weekday
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: false // 24 hours format
  };
  const dateInBishkekFormat = `${new Date('2024-04-06 11:00').toLocaleString('en-US', options)} Asia/Bishkek`
  console.log('here ......')
 bot.sendMessage(GROUP_ID, `The conference is scheduled for *${dateInBishkekFormat}*\\. Enjoy the discussion\\!`, { parse_mode: "MarkdownV2" });
 return;
  if (messageText?.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
    const conferenceDateTime = new Date(`${messageText} GMT+6`);
    const dateInBishkekFormat = `${new Date(conferenceDateTime).toLocaleString('en-US', options)} Asia/Bishkek`;

    const notification24hBefore = new Date(conferenceDateTime.getTime() - 24 * 60 * 60 * 1000);
    const notification1hBefore = new Date(conferenceDateTime.getTime() - 60 * 60 * 1000);

    /**
     * Sends 3 messages
     * 1 - conference is scheduled
     * 2 - reminder in 24 hours
     * 3 - reminder in hour
     * 
     * It may work incorrectly as setTimeout is used here
     */

    bot.sendMessage(GROUP_ID, `Conference is scheduled for ${dateInBishkekFormat}`);
    setTimeout(() => {
      bot.sendMessage(GROUP_ID, `Reminder! Don't forget to join the conference on ${dateInBishkekFormat}`);
    }, notification24hBefore - Date.now());
    setTimeout(() => {
      bot.sendMessage(GROUP_ID,  `We will start soon! Don't forget to join the conference on ${dateInBishkekFormat}`);
    }, notification1hBefore - Date.now());
  }
});
