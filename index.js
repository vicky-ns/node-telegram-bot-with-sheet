const express = require('express');
const telegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const { GoogleSpreadsheet } = require('google-spreadsheet');
app.use(express.json());

// File handling package
const fs = require('fs');
const e = require('express');
const crypto = require("crypto");
const { send } = require('process');
const axios = require('axios');
const { query } = require('express');


const moment = require("moment");
const momentTimezone = require("moment-timezone");

// const date = new Date();

// spreadsheet key is the long id in the sheets URL
// const RESPONSES_SHEET_ID = '1WZJHrp93wCTwsuGc1Cs5zy3LaQa1ZfwWVVxSZ3IqNDI';
const RESPONSES_SHEET_ID = "1ozjZwvoF37C2A05WciI1nAVYwiTMp1hvotc_JzlooQ0";

// Create a new document
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);

// Credentials for the service account
const CREDENTIALS = JSON.parse(fs.readFileSync('sample.json'));

const TOKEN = "5793784616:AAGiTgoOcv0JVhEOELYh7oPDViDH3xaI_B0";
const port = process.env.PORT || 8080;

const bot = new telegramBot(TOKEN, { polling: true });

var arrData = {};


bot.onText(/\/start/, async (msg) => {
    console.log("start testing------")
    const chatId = msg.chat.id;
    // send messaes with buttons
    bot.sendMessage(
        chatId,
        `Hello ${msg.from.first_name} Thank You! for starting Tiger. kindly select the Quantity you want`,
        {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    // [{ text: 'AQUAFINA', callback_data: 'AQUAFINA' }],
                    // [{ text: 'TIGER', callback_data: 'TIGER' }],
                    // [{ text: 'BISLERI', callback_data: 'BISLERI' }],
                    // [{ text: 'KINLEY', callback_data: 'KINLEY' }]
                    [{ text: '300 ML', callback_data: '300 ML' }],
                    [{ text: '20 LITER', callback_data: '20 LITER' }],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            })

        }

    );
    arrData = {};
});

bot.on("polling_error", async (error) => {
    console.log("pooling error", error);

});

bot.on("callback_query", async (query) => {
    console.log("checkinh query ", query);
    const chatId = query.message.chat.id;
    try {

        if (query.data == "300 ML") {
            console.log("if block 1-----")
            bot.sendMessage(
                chatId,
                `Please select the No.s`,
                {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: '36 nos', callback_data: '36 nos' }],
                            // [{ text: '20 nos', callback_data: '20 nos' }],
                            // [{ text: '30 nos', callback_data: '30 nos' }],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    })

                }

            );
            //arrData.push({ "type": query.data });
            Object.assign(arrData, { "type": query.data })
            // console.log("check numbers -------- ", bot.sendMessage)
        }

        if (query.data == "20 LITER") {
            console.log("if block 1-----")
            bot.sendMessage(
                chatId,
                `Please select the No.s`,
                {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{ text: '2 nos', callback_data: '2 nos' }],
                            [{ text: '4 nos', callback_data: '4 nos' }],
                            [{ text: '6 nos', callback_data: '6 nos' }],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    })

                }

            );
            //arrData.push({ "type": query.data });
            Object.assign(arrData, { "type": query.data })
            // console.log("check numbers -------- ", bot.sendMessage)
        }

        if (query.data == "2 nos" || query.data == "4 nos" || query.data == "6 nos" || query.data == "36 nos") {
            console.log("if block 2-----")
            bot.sendMessage(chatId, `Thanks your order has been added in your cart...Kindly please share your location`, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: "Send Location",
                                request_location: true,
                            },
                            {
                                text: "Cancel",
                                // request_location: true,
                            }
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    remove_keyboard: true,

                },
            });
            //arrData.push({ "quantity": query.data });
            Object.assign(arrData, { "quantity": query.data })
            // console.log("check location -------- ", bot.sendMessage)
        }

    } catch (err) {
        console.log("catch err", err)
    }
});

// cancel button pressed 
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    try {
        if (msg.text === "Cancel") {
            // remove keyboard
            bot.sendMessage(chatId, "Thank you", {
                reply_markup: {
                    remove_keyboard: true,
                },
            });
        }
        if (msg.text === "update" || msg.text === "Update") {
            bot.sendMessage(chatId, "For verification send your phone number", {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: "phone",
                                request_contact: true,
                            },
                            {
                                text: "Cancel"
                            }
                        ],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    remove_keyboard: true,

                },
            });
        }
    } catch (error) {
        console.log(error);
        bot.sendMessage(chatId, "There was an error");
    }
});

//location 
bot.on("location", async (msg) => {
    // console.log("checking location");
    // console.log("checking location masg ---", msg);
    // console.log("checking location masg ---", msg.location.latitude);
    // console.log("checking location masg ---", msg.location.longitude);
    const chatId = msg.chat.id;
    if (msg.location.latitude != null) {
        bot.sendMessage(chatId, "Thanks for providing location... Please send your mobile number for order confirmation", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "phone",
                            request_contact: true,
                        },
                        {
                            text: "Cancel"
                        }
                    ],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
                remove_keyboard: true,

            },
        });
        //arrData.push({ "address": msg.location.latitude + "," + msg.location.longitude });
        Object.assign(arrData, { "address": msg.location.latitude + "," + msg.location.longitude })
    }
});

//mobile number
bot.on("contact", async (msg) => {
    // console.log("checking mob number ", msg)
    // console.log("checking mob number ", msg.contact.phone_number)
    const chatId = msg.chat.id;

    if (msg.contact.phone_number == "919361946834") {
        bot.sendMessage(chatId, "Enter orderID", {
            reply_markup: {
                // keyboard: [
                //     [
                //         {
                //             text: "phone",
                //             request_contact: true,
                //         },
                //         {
                //             text: "Cancel"
                //         }
                //     ],
                // ],
                resize_keyboard: true,
                one_time_keyboard: true,
                remove_keyboard: true,

            },
        });
        updateData();
    }
    else if (msg.contact.phone_number != null) {
        bot.sendMessage(chatId, "Thank you! your oder has been placed successfully..." + '   ' + "Select /start to re-order Thank you!!!", {
            reply_markup: {
                // keyboard: [
                //     [
                //         {
                //             text: "phone",
                //             request_contact: true,
                //         },
                //         {
                //             text: "Cancel"
                //         }
                //     ],
                // ],
                resize_keyboard: true,
                one_time_keyboard: true,
                remove_keyboard: true,

            },
        });
        // bot.sendMessage(chatId, "Select /start to re-order Thank you!!!")
        //arrData.push({ "mobile": msg.contact.phone_number });
        Object.assign(arrData, { "mobile": msg.contact.phone_number })
        console.log("arrData print ----------> ", arrData)
        addPostData();
    }
});

app.listen(port, () => {
    console.log("server is up on 4002")
});

//add datas to google sheet
const addPostData = async () => {

    try {

        const d2_date = momentTimezone.tz(Date.now(), "Asia/Kolkata").format("MMMM Do YYYY, h:mm:ss a");
        console.log(" d2_date ----->", d2_date)
    
        var current_date = moment(new Date()).format("MMMM Do YYYY, h:mm:ss a");
        console.log("Current Time stamp current_date:", current_date);

        var addressRespo = await axios(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${arrData.address}&key=AIzaSyB05pReW8IsUyyv2RpbTc7bWFKw7ptfrrQ`)

        var addre = addressRespo.data.results[0].formatted_address;

        let rows = [];
        var ordId = "#" + crypto.randomBytes(4).toString("hex").toUpperCase();
        var date1 = d2_date;
        var status = "False";
        var brand = "TIGER";
        var payment = "POD"

        rows.push({ "Order_id": ordId, "Date": date1, "Status": status, "Brand": brand, "Type": arrData.type, "Quantity": arrData.quantity, "Payment": payment, "Address": addre, "Mobile": arrData.mobile })

        // console.log("rows =====>", rows)

        // use service account creds
        await doc.useServiceAccountAuth({
            client_email: CREDENTIALS.client_email,
            private_key: CREDENTIALS.private_key
        });

        // load the documents info
        await doc.loadInfo();

        // Index of the sheet
        let sheet = doc.sheetsByIndex[0];
        // console.log("check sheet----", sheet)

        var arrData1 = [];
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            await sheet.addRow(row);
            arrData1.push({ row })
        }
        console.log({ "status": true, "message": "added  successfully", "data": arrData1 });

    } catch (err) {
        console.log("catch err on add", err)
    }
};

const updateData = async () => {

    try {
        var orderFound = false;
        console.log("update data try block")
        bot.on("message", async (msg) => {
            const chatId = msg.chat.id;
            // console.log("update data msg----", msg.text)
            const updated_orderid = msg.text;
            console.log("updated_orderid----", updated_orderid)

            var order_id1 = updated_orderid

            // use service account creds
            await doc.useServiceAccountAuth({
                client_email: CREDENTIALS.client_email,
                private_key: CREDENTIALS.private_key
            });

            await doc.loadInfo();

            // Index of the sheet
            let sheet = doc.sheetsByIndex[0];

            let rows = await sheet.getRows();
            //console.log("rows -------->", rows)

            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];

                console.log("extract data -------------> ", row.Order_id)

                if (row.Order_id == order_id1) {
                    // console.log("checking if ififififif")
                    row.Status = "TRUE";
                    orderFound = true;
                    // row.password = req.body.password;
                    await row.save();
                    break;
                }

            };
            console.log("checkig oderfound ----->", orderFound)
            if (!orderFound) {  
                console.log("if order found")
                bot.sendMessage(chatId, "Invalid ordrID")
            } else {
                console.log("else order found")
                bot.sendMessage(chatId, "updated successfully")
            }
            // console.log({ "status": true, "message": "updated successfully" });
            // res.send();
        })
    } catch (err) {
        console.log("catch updare error -----", err)
    }
}

app.get("/", (req, res) => {
    res.send("T server running ")
});

console.log(`BOT TOEKN: ${TOKEN}`)

