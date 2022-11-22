"use strict";

require('dotenv').config({ path: '/server/PARAM.env' })

const express = require("express");
const user_dao = require('../dao/userdao.js');
const {check, validationResult} = require("express-validator");

const router = express.Router();

// To hash user password
const bcrypt = require("bcrypt");

// To generate random activation code
const crypto = require("crypto");

// To send email
const Mailjet = require('node-mailjet');
const mailjet = Mailjet.apiConnect(
    process.env.EMAIL_API_KEY,
    process.env.EMAIL_SECRET_KEY
);

/** Register new user **/

router.post('/register',
    [
        check('email').isEmail(),
        check('role').isLength({ min: 3 })
    ],
    async (req, res) => {
        const email = req.body.email;
        const role = req.body.role;
        const name = req.body.name;
        const surname = req.body.surname;
        const username = req.body.username;
        const pass = req.body.password;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors });
        }

        try {
            // Generate hash password
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(pass, salt);

            if (await user_dao.getUserByEmail(email) !== undefined) {
                return res.status(500).json({ error: "Email already registered!" });
            }
            if (await user_dao.getUserByUsername(username) !== undefined) {
                return res.status(500).json({ error: "Username already used!" });
            }

            await user_dao.insertUser(email, password, salt, role, name, surname, username);

            // Generate activation code
            const code = crypto.randomBytes(64).toString('hex');

            const activation = await user_dao.insertActivation(email, code);
            const activationUrl = "http://localhost:3000/validate/" + code;

            // Send email with activation code
            const request = mailjet
                .post("send", { 'version': 'v3.1' })
                .request({
                    "Messages": [
                        {
                            "From": {
                                "Email": "team7sw2@gmail.com",
                                "Name": "HikeTracker"
                            },
                            "To": [
                                {
                                    "Email": email,
                                    "Name": name
                                }
                            ],
                            "Subject": "Activate your account",
                            "TextPart": "Account activation email",
                            "HTMLPart": `<h3>Hello, ${name}, to activate your account, click <a href=${activationUrl}>here</a>!</h3><br />`,
                            "CustomID": "EmailVerification"
                        }
                    ]
                })
            request
                .then((result) => {
                })
                .catch((err) => {
                    console.log(err.statusCode)
                })

            return res.status(200).json({ code: activation });
        } catch (err) {
            return res.status(500).json({ error: err });
        }
    })


/** Validate user **/

router.get('/validate/:code', async (req, res) => {
    const code = req.params.code;
    try {
        // Retrieves activation
        const activation = await user_dao.getActivationByCode(code)

        // Activate user
        await user_dao.activateUser(activation.email)

        // Delete activation from table
        await user_dao.deleteActivation(activation.email)

        const user = await user_dao.getUserByEmail(activation.email)

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: err })
    }
})

module.exports = router;