import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("bloom");

    const { token } = req.query;

    const user = await db.collection("users").findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    if (req.method === "POST") {
        const newPassword = req.body.password;
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        await db.collection("users").updateOne(
            { _id: new ObjectId(user._id) },
            {
                $set: {
                    password: hashedPassword,
                    resetPasswordToken: undefined,
                    resetPasswordExpires: undefined,
                },
            }
        );

        res.json({ message: "Password updated successfully" });
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
