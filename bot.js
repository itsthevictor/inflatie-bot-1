// Packages and Setup
const Telegraf = require("telegraf");
const axios = require("axios");
require("dotenv").config();
const bot = new Telegraf(process.env.BOT_KEY);
const s = "tg";
//Bot Functionality
const params = {};
params.year = "";
bot.command("calculeaza", async (ctx) => {
  params.year = "";
  params.sum = "";

  ctx.reply("Ce valoare vrei să ajustez?");
  bot.use(async (ctx, next) => {
    if (ctx.message.text === "/info") {
      console.log("ajusteaza");
      ctx.reply(
        "🤖 Acest bot a fost creat de @theonca (Onca Studio) și folosește API-ul calculatorulinflatiei.ro"
      );
      return;
    }
    const input1 = ctx.message.text;
    params.sum = input1;
    console.log(params.sum);
    const year = parseInt(params.sum).toFixed(0);
    const sum = parseInt(params.year).toFixed(0);
    const datax = { year, sum, s };
    console.log(`${process.env.URL}?year=${params.year}&sum=${params.sum}`);
    if (!params.sum || !params.year) {
      ctx.reply("Față de ce an vrei să compar?");
      const input2 = await ctx.message.text;
      params.year = input2;
      console.log(params);
    } else if (params.sum > 2022) {
      ctx.reply(`⁉️ Anul comparat nu poate fi mai mare decât 2022`);
      return;
    } else if (params.sum < 1971) {
      ctx.reply(`⁉️ Pot calcula maxim până la 1971`);
      return;
    } else {
      console.log(`${process.env.URL}?year=${params.sum}&sum=${params.year}`);
      // let res = await axios.get(
      //   `${process.env.URL}?year=${params.sum}&sum=${params.year}`
      // );
      let res = await axios.post(
        `https://inflatieapi-oqtl6rzuiq-ew.a.run.app/api/v1`,
        datax
      );
      const data = res.data;
      console.log(data);
      ctx.reply(
        `📉 Din ${params.sum} până acum, puterea de cumpărare a sumei de ${params.year} RON a scăzut până la ${data.result.currentValue} RON după o devalorizare netă de ${data.result.netDevaluation}%

📈 suma de ${params.year} RON ajustată cu inflația din ${params.sum} până în prezent, ar avea puterea de cumpărare a ${data.result.adjustedValue} RON
        `
      );
    }
  });
});

function info() {
  bot.command("info", async (ctx) => {
    ctx.reply("Despre acest bot");
  });
}

bot.command("info", async (ctx) => {
  ctx.reply("Despre acest bot");
});

// Bot Launch
bot.launch();
