const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


app.get("/", (req, res) => {

    res.json({
        status: "JARVIS AI server is running"
    });

});


app.post("/api/chat", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message) {

            return res.status(400).json({
                reply: "No message received."
            });

        }


        const response = await openai.responses.create({

            model: "gpt-5.6-luna",

            input: [
                {
                    role: "developer",

                    content:
                        "You are JARVIS, a highly intelligent personal AI assistant. " +
                        "Think carefully, solve problems step by step, explain clearly, " +
                        "and help the user improve their projects and ideas."
                },

                {
                    role: "user",

                    content: message
                }
            ]

        });


        res.json({

            reply:
                response.output_text ||
                "I could not generate a response."

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            reply:
                "JARVIS encountered an error while thinking."

        });

    }

});


const PORT =
    process.env.PORT || 10000;


app.listen(

    PORT,

    "0.0.0.0",

    () => {

        console.log(
            `JARVIS server running on port ${PORT}`
        );

    }

);
