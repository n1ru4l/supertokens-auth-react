import express from "express";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import EmailVerification from "supertokens-node/recipe/emailverification";
import { middleware, errorHandler } from "supertokens-node/framework/express";
import cors from "cors";
import { generateOtpAndMapToToken, mailTransporter, getMessageBody } from "./utils";
import Dashboard from "supertokens-node/recipe/dashboard";

import dotenv from "dotenv";
dotenv.config();

let otpToTokenMapping = new Map<string, string>();

const apiPort = 3001;
const apiDomain = `http://localhost:${apiPort}`;
const websitePort = 3000;
const websiteDomain = `http://localhost:${websitePort}`;

supertokens.init({
    framework: "express",
    supertokens: {
        // TODO: This is a core hosted for demo purposes. You can use this, but make sure to change it to your core instance URI eventually.
        connectionURI: "https://try.supertokens.io",
        apiKey: "<REQUIRED FOR MANAGED SERVICE, ELSE YOU CAN REMOVE THIS FIELD>",
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
        appName: "SuperTokens Demo App", // TODO: Your app name
        apiDomain, // TODO: Change to your app's API domain
        websiteDomain, // TODO: Change to your app's website domain
    },
    recipeList: [
        EmailVerification.init({
            mode: "REQUIRED",
            emailDelivery: {
                service: {
                    sendEmail: async ({ user, emailVerifyLink: url }) => {
                        // retrieve the token from the url
                        const token = new URL(url).searchParams.get("token");

                        if (token !== null) {
                            // generate a 6 digit otp
                            let otp = generateOtpAndMapToToken(token, otpToTokenMapping);
                            console.log(otp, user.email);
                            try {
                                /**
                                 * This will not work if you have not set up your email credentials in the .env file. Refer to .env.example
                                 * in this example app to know which environment variables you need to set.
                                 */
                                await mailTransporter.sendMail({
                                    from: process.env.NODEMAILER_USER,
                                    to: user.email,
                                    subject: "SuperTokens Demo OTP",
                                    html: getMessageBody(otp, user.email),
                                });
                            } catch {
                                // We ignore this in the example so the example is still usable by getting the otp from the console
                            }
                        }
                    },
                },
            },
            override: {
                apis: (oI) => {
                    return {
                        ...oI,
                        verifyEmailPOST: async (input) => {
                            if (oI.verifyEmailPOST === undefined) {
                                throw Error("should not come here");
                            }

                            // retrieve the otp from input
                            let otp = input.token;

                            // retrieve the token mapped to the otp if it exists
                            let superTokensToken = otpToTokenMapping.get(otp);
                            console.log(superTokensToken);
                            if (superTokensToken !== undefined) {
                                // if the mapping exists set the token value in the input object to the retrieved token.
                                input.token = superTokensToken;

                                // remove the otp and token from the mapping
                                otpToTokenMapping.delete(otp);
                            } else {
                                // If the mapping does not exist return an invalid token error
                                return {
                                    status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR",
                                };
                            }

                            let response = await oI.verifyEmailPOST(input);
                            return response;
                        },
                    };
                },
            },
        }),
        ThirdPartyEmailPassword.init({
            providers: [
                // We have provided you with development keys which you can use for testing.
                // IMPORTANT: Please replace them with your own OAuth keys for production use.
                {
                    config: {
                        thirdPartyId: "google",
                        clients: [
                            {
                                clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                                clientSecret: "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",
                            },
                        ],
                    },
                },
                {
                    config: {
                        thirdPartyId: "github",
                        clients: [
                            {
                                clientId: "467101b197249757c71f",
                                clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd",
                            },
                        ],
                    },
                },
            ],
        }),
        Session.init(), // initializes session features
        Dashboard.init(),
    ],
});

const app = express();

app.use(
    cors({
        origin: websiteDomain,
        allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
        credentials: true,
    })
);

app.get("/test/otps", (req, res) => {
    res.json({ otps: Array.from(otpToTokenMapping.keys()) });
});

app.use(middleware());

app.use(errorHandler());

app.listen(apiPort, () => console.log(`API Server listening on port ${apiPort}`));
