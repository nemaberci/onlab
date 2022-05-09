var amqp = require("amqplib/callback_api");
const fetch = require("node-fetch");

const connString = process.env.CONNECTION_STRING || "amqp://localhost";
const apiKey = process.env.API_KEY || "";

var connected = false;

async function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

async function sendEmail(body) {
  console.log("Sending: ", body, " to server");

  try {
    let res = await fetch(
      `https://prod-122.westeurope.logic.azure.com:443/workflows/560c69b572684f08b6ad2682f0c0b17d/triggers/manual/paths/invoke?${apiKey}`,
      {
        body: JSON.stringify(body),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(res);
  } catch (e) {
    console.log(e);
  }
}

async function connect() {
  while (!connected) {
    await sleep(5000);
    amqp.connect(connString, (err, conn) => {
      if (err) {
        console.log("Could not connect, reconnecting!");
        return;
      }

      console.log("Connected!");
      connected = true;

      conn.createChannel((err1, channel) => {
        if (err1) {
          throw err1;
        }

        const queueName = "solution-comment-message";

        channel.assertQueue(queueName, { durable: false });

        channel.consume(queueName, (message) => {
          let contentJson = JSON.parse(message.content.toString());
          console.log(contentJson);

          if (
            !contentJson["to"] ||
            !contentJson["reviewedBy"] ||
            typeof contentJson["text"] === "undefined"
          ) {
            return;
          }

          let content;
          if (contentJson["text"].trim().length === 0) {
            content = `He left no comment for his review.`;
          } else {
            content = `He also left the following comment on his review: \n${contentJson[
              "text"
            ]}`;
          }

          sendEmail({
            to: contentJson["to"],
            subject: `Your submitted solution was reviewed!`,
            reviewerEmailAddress: contentJson["reviewedBy"],
            comment: content,
          });
        });
      });
    });
  }
}

connect();
