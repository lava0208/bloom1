import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { planService, plantService, taskService, userService } from "services";
import moment from "moment";

async function getPlantImg(id){
    const _plant = await plantService.getById(id);
    return _plant.data.image;
}

async function getPlantById(id){
    const _plant = await plantService.getById(id);
    return _plant.data;
}

async function getPlanById(id){
    const _plan = await planService.getById(id);
    return _plan.data;
}

function createTasks(planting, plant, plan, shiftDays){
    console.log(plan);
    let last_frost = plan.last_frost;
    let first_frost = plan.first_frost;

    //... durations
    let _earliest_indoor_seed = plant.earliest_seed !== "" ? parseInt(plant.earliest_seed)*7 : 0;
    let _latest_indoor_seed = plant.latest_seed !== "" ? parseInt(plant.latest_seed)*7 : 0;
    let _cold_stratify = plant.cold_stratify !== "" ? parseInt(plant.cold_stratify)*7 : 0;
    let _pinch = plant.pinch !== "" ? parseInt(plant.pinch)*7 : 0;
    let _pot_on = plant.pot_on !== "" ? parseInt(plant.pot_on)*7 : 0;
    let _harden = plant.harden !== "" ? parseInt(plant.harden)*7 : 0;
    let _transplant = plant.transplant !== "" ? parseInt(plant.transplant)*7 : 0;
    let _direct_sow = planting.direct_sow === true ? parseInt(plant.direct_seed)*7 : 0;
    let _maturity_early = plant.maturity_early !== "" ? parseInt(plant.maturity_early) : 0;
    let _maturity_late = plant.maturity_late !== "" ? parseInt(plant.maturity_late) : 0;
    let _harvest_duration = plant.rebloom ? Math.round((_maturity_late + _maturity_early)/2) : _maturity_late - _maturity_early;
    let average_maturity = Math.round((_maturity_early + _maturity_late) / 2);
    let bulb_presprout = plant.bulb_presprout !== "" ? parseInt(plant.bulb_presprout)*7 : null;
    let bulb_pot_on = plant.bulb_pot_on !== "" ? parseInt(plant.bulb_pot_on)*7 : null;
    let bulb_harden = plant.bulb_harden !== "" ? parseInt(plant.bulb_harden)*7 : 0;
    let bulb_transplant = plant.bulb_transplant !== "" ? parseInt(plant.bulb_transplant)*7 : null;
    let bulb_maturity_early = plant.bulb_maturity_early !== "" ? parseInt(plant.bulb_maturity_early) : null;
    let bulb_maturity_late = plant.bulb_maturity_late !== "" ? parseInt(plant.bulb_maturity_late) : null;
    let cuttings_presprout = plant.cuttings_presprout !== "" ? parseInt(plant.cuttings_presprout)*7 : null;
    let cuttings = plant.cutting !== "" ? parseInt(plant.cutting)*7 : null;
    let cuttings_pot_on = plant.cuttings_pot_on !== "" ? parseInt(plant.cuttings_pot_on)*7 : null;
    let cuttings_harden = plant.cuttings_harden !== "" ? parseInt(plant.cuttings_harden)*7 : 0;
    let cuttings_transplant = plant.cuttings_transplant !== "" ? parseInt(plant.cuttings_transplant)*7 : null;
    let cuttings_maturity_early = plant.cuttings_maturity_early !== "" ? parseInt(plant.cuttings_maturity_early) : null;
    let cuttings_maturity_late = plant.cuttings_maturity_late !== "" ? parseInt(plant.cuttings_maturity_late) : null;
    let plugs_harden = plant.plugs_harden !== "" ? parseInt(plant.plugs_harden)*7 : 0;
    let plugs_transplant = plant.plugs_transplant !== "" ? parseInt(plant.plugs_transplant)*7 : null;
    let plugs_maturity_early = plant.plugs_maturity_early !== "" ? parseInt(plant.plugs_maturity_early) : null;
    let plugs_maturity_late = plant.plugs_maturity_late !== "" ? parseInt(plant.plugs_maturity_late) : null;


    

    let pot_on_decision = planting.pot_on;
    let pinch_decision = planting.pinch;
    let bulb_pot_on_decision = planting.bulb_pot_on;
    let bulb_presprout_decision = planting.bulb_presprout;
    let cuttings_pot_on_decision = planting.cuttings_pot_on;
    
    
    //... schedule dates
    let cold_stratify_date = moment(last_frost).subtract(_cold_stratify, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
    let pot_on_date;
    let harvest_date;
    let seed_indoors_date;
    let direct_seed_date;
    let pinch_date;
    let bloom_start_date;
    if(planting.direct_indoors){

        switch (planting.harvest) {
            case "Early":
                seed_indoors_date = moment(last_frost).subtract(_earliest_indoor_seed, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
                break;
            case "Regular":
                seed_indoors_date = moment(last_frost).subtract(Math.round((_earliest_indoor_seed + _latest_indoor_seed)/2), 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
                break;
            default:
                seed_indoors_date = moment(last_frost).subtract(_latest_indoor_seed, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
                break;
        }
        pinch_date = moment(seed_indoors_date).add(_pinch, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
        pot_on_date = moment(seed_indoors_date).add(_pot_on, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
        harvest_date = moment(seed_indoors_date).add(average_maturity, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
        _harvest_duration = plant.rebloom ? Math.round(moment(first_frost).diff(moment(harvest_date), 'days')) : _maturity_late - _maturity_early;


    }else{
        direct_seed_date = moment(last_frost).add(_direct_sow, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
        pinch_date = moment(direct_seed_date).add(_pinch, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
        pot_on_date = moment(direct_seed_date).add(_pot_on, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
        bloom_start_date = moment(direct_seed_date).add(average_maturity, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
harvest_date = moment(direct_seed_date).add(average_maturity, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
_harvest_duration = plant.rebloom ? Math.round(moment(first_frost).diff(moment(harvest_date), 'days')) : _maturity_late - _maturity_early;


    }
    let harden_date = moment(last_frost).add(_harden, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
    let transplant_date = moment(last_frost).add(_transplant, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');

    var taskArr = [];

    //... Enable Direct Sow
    if(planting.direct_sow){
        var titleArr1 = ['Direct Seed/Sow', 'Harvest'];
        var noteArr1 = [plant.direct_seed_note, plant.harvest_note];
        var durationArr1 = [1, _harvest_duration];
        var scheduleArr1 = [direct_seed_date, harvest_date];

        if(_cold_stratify != 0){
            titleArr1.push('Cold Stratify');
            noteArr1.push('');
            durationArr1.push(7);
            scheduleArr1.push(cold_stratify_date);
        }
        if(_pinch != 0){
            titleArr1.push('Pinch');
            noteArr1.push(plant.pinch_note);
            durationArr1.push(1);
            scheduleArr1.push(pinch_date);
        }
    
        for (var i=0; i<titleArr1.length; i++){
            var taskObj = {
                planting_id: planting._id,
                userid: plan.userid,
                title: titleArr1[i],
                scheduled_at: scheduleArr1[i],
                duration: durationArr1[i],
                note: noteArr1[i],
                type: "incomplete",
                rescheduled_at: "",
                completed_at: ""
            }
            taskArr.push(taskObj);
        }
    //... Enable Start Indoors
    }
    if(planting.direct_indoors){
        var titleArr2 = ['Seed Indoors', 'Harden', 'Transplant', 'Harvest'];
        var noteArr2 = [plant.indoor_seed_note, '', plant.transplant_note, plant.harvest_note];
        var durationArr2 = [1, 7, 1, _harvest_duration];
        var scheduleArr2 = [seed_indoors_date, harden_date, transplant_date, harvest_date];

        if(_cold_stratify != 0){
            titleArr2.push('Cold Stratify');
            noteArr2.push('');
            durationArr2.push(7);
            scheduleArr2.push(cold_stratify_date);
        }
        if (_pinch != 0 && pinch_decision) {
            titleArr2.push('Pinch');
            noteArr2.push(plant.pinch_note);
            durationArr2.push(1);
            scheduleArr2.push(pinch_date);
        }
        if (_pot_on != 0 && pot_on_decision) {
            titleArr2.push('Pot On');
            noteArr2.push(plant.pot_on_note);
            durationArr2.push(1);
            scheduleArr2.push(pot_on_date);
        }

        for (var i=0; i<titleArr2.length; i++){
            var taskObj = {
                planting_id: planting._id,
                userid: plan.userid,
                title: titleArr2[i],
                scheduled_at: scheduleArr2[i],
                duration: durationArr2[i],
                note: noteArr2[i],
                type: "incomplete",
                rescheduled_at: "",
                completed_at: ""
            }
            taskArr.push(taskObj);
        }
    }

    if (planting.bulb) {
        let presprout_date = (bulb_presprout !== null && bulb_presprout !== false) ? moment(last_frost).subtract(bulb_presprout, 'days').add(shiftDays, 'days').format('YYYY/MM/DD') : null;
        let pot_on_date = (bulb_pot_on !== null && bulb_pot_on !== false) ? moment(presprout_date).add(bulb_pot_on, 'days').add(shiftDays, 'days').format('YYYY/MM/DD') : null;
        let harden_date = (bulb_presprout !== null && bulb_harden !== false) ? moment(last_frost).add(bulb_harden, 'days').add(shiftDays, 'days').format('YYYY/MM/DD') : null;
        let harvest_date = ((bulb_presprout !== null && (bulb_maturity_early || bulb_maturity_late)) || bulb_transplant !== null) ? moment(presprout_date || transplant_date).add(bulb_maturity_early || bulb_maturity_late, 'days').add(shiftDays, 'days').format('YYYY/MM/DD') : null;
        
        let transplant_date = moment(last_frost).add(bulb_transplant, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');

        
        var titleArr3 = ['Plant Out', 'Harvest'];
        var noteArr3 = [plant.bulb_transplant_note, plant.harvest_note];
        var durationArr3 = [1, bulb_maturity_late - bulb_maturity_early];
        var scheduleArr3 = [transplant_date, harvest_date];

        if (bulb_presprout !== null && bulb_presprout_decision) {
            titleArr3.unshift('Pre-Sprout');
            noteArr3.unshift('');
            durationArr3.unshift(1);
            scheduleArr3.unshift(presprout_date);
    
            if (bulb_pot_on !== null && bulb_pot_on_decision) {
                titleArr3.splice(1, 0, 'Pot On');
                noteArr3.splice(1, 0, '');
                durationArr3.splice(1, 0, 1);
                scheduleArr3.splice(1, 0, pot_on_date);
            }
            {
                titleArr3.splice(2, 0, 'Harden Off');
                noteArr3.splice(2, 0, '');
                durationArr3.splice(2, 0, 7);
                scheduleArr3.splice(2, 0, harden_date);
            }
        }
    
        for (var i = 0; i < titleArr3.length; i++) {
            var taskObj = {
                    planting_id: planting._id,
                    userid: plan.userid,
                    title: titleArr3[i],
                    scheduled_at: scheduleArr3[i],
                    duration: durationArr3[i],
                    note: noteArr3[i],
                    type: "incomplete",
                    rescheduled_at: "",
                    completed_at: ""
                }
                taskArr.push(taskObj);
            }

        if (planting.cuttings) {
            let presprout_date = (cuttings_presprout !== null && cuttings_presprout !== false) ? moment(last_frost).subtract(cuttings_presprout, 'days').add(shiftDays, 'days').format('YYYY/MM/DD') : null;
            let harden_date = (cuttings_presprout !== null && cuttings_harden !== false) ? moment(last_frost).add(cuttings_harden, 'days').add(shiftDays, 'days').format('YYYY/MM/DD') : null;
            let harvest_date = ((cuttings_presprout !== null && (cuttings_maturity_early || cuttings_maturity_late)) || cuttings_transplant !== null) ? moment(presprout_date || transplant_date).add(cuttings_maturity_early || cuttings_maturity_late, 'days').add(shiftDays, 'days').format('YYYY/MM/DD') : null;
        
            let transplant_date = moment(last_frost).add(cuttings_transplant, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
        
            var titleArr4 = ['Pre-Sprout', 'Harden Off', 'Pot On', 'Plant Out', 'Harvest'];
            var noteArr4 = ['', '', '', plant.cuttings_transplant_note, plant.harvest_note];
            var durationArr4 = [1, 7, 1, 1, cuttings_maturity_late - cuttings_maturity_early];
            var scheduleArr4 = [presprout_date, harden_date, pot_on_date, transplant_date, harvest_date];
        
            if (cuttings_pot_on !== null) {
                let pot_on_date = moment(presprout_date).add(cuttings_pot_on, 'days').add(shiftDays, 'days').format('YYYY/MM/DD');
                titleArr4.splice(2, 0, 'Pot On');
                noteArr4.splice(2, 0, '');
                durationArr4.splice(2, 0, 1);
                scheduleArr4.splice(2, 0, pot_on_date);
            }
        }        
        
            for (var i = 0; i < titleArr4.length; i++) {
                var taskObj = {
                        planting_id: planting._id,
                        userid: plan.userid,
                        title: titleArr4[i],
                        scheduled_at: scheduleArr3[i],
                        duration: durationArr3[i],
                        note: noteArr4[i],
                        type: "incomplete",
                        rescheduled_at: "",
                        completed_at: ""
                    }
                    taskArr.push(taskObj);
                }
            
        
    
        return taskArr;
    }
}

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("bloom");

    switch (req.method) {
        //... create plantings
case "POST":
            
    if (!req.body.direct_sow && !req.body.direct_indoors && !req.body.bulb && !req.body.plugs && !req.body.cuttings && !req.body.perennial) {
        return res.json({
            status: false,
            message: "You must choose only one planting method for a single planting. Please try again, and ensure you select one option.",
        });
    }

    if (!req.body.harvest || !req.body.seeds) {
        return res.json({
            status: false,
            message: "Please provide harvest type (early, regular, or late) and quantity for the planting.",
        });
    }

            
    // Check Pro user or not
    let _user = await userService.getById(req.body.userid);

    let successionCount = req.body.succession > 0 ? parseInt(req.body.succession) + 1 : 1;
    let spacingDays = req.body.spacing ? parseInt(req.body.spacing) : 0;
    let insertResults = [];
    let shiftDays;
            
    if (successionCount > 15) {
    successionCount = 15;
    }

    if (_user.data.share_custom_varieties || !_user.data.share_custom_varieties && await db.collection("plantings").find({ userid: req.body.userid }).count() < 25) {
        for (let i = 0; i < successionCount; i++) {
            shiftDays = i * spacingDays;

            // Generate a new ObjectId for the planting
            const plantingId = new ObjectId();

            // Set the "_id" field to the new ObjectId
            req.body._id = plantingId;

            // Insert the planting
            await db.collection("plantings").insertOne(req.body);

            // Insert automatic tasks
            let _plant = await getPlantById(req.body.plant_id);
            let _plan = await getPlanById(req.body.plan_id);

            await taskService.create(createTasks(req.body, _plant, _plan, shiftDays));
            insertResults.push({ status: true, message: 'Planting created successfully! Refresh the page.' });
        }
    } else {
        return res.json({ status: false, message: "You've reached your limit! Upgrade to PRO for unlimited plantings." });
    }


        //... get all plantings or planing by id
        case "GET":
            if(req.query.id){
                let _planting = await db.collection("plantings").findOne({_id: new ObjectId(req.query.id)});
                return res.json({ status: true, data: _planting });
            }else if(req.query.plantid){
                let _planting = await db.collection("plantings").findOne({plant_id: req.query.plantid});
                return res.json({ status: true, data: _planting });
            }else{
                let plantings = await db.collection("plantings").find({userid: req.query.userid}).toArray();
                await Promise.all(plantings.map(async (elem) => {
                    try {
                      elem.image = await getPlantImg(elem.plant_id)  
                    } catch (error) {
                      console.log('error'+ error);
                    }
                }))
                return res.json({ status: true, data: plantings });
            }

        //... update a planting
        case "PUT":
            if (!req.body.direct_sow && !req.body.direct_indoors && !req.body.bulb) {
                return res.json({
                    status: false,
                    message: "You must choose either seed indoors or direct seed for a single planting. Please try again, and ensure you select one option.",
                });
            }
        
            // Add this condition to ensure only one planting method is true
            let plantingMethods = [req.body.direct_sow, req.body.direct_indoors, req.body.bulb];
            let trueMethods = plantingMethods.filter(method => method === true);
            if (trueMethods.length !== 1) {
                return res.json({
                    status: false,
                    message: "You must choose only one planting method for a single planting. Please try again, and ensure you select one option.",
                });
            }
        
            if (!req.body.harvest || !req.body.seeds) {
                return res.json({
                    status: false,
                    message: "Please provide harvest type (early, regular, or late) and quantity for the planting.",
                });
            }
            
    await db.collection("plantings").updateOne(
        {
            _id: new ObjectId(req.query.id),
        },
        {
            $set: {
                plan_id: req.body.plan_id,
                seeds: parseInt(req.body.seeds),
                harvest: req.body.harvest,
                direct_sow: req.body.direct_sow,
                direct_indoors: req.body.direct_indoors,
                bulb: req.body.bulb,
                cuttings: req.body.cuttings,
                plugs: req.body.plugs,
                perennial: req.body.perennial,
                pinch: req.body.pinch,
                bulb_pot_on: req.body.bulb_pot_on,
                bulb_presprout: req.body.bulb_presprout,
                cuttings_pot_on: req.body.cuttings_pot_on,
                pot_on: req.body.pot_on,
                spacing: req.body.spacing,
                succession: req.body.succession
            },
        }
    );

    // Delete existing tasks associated with the planting
    await db.collection("tasks").deleteMany({ planting_id: req.query.id });

    //... insert automatic tasks
    let _plant = await getPlantById(req.body.plant_id);
    let _plan = await getPlanById(req.body.plan_id);

    await taskService.update(req.query.id , createTasks(req.body, _plant, _plan));

    return res.json({ status: true, message: 'Planting updated successfully!' });


        //... delete a planting
        case "DELETE":
            await db.collection("plantings").deleteOne({_id: new ObjectId(req.query.id)});
            return res.json({ status: true, message: 'The planting is deleted successfully.' });
    }
}
