import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { userService } from "services";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("bloom");

    switch (req.method) {
        //... create a plant        
        case "POST":
            await db.collection("plants").insertOne(req.body);
            return res.json({ status: true, message: 'A plant is created successfully.' });

        //... get all plants or plant by id
        case "GET":
            if(req.query.id === undefined){
                let plants = await db.collection("plants").find({}).toArray();
                return res.json({ status: true, data: plants });
            }else{
                let plant = await db.collection("plants").findOne({_id: new ObjectId(req.query)});
                return res.json({ status: true, data: plant });
            }

        //... update a plant
        case "PUT":
            await db.collection("plants").updateOne(
                {
                    _id: new ObjectId(req.query),
                },
                {
                    $set: {
                        userid: req.body.userid,
                        name: req.body.name,
                        species: req.body.species,
                        description: req.body.description,
                        image: req.body.image,
                        direct_seed: req.body.direct_seed,
                        direct_seed_pinch: req.body.direct_seed_pinch,
                        earliest_seed: req.body.earliest_seed,
                        latest_seed: req.body.latest_seed,
                        harden: req.body.harden,
                        transplant: req.body.transplant,
                        rebloom: req.body.rebloom,
                        maturity_early: req.body.maturity_early,
                        maturity_late: req.body.maturity_late,
                        light: req.body.light,
                        depth: req.body.depth,
                        seed_note: req.body.seed_note,
                        transplant_note: req.body.transplant_note,
                        harvest_note: req.body.harvest_note,
                        pinch_note: req.body.pinch_note,
                        pinch: req.body.pinch,
                        pot_on: req.body.pot_on,
                        pot_on_note: req.body.pot_on_note,
                        harvest_length: req.body.harvest_length,
                        cold_stratify: req.body.cold_stratify,
                        spacing_min: req.body.spacing_min,
                        spacing_max: req.body.spacing_max,
                        vase_life: req.body.vase_life,
                        light_preference: req.body.light_preference,
                        soil_requirements: req.body.soil_requirements,
                        stem_length_range: req.body.stem_length_range,
                        height: req.body.height,
                        scented: req.body.scented
                    },
                }
            );
            return res.json({ status: true, message: 'plant is updated successfully.' });

        //... delete a plant
        case "DELETE":
            await db.collection("plants").deleteOne({_id: new ObjectId(req.query)});
            return res.json({ status: true, message: 'The plant is deleted successfully.' });
    }
}