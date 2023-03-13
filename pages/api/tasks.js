import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import moment from "moment";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("bloom");

    switch (req.method) {
        //... create a task
        case "POST":
            await db.collection("tasks").insertMany(req.body);
            return res.json({ status: true, message: 'A task is created successfully.' });

        //... get all tasks or task by id
        case "GET":
            if(req.query.id){
                let task = await db.collection("tasks").findOne({_id: new ObjectId(req.query.id)});
                return res.json({ status: true, data: task });
            }else if(req.query.plantingid){
                let tasks = await db.collection("tasks").find({planting_id: req.query.plantingid}).sort({scheduled_at: 1}).toArray();
                return res.json({ status: true, data: tasks });
            }else if(req.query.date){
                let data = {};
                data.today = await db.collection("tasks").find({scheduled_at: moment().format('YYYY/MM/DD'), userid: req.query.userid}).sort({scheduled_at: 1}).toArray();
                data.tomorrow = await db.collection("tasks").find({scheduled_at: moment().add(1, 'days').format('YYYY/MM/DD'), userid: req.query.userid}).sort({scheduled_at: 1}).toArray();
                data.week = await db.collection("tasks").find({
                    scheduled_at: {
                        $gt: moment().startOf('week').format('YYYY/MM/DD'),
                        $lt: moment().endOf('week').format('YYYY/MM/DD')
                    },
                    userid: req.query.userid
                }).sort({scheduled_at: 1}).toArray();
                data.nextweek = await db.collection("tasks").find({
                    scheduled_at: {
                        $gt: moment().format('YYYY/MM/DD'),
                        $lt: moment().add(6, 'days').format('YYYY/MM/DD')
                    },
                    userid: req.query.userid
                }).sort({scheduled_at: 1}).toArray();
                data.overdue = await db.collection("tasks").find({scheduled_at: {$gte: "2023/01/01", $lt: moment().format('YYYY/MM/DD')}, type: "incomplete", userid: req.query.userid}).sort({scheduled_at: 1}).toArray();
                data.season = await db.collection("plantings").aggregate([{ $match: { userid: req.query.userid } }, { $group:{ _id : null, sum : { $sum: "$seeds" } }}]).toArray();
                data.all = await db.collection("tasks").find({userid: req.query.userid}).sort({scheduled_at: 1}).toArray();
                return res.json({ status: true, data: data });
            }else{
                let tasks = await db.collection("tasks").find({userid: req.query.userid}).sort({scheduled_at: 1}).toArray();
                return res.json({ status: true, data: tasks });
            }

        //... update a task
        case "PUT":
            if(req.query.iscomplete){
                await db.collection("tasks").updateOne(
                    {
                        _id: new ObjectId(req.query.id),
                    },
                    {
                        $set: {
                            "type": "complete",
                            "completed_at": moment().format("YYYY/MM/DD")
                        },
                    }
                );
            }else{
                await db.collection("tasks").deleteMany({planting_id: req.query.plantingid});
                await db.collection("tasks").insertMany(req.body);
            }
            return res.json({ status: true, message: 'task is updated successfully.' });

        //... delete a task
        case "DELETE":
            if(req.query.id){
                await db.collection("tasks").deleteOne({_id: new ObjectId(req.query)});                
            }else{
                await db.collection("tasks").deleteMany({planting_id: req.query.plantingid});
            }
            return res.json({ status: true, message: 'The task is deleted successfully.' });
    }
}