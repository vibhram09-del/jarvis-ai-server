const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());

app.use(express.json({
    limit: "1mb"
}));


/*
|--------------------------------------------------------------------------
| OpenAI
|--------------------------------------------------------------------------
*/

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/*
|--------------------------------------------------------------------------
| Server Status
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {

    res.status(200).json({

        status: "JARVIS AI server is running",

        service: "online"
    });
});


/*
|--------------------------------------------------------------------------
| AI Chat Endpoint
|--------------------------------------------------------------------------
*/

app.post("/api/chat", async (req, res) => {

    try {

        const message =
            req.body?.message?.trim();


        if (!message) {

            return res.status(400).json({

                reply:
                    "No message received."
            });
        }


        if (!process.env.OPENAI_API_KEY) {

            console.error(
                "OPENAI_API_KEY is missing"
            );


            return res.status(500).json({

                reply:
                    "JARVIS server is missing its AI configuration."
            });
        }


        console.log(
            "User message:",
            message
        );


        const response =
            await openai.responses.create({

                model:
                    "gpt-5.6-luna",

                input: [

                    {

                        role:
                            "developer",

                        content:
                            `You are JARVIS, an intelligent AI assistant.

Your responsibilities:

- Think carefully about the user's question.
- Solve problems accurately.
- Explain answers clearly.
- Help with programming and projects.
- Help the user learn.
- Break complex problems into understandable steps.
- Be honest when information is uncertain.
- Do not claim that you can modify yourself, deploy code, access devices, or perform actions unless the system actually provides that capability.

Respond naturally and intelligently.`
                    },

                    {

                        role:
                            "user",

                        content:
                            message
                    }
                ]
            });


        const reply =
            response.output_text?.trim() ||
            "I could not generate a response.";


        console.log(
            "JARVIS reply:",
            reply
        );


        return res.status(200).json({

            reply:
                reply
        });


    } catch (error) {

        console.error(
            "OpenAI error:",
            error
        );


        return res.status(500).json({

            reply:
                "JARVIS encountered an error while thinking.",

            error:
                process.env.NODE_ENV === "production"
                    ? undefined
                    : error.message
        });
    }
});


/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {

    res.status(404).json({

        reply:
            "Endpoint not found."
    });
});


/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const PORT =
    process.env.PORT ||
    10000;


app.listen(

    PORT,

    "0.0.0.0",

    () => {

        console.log(

            `JARVIS server running on port ${PORT}`
        );
    }
);
