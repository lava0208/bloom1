import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
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

// ... update profile
case "PUT":
    const { id } = req.query;
    const isSubscriptionUpdate = req.body.data.isSubscriptionUpdate;

    const updateFields = {
        share_custom_varieties: req.body.data.share_custom_varieties,
        subscriptionId: req.body.data.subscriptionId
    };

    if (!isSubscriptionUpdate) {
        updateFields.password = bcrypt.hashSync(req.body.data.password, 10);
        updateFields.name = req.body.name,
        updateFields.email = req.body.email,
        updateFields.email_newsletter = req.body.email_newsletter,
        updateFields.profile_path = req.body.profile_path
    }

    await db.collection("users").updateOne(
        {
            _id: new ObjectId(id),
        },
        {
            $set: updateFields,
        }
    );
    return res.json({ status: true, message: 'The profile is updated successfully. Refresh the page.' });


        //... delete user
        case "DELETE":
            await db.collection("users").deleteOne({_id: new ObjectId(req.query)});
            return res.json({ status: true, message: 'The account is closed successfully.' });
    }
}