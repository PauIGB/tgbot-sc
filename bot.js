/**
 * Primitive tg bot
 * sending just 2 messages in group based on input data
 * required to be added in group and got admin rights
 * @param {string} private_message 2024-04-03 14:00
 * @author nil
 */

// @ts-check
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const { GROUP_ID, OWNER_ID, TOKEN } = process?.env || {};

const FORMAT = 'YYYY-MM-DD HH:MM'

// TODO: clear interval needed

const bot = new TelegramBot(TOKEN, { polling: true, webHook: { port: 3000 } });

let aDayInterval;
let anHourInterval;

/**
 * Listen to bot messages
 */
bot.on('message', (message) => {

  const messageText = message?.text;
  console.log('....... here ........', message);
  // all dotenv values are strings
  if (OWNER_ID !== String(message?.from?.id)) {
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

  if (!messageText?.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
    bot.sendMessage(GROUP_ID, `Incorrect format. Use following format: ${FORMAT}`);
    return;
  }

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
  if (notification24hBefore > 0) {
    setTimeout(() => {
      aDayInterval = bot.sendMessage(GROUP_ID, `Reminder! Don't forget to join the conference on ${dateInBishkekFormat}`);
    }, notification24hBefore - Date.now());
  }
  if (notification1hBefore > 0) {
    setTimeout(() => {
      bot.sendMessage(GROUP_ID,  `We will start soon! Don't forget to join the conference on ${dateInBishkekFormat}`);
    }, notification1hBefore - Date.now());
  }

});
