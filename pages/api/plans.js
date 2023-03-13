import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("bloom");

    switch (req.method) {
        //... create a plan
        case "POST":
            await db.collection("plans").insertOne(req.body);
            return res.json({ status: true, message: 'A plan is created successfully.' });
        //... get all plans or plan by user id
        case "GET":
            const id = req.query.id;
            const userid = req.query.userid;
            if(id){
                let plan = await db.collection("plans").findOne({_id: new ObjectId(id)});
                return res.json({ status: true, data: plan });
            }else if(userid){
                let plan = await db.collection("plans").findOne({userid: userid});
                return res.json({ status: true, data: plan });
            }else{
                let plans = await db.collection("plans").find({}).toArray();
                return res.json({ status: true, data: plans });
            }
        //... update a plan
        case "PUT":
            if(req.query.id){
                await db.collection("plans").updateOne(
                    {
                        id: req.query.id,
                    },
                    {
                        $set: {
                            name: req.body.name,
                            last_frost: req.body.last_frost,
                            first_frost: req.body.first_frost,
                            size: req.body.size,
                            location: req.body.location
                        },
                    }
                );
            }else{
                await db.collection("plans").updateOne(
                    {
                        userid: req.query.userid,
                    },
                    {
                        $set: {
                            name: req.body.name,
                            last_frost: req.body.last_frost,
                            first_frost: req.body.first_frost,
                            size: req.body.size,
                            location: req.body.location
                        },
                    }
                );
            }
            
            return res.json({ status: true, message: 'Plan is updated successfully.' });

        //... delete a plan
        case "DELETE":
            await db.collection("plans").deleteOne({_id: new ObjectId(req.query)});
            return res.json({ status: true, message: 'The plan is deleted successfully.' });
    }
}