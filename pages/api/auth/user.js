import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";

async function sendResetEmail(email, resetLink) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Password Reset Request",
        html: `<p>You have requested a password reset. Please click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a><p>If you did not request this password reset, please ignore this email.</p>`,
    };

    return transporter.sendMail(mailOptions);
}



export default async function handler(req, res) {
    const client = await clientPromise;
    console.log(client); // Add this line
    const db = client.db("bloom");

    switch (req.method) {
        //... login
        case "POST":
            if (req.body.forgotPassword) {
                const userEmail = req.body.email;
                const user = await db.collection("users").findOne({ email: userEmail });
        
                if (!user) {
                    res.status(400).json({ message: "No user found with this email address." });
                    break;
                }
        
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });
        
                const resetLink = `http://${req.headers.host}/account/reset-password/${token}`;
        
                await db.collection("users").updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            resetPasswordToken: token,
                            resetPasswordExpires: Date.now() + 3600000,
                        },
                    }
                );
        
                try {
                    await sendResetEmail(userEmail, resetLink);
                    res.status(200).json({ message: "Password reset email sent." });
                } catch (error) {
                    console.error("Error sending reset email: ", error);
                    res.status(500).json({ message: "Error sending password reset email." });
                }
            } else if (req.body.resetPasswordToken) {
                const token = req.body.resetPasswordToken;
                const newPassword = req.body.password;
        
                let user;
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    user = await db.collection("users").findOne({
                        _id: new ObjectId(decoded.id),
                        resetPasswordToken: token,
                        resetPasswordExpires: { $gt: Date.now() },
                    });
                } catch (error) {
                    res.status(400).json({ message: "Invalid or expired reset token." });
                    break;
                }
        
                if (!user) {
                    res.status(400).json({ message: "Invalid or expired reset token." });
                    break;
                }
        
                const hashedPassword = bcrypt.hashSync(newPassword, 10);
        
                await db.collection("users").updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            password: hashedPassword,
                            resetPasswordToken: null,
                            resetPasswordExpires: null,
                        },
                    }
                );
        
                res.status(200).json({ message: "Password has been reset successfully." });
            } else {
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
    }
}