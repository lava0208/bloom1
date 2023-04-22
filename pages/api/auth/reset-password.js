// reset-password.js
import clientPromise from '../../../lib/mongodb';
import { useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('bloom');

  switch (req.method) {
    case 'POST':
      const user = await db
        .collection('users')
        .findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } });

      if (!user) {
        return res.json({ status: false, message: 'Password reset token is invalid or has expired.' });
      }

      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword, resetPasswordToken: undefined, resetPasswordExpires: undefined } }
      );

      return res.json({ status: true, message: 'Password has been reset successfully.' });

    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}

