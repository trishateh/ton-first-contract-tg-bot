import { beginCell, toNano } from "@ton/core";
import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import qs from "qs"; 

dotenv.config();

const bot = new Telegraf(process.env.TG_BOT_TOKEN!);

bot.start((ctx) =>
  ctx.reply("Welcome to our counter app!", {
    reply_markup: {
      keyboard: [
        // create 3 buttons
        ["Increment"],
        ["Deposit 0.05 TON"],
        ["Withdraw 0.02 TON"],
      ],
    },
  })
);

bot.on(message("web_app_data"), (ctx) => ctx.reply("ok"))

bot.hears("Increment", (ctx) => {
  const msg_body = beginCell().storeUint(1, 32).storeUint(5, 32).endCell();

  let link = `https://test.tonhub.com/transfer/${
    process.env.SC_ADDRESS
  }?${qs.stringify({
    text: "Increment counter",
    amount: toNano("0.05").toString(10),
    bin: msg_body.toBoc({ idx: false }).toString("base64"),
  })}`;

  ctx.reply("To increment counter, please sign a transaction:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Sign transaction",
            url: link,
          },
        ],
      ],
    },
  });
});

bot.hears("Deposit 0.05 TON", (ctx) => {
    const msg_body = beginCell().storeUint(2, 32).endCell();
  
    let link = `https://test.tonhub.com/transfer/${
      process.env.SC_ADDRESS
    }?${qs.stringify({
      text: "Deposit 0.05 TON",
      amount: toNano("0.05").toString(10),
      bin: msg_body.toBoc({ idx: false }).toString("base64"),
    })}`;
  
    ctx.reply("To deposit 0.05 TON, please sign a transaction:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Sign transaction",
              url: link,
            },
          ],
        ],
      },
    });
  });

bot.hears("Withdraw 0.02 TON", (ctx) => {
    const msg_body = beginCell().storeUint(3, 32).storeCoins(toNano("0.02")).endCell();
  
    let link = `https://test.tonhub.com/transfer/${
      process.env.SC_ADDRESS
    }?${qs.stringify({
      text: "Withdraw 0.02 TON",
      amount: toNano("0.05").toString(10),
      bin: msg_body.toBoc({ idx: false }).toString("base64"),
    })}`;
  
    ctx.reply("To withdraw 0.02 TON, please sign a transaction:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Sign transaction",
              url: link,
            },
          ],
        ],
      },
    });
  });

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
