// forgot-password.js
import clientPromise from '../../../lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noah@bloommanager.com',
    pass: 'REPLACE',
  },
});

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('bloom');

  switch (req.method) {
    case 'POST':
      const user = await db
        .collection('users')
        .findOne({ email: req.body.email });

      if (!user) {
        return res.json({
          status: false,
          message: 'No account found with this email.',
        });
      }

      const token = uuidv4();
            await db.collection('users').updateOne(
                { _id: user._id },
                { $set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 } }
              );
        
              const mailOptions = {
                from: 'noah@bloommanager.com',
                to: user.email,
                subject: 'Password Reset Request',
                text: `You are receiving this email because you (or someone else) requested a password reset for your account.
        
        Please click on the following link or paste it into your browser to complete the process:
        
        http://${req.headers.host}/account/reset-password?token=${token}
        
        If you did not request this, please ignore this email and your password will remain unchanged.`,
              };
        
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  return res.json({ status: false, message: 'Error sending email.' });
                } else {
                  console.log('Email sent: ' + info.response);
                  return res.json({ status: true, message: 'Email sent successfully.' });
                }
              });
              break;
            default:
              res.status(405).end(); // Method Not Allowed
              break;
          }
        }
        