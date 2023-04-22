import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    console.log(client); // Add this line
    const db = client.db("bloom");

    switch (req.method) {
        //... login
        case "POST":
            let user = await db.collection("users").find({ email: req.body.email }).toArray();
            if (user.length !== 0) {
                bcrypt.compare(req.body.password, user[0].password, function (err, isMatch) {
                    if (err) {
                        throw err;
                    } else if (!isMatch) {
                        return res.json({ status: false, message: 'Email and/or password are not correct!' });
                    } else {
                        return res.json({ status: true, data: user });
                    }
                });
            } else {
                return res.json({ status: false, message: 'Email and/or password are not correct!' });
            }
            break;
        
        //... get profile info
        case "GET":
    let profile = await db.collection("users").findOne({_id: new ObjectId(req.query.id)});
    return res.json({ status: true, data: profile });


        //... update profile
  //... update profile
  case "PUT":
    const { id } = req.query;
    let updateData = {
        name: req.body.data.name,
        email: req.body.data.email,
        profile_path: req.body.data.profile_path,
    };

    if (req.body.data.password) {
        updateData.password = bcrypt.hashSync(req.body.data.password, 10);
    }

    if (req.body.data.email_newsletter !== undefined) {
        updateData.email_newsletter = req.body.data.email_newsletter;
    }

    if (req.body.share_custom_varieties !== undefined) {
        updateData.share_custom_varieties = req.body.share_custom_varieties;
    }

    if (req.body.subscriptionId !== undefined) {
        updateData.subscriptionId = req.body.subscriptionId;
    }

    await db.collection("users").updateOne(
        {
            _id: new ObjectId(id),
        },
        {
            $set: updateData,
        }
    );
    return res.json({ status: true, message: 'Your profile has been updated successfully.' });


        //... delete user
        case "DELETE":
            await db.collection("users").deleteOne({_id: new ObjectId(req.query)});
            return res.json({ status: true, message: 'Your account has been closed.' });


            case "POST_RESET":
                try {
                    const { email } = req.body;
                    if (!email) {
                        return res.status(400).json({ message: "Email is required" });
                    }
        
                    const user = await db.collection("users").findOne({ email });
                    if (!user) {
                        return res.status(404).json({ message: "User not found" });
                    }
        
                    const token = crypto.randomBytes(32).toString("hex");
                    const expires = Date.now() + 3600000; // 1 hour from now
        
                    await db.collection("users").updateOne({ _id: user._id }, { $set: { resetPasswordToken: token, resetPasswordExpires: expires } });
        
                    // Send reset password email
                    await sendResetPasswordEmail(email, token);
        
                    res.json({ message: "Reset password email sent" });
                } catch (error) {
                    res.status(500).json({ message: "An error occurred while resetting the password" });
                }
                break;
        }
        
        async function sendResetPasswordEmail(email, token) {
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset",
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\nhttp://${req.headers.host}/account/reset-password/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
        
            await transporter.sendMail(mailOptions);

    }
}