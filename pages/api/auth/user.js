import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import nodemailer from 'nodemailer';

async function sendResetPasswordEmail(email, resetToken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${process.env.APP_URL}/account/reset-password?token=${resetToken}`,
    };

    return transporter.sendMail(mailOptions);
}

export default async function handler(req, res) {
    const client = await clientPromise;
    console.log(client);
    const db = client.db("bloom");

    if (req.method === "POST") {
        if (req.body.method === "FORGOT_PASSWORD") {
            try {
                const user = await db.collection("users").findOne({ email: req.body.email });
                if (!user) {
                    return res.json({ status: false, message: 'Email not found!' });
                } else {
                    // Send reset password email
                    const resetToken = await generateResetToken();
                    await sendResetPasswordEmail(user.email, resetToken);
                    await db.collection("users").updateOne({ _id: user._id }, { $set: { resetToken } });
                    return res.json({ status: true, message: 'Reset password email sent!' });
                }
            } catch (error) {
                console.error('Error in FORGOT_PASSWORD:', error);
                return res.json({ status: false, message: 'An error occurred while processing your request.' });
            }
        } else if (req.body.method === "RESET_PASSWORD") {
            try {
                const { token, password } = req.body;
                const user = await db.collection("users").findOne({ resetToken: token });
                if (!user) {
                    return res.json({ status: false, message: 'Invalid or expired reset token!' });
                } else {
                    const newPasswordHash = bcrypt.hashSync(password, 10);
                    await db.collection("users").updateOne({ _id: user._id }, { $set: { password: newPasswordHash, resetToken: null } });
                    return res.json({ status: true, message: 'Password has been reset successfully!' });
                }
            } catch (error) {
                console.error(error);
                return res.json({ status: false, message: 'An error occurred while processing your request.' });
            }
        } else {
            // LOGIN code
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
        }
    } else {
        switch (req.method) {
            //... get profile info
            case "GET":
                let profile = await db.collection("users").findOne({ _id: new ObjectId(req.query.id) });
                return res.json({ status: true, data: profile });

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
                await db.collection("users").deleteOne({ _id: new ObjectId(req.query.id) });
                return res.json({ status: true, message: 'Your account has been closed.' });

            default:
                return res.json({ status: false, message: 'Invalid request method!' });
        }
    }
}
