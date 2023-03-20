const app = require("express")();
const { v4 } = require("uuid");
const { Client, GatewayIntentBits } = require("discord.js");
import { Client as NotionClient } from "@notionhq/client";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const notionSecret = process.env.NOTION_SECRET;

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const notion = new NotionClient({ auth: notionSecret });
discordClient.login(DISCORD_BOT_TOKEN);

discordClient.on("ready", () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on("messageCreate", async (message) => {
  if (message.content.toLowerCase().includes("notintel"))
    await writeToNotion(message.author.tag, message.content);
});

async function writeToNotion(user, message) {
  const response = await notion.pages.create({
    cover: {
      type: "external",
      external: {
        url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg",
      },
    },
    icon: {
      type: "emoji",
      emoji: "🥬",
    },
    parent: {
      type: "database_id",
      database_id: process.env.NOTION_DB_2,
    },
    properties: {
      User: {
        title: [
          {
            text: {
              content: user,
            },
          },
        ],
      },

      Message: {
        rich_text: [
          {
            text: {
              content: message,
            },
          },
        ],
      },
    },
    children: [],
  });
}

app.get("/api", (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Token is: ${DISCORD_BOT_TOKEN}`);
});

app.get("/api/item/:slug", (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${test}`);
});

module.exports = app;
