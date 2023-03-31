/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { userService, planService, plantService, plantingService } from "services";

import styles from "~styles/components/modifyplan/currentplan.module.scss";

const CurrentPlan = (props) => {
    //... Initialize
    const [pinchCheckbox, setPinchCheckbox] = useState(false);
    const [potCheckbox, setPotCheckbox] = useState(false);
    const [bulbPotCheckbox, setBulbPotCheckbox] = useState(false);
    const [preSproutCheckbox, setPreSproutCheckbox] = useState(false);
    const [activeDirectSeed, setActiveDirectSeed] = useState(false);
    const [activeStartIndoors, setActiveStartIndoors] = useState(false);
    const [activeCuttings, setActiveCuttings] = useState(false);
    const [activePlugs, setActivePlugs] = useState(false);
    const [activePerennial, setActivePerennial] = useState(false);
    const [activeBulb, setActiveBulb] = useState(false);
    const harvests = [
        { label: "Early", value: 1 },
        { label: "Regular", value: 2 },
        { label: "Late", value: 3 }
    ]
    const [activeHarvest, setActiveHarvest] = useState(-1);

    const [planting, setPlanting] = useState({
        userid: "",
        plan_id: "",
        plant_id: props.plantId,
        seeds: 0,
        harvest: "",
        direct_sow: false,
        direct_indoors: false,
        bulb: false,
        pinch: false,
        pot_on: false,
        bulb_pot_on: false,
        bulb_presprout: false,
        succession: "",
        spacing: ""
    })
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        if(props.planting){
            //... edit page
            getPlanting();
            setPinchCheckbox(props.planting.pinch);
            setPotCheckbox(props.planting.pot_on);
            setBulbPotCheckbox(props.planting.bulb_pot_on);
            setPreSproutCheckbox(props.planting.bulb_presprout);
            setActiveDirectSeed(props.planting.direct_sow);
            setActiveBulb(props.planting.bulb);
            setActiveStartIndoors(props.planting.direct_indoors);
            var _harvest = harvests.find(x => x.label === props.planting.harvest);
            setActiveHarvest(_harvest ? _harvest.value : -1);
        }else{
            //... create page
            getPlantAndPlanting();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.planting])

    //... get plan nand planting
    const [plant, setPlant] = useState({});
    const getPlantAndPlanting = async () => {
        var _plan = await planService.getByUserId(userService.getId());
        var _plant = await plantService.getById(props.plantId);
        var _planting = { ...planting };
        _planting.userid = userService.getId();
        _planting.plan_id = _plan ? _plan.data._id : "";
        _planting.name = _plant ? _plant.data.name : "";
        _planting.species = _plant ? _plant.data.species : "";
        setPlant(_plant.data);
        setPlanting(_planting);
        setPlans(_plan.plans);
    }

    const getPlanting = async () => {
        var _plant = await plantService.getById(props.plantId);
        var _plan = await planService.getByUserId(userService.getId());
        setPlant(_plant.data);
        setPlanting(props.planting);
        setPlans(_plan.plans);
    }

    const save = async () => {
        if(props.planting !== undefined){
            swal({
                title: "Wait!",
                text: "Are you sure you want to update?",
                icon: "info",
                className: "custom-swal",
                buttons: [
                    'No, cancel it!',
                    'Yes, I am sure!'
                ],
                dangerMode: true,
            }).then(async function (isConfirm) {
                if (isConfirm) {
                    console.log("Updating planting:", planting);
                    var _result = await plantingService.update(props.planting._id , planting);
                    swal({
                        title: "Success!",
                        text: _result.message,
                        icon: "success",
                        className: "custom-swal",
                    }).then(function(){
                        props.savePlanting();
                    });
                }
            })
        }else{
            swal({
                title: "Wait!",
                text: "Are you sure you want to create?",
                icon: "info",
                className: "custom-swal",
                buttons: [
                    'No, cancel it!',
                    'Yes, I am sure!'
                ],
                dangerMode: true,
            }).then(async function (isConfirm) {
                if (isConfirm) {
                    if(props.preset){
                        var _result = await plantingService.clone(planting);
                        swal({
                            title: _result.status ? "Success!" : "Warning!",
                            text: _result.message,
                            className: "custom-swal",
                            icon: _result.status ? "success" : "warning",
                        }).then(function(){
                            props.savePlanting();
                        });
                    }else{
                        console.log("Creating planting:", planting);
                        var _result = await plantingService.create(planting);
                        
                        swal({
                            title: _result.status ? "Success!" : "Warning!",
                            text: _result.message,
                            className: "custom-swal",
                            icon: _result.status ? "success" : "warning",
                        }).then(function(){
                            props.savePlanting();
                        });
                    }                
                }
            })
        }
    }

    const reset = () => {
        setPlanting(planting => ({
            ...planting,
            seeds: 0,
            succession: "",
            spacing: ""
        }))
        setActiveHarvest(-1);
        setActiveDirectSeed(false);
        setActiveStartIndoors(false);
        setActiveBulb(false);
        setActiveCuttings(false);
        setActivePlugs(false);
        setActivePerennial(false);
        setPinchCheckbox(false);
        setPotCheckbox(false);
        setBulbPotCheckbox(false);
        setCuttingsPotCheckbox(false);

    }

    return (
        <div className={styles.container}>
            <div className="modal-header">
                <h5 className="modal-title">{props.type === "create" ? "Add " : "Edit "} {plant.name} </h5>
            </div>
            <div className={styles.currentPlanContainer}>
                <div className={styles.planDetailsContainer}>
                    <div className={styles.planImage}>
                        {
                            plant.image && (
                                <img src={plant.image } alt="image" />
                            )
                        }
                    </div>
                    <div className={styles.planInfoContainer}>
                        {/* <div className={styles.customSelect}>
                            <select
                                value={planting.plan_id}
                                onChange={(e) => setPlanting({...planting, plan_id: e.target.value})}
                            >
                                {plans.map(o => (
                                    <option key={o._id} value={o._id}>{o.name}</option>
                                ))}
                            </select>
                            <span className={styles.customArrow}></span>
                        </div> */}
                        {props.preset && (
                            <button>pro preset</button>
                        )}
                        <h3>{plant.name}</h3>
                        <h4>{plant.species}</h4>
                        <h5>{plant.description}</h5>
                    </div>
                </div>
                <div className={styles.planOptionsContainer}>
                    <div className={styles.seedingRow}>
                        <h4>Method</h4>
                        {
                            plant.direct_seed !== "" ? (
                                <button 
                                onClick={() => {
                                    setActiveBulb(false);
                                    setActiveDirectSeed(true);
                                    setActiveStartIndoors(false);
                                    setActiveCuttings(false);
                                    setActivePerennial(false);
                                    setActivePlugs(false);
                                    setPlanting({
                                        ...planting,
                                        direct_sow: true,
                                        direct_indoors: false,
                                        bulb: false,
                                        cuttings: false,
                                        plugs: false,
                                        perennial: false
                                      });
                                }}
                                className={activeDirectSeed === true ? styles.selected : ''}
                                value={planting.direct_sow}
                            >
                                    Direct Sow
                                </button>
                            ): (
                                <></>
                            )
                        }
                        {
                            plant.earliest_seed !== "" || plant.latest_seed !== "" ? (
                                <button 
                                onClick={() => {
                                    setActiveBulb(false);
                                    setActiveDirectSeed(false);
                                    setActiveStartIndoors(true);
                                    setActiveCuttings(false);
                                    setActivePerennial(false);
                                    setActivePlugs(false);
                                    setPlanting({
                                        ...planting,
                                        direct_sow: false,
                                        direct_indoors: true,
                                        bulb: false,
                                        cuttings: true,
                                        plugs: false,
                                        perennial: false
                                      });
                                }}
                    className={activeStartIndoors === true ? styles.selected : ''}
                    value={planting.direct_indoors}
                >
                                    Start Indoors
                                </button>
                            ) : (
                                <></>
                            )
                        }
                        {
            plant.bulb_transplant !== null && plant.bulb_transplant !== "" &&
            plant.bulb_maturity_early !== null && plant.bulb_maturity_early !== "" &&
            plant.bulb_maturity_late !== null && plant.bulb_maturity_late !== "" ? (
                <button 
                onClick={() => {
                    setActiveBulb(true);
                    setActiveDirectSeed(false);
                    setActiveStartIndoors(false);
                    setActiveCuttings(false);
                    setActivePerennial(false);
                    setActivePlugs(false);
                    setPlanting({
                        ...planting,
                        direct_sow: false,
                        direct_indoors: false,
                        bulb: true,
                        cuttings: true,
                        plugs: false,
                        perennial: false
                      });
                }}
                    className={activeBulb === true ? styles.selected : ''}
                    value={planting.bulb}
                >
                    Bulb
                </button>
            ) : (
                <></>
            )
        }
                                {
                            plant.cuttings_presprout !== null && plant.cuttings_presprout !== "" &&
                            plant.cuttings !== null && plant.cuttings !== "" &&
                             plant.cuttings_transplant !== null && plant.cuttings_transplant !== "" &&
                             plant.cuttings_maturity_early !== null && plant.cuttings_maturity_early !== "" &&
                             plant.cuttings_maturity_late !== null && plant.cuttings_maturity_late !== "" ? (
                                <button 
                                onClick={() => {
                                    setActiveBulb(false);
                                    setActiveDirectSeed(false);
                                    setActiveStartIndoors(false);
                                    setActiveCuttings(true);
                                    setActivePerennial(false);
                                    setActivePlugs(false);
                                    setPlanting({
                                        ...planting,
                                        direct_sow: true,
                                        direct_indoors: false,
                                        bulb: false,
                                        cuttings: true,
                                        plugs: false,
                                        perennial: false
                                      });
                                }}
                                className={activeCuttings === true ? styles.selected : ''}
                                value={planting.cuttings}
                            >
                                    Cuttings
                                </button>
                            ): (
                                <></>
                            )
                        }
                    </div>
                    <div className={styles.quantityRow}>
                        <h4>Quantity</h4>
                        <input type="number" placeholder="#" value={planting.seeds === null ? 0 : parseInt(planting.seeds)} onChange={(e) => setPlanting({...planting, seeds: parseInt(e.target.value) })} />
                    </div>
                    <div className={styles.harvestRow}>
                        <h4>Harvest</h4>
                        {harvests.map((element, i) => (
                            <button key={i} 
                                onClick={() => {setActiveHarvest(element.value), setPlanting({...planting, harvest: element.value === 1 ? "Early" : element.value === 2 ? "Regular" : "Late"})}} 
                                className={activeHarvest === i + 1 ?  styles.selected : ''}
                                value={planting.harvest}
                            >
                                {element.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.successionContainer}>
                        <div className={styles.successionContainer1}>
                            <div className={styles.successionTextContainer}>
                                <h4>Successions</h4>
                                <h5><i>Additional</i> plantings with the same settings, separated by the specified number of days.</h5>
                            </div>
                            <div className={styles.successionButtonsContainer}>
                                <div>
                                    <input
  value={planting.succession}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "") {
      setPlanting({ ...planting, succession: value });
    } else {
      const parsedValue = parseInt(value);
      if (parsedValue <= 10) {
        setPlanting({ ...planting, succession: parsedValue });
      } else {
        alert("Maximum input value is 10.");
      }
    }
  }}
  type="number"
  min="0"
  max="10"
/>

 
                                    <span>Plantings</span>
                                </div>
                                <div>
                                    <input
  value={planting.spacing}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "") {
      setPlanting({ ...planting, spacing: value });
    } else {
      const parsedValue = parseInt(value);
      if (parsedValue <= 50) {
        setPlanting({ ...planting, spacing: parsedValue });
      } else {
        alert("Maximum input value is 50.");
      }
    }
  }}
  type="number"
  min="0"
  max="50"
/>

                                    <span>Days Between</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.successionCheckboxesContainer}>
                            {
                                plant.pinch !== "" ? (
                                    <div className={styles.successionCheckboxRow}>
                                        <h6>Pinch</h6>
                                        <div
                                            onClick={() => {setPinchCheckbox(!pinchCheckbox), setPlanting({...planting, pinch: !pinchCheckbox})}}
                                            className={`${styles.checkbox} ${pinchCheckbox ? styles.active : null}`}
                                        ></div>
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                            {
                                plant.pot_on !== "" ? (
                                    <div className={styles.successionCheckboxRow}>
                                        <h6>Pot On</h6>
                                        <div
                                            onClick={() => {setPotCheckbox(!potCheckbox), setPlanting({...planting, pot_on: !potCheckbox})}}
                                            className={`${styles.checkbox} ${potCheckbox ? styles.active : null}`}
                                        ></div>
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                            {
                                  activeBulb ? (
                                    <div className={styles.successionCheckboxRow}>
                                        <h6>Pre-Sprout</h6>
                                        <div
                                            onClick={() => {setPreSproutCheckbox(!preSproutCheckbox), setPlanting({...planting, bulb_presprout: !preSproutCheckbox})}}
                                            className={`${styles.checkbox} ${preSproutCheckbox ? styles.active : null}`}
                                        ></div>
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                                                        {
                                   activeBulb && plant.bulb_pot_on !== "" && preSproutCheckbox ? (
                                    <div className={styles.successionCheckboxRow}>
                                        <h6>Pot On</h6>
                                        <div
                                            onClick={() => {setBulbPotCheckbox(!bulbPotCheckbox), setPlanting({...planting, bulb_pot_on: !bulbPotCheckbox})}}
                                            className={`${styles.checkbox} ${bulbPotCheckbox ? styles.active : null}`}
                                        ></div>
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                            {
                                   activeCuttings && plant.cuttings_pot_on !== "" ? (
                                    <div className={styles.successionCheckboxRow}>
                                        <h6>Pot On</h6>
                                        <div
                                            onClick={() => {setCuttingsPotCheckbox(!cuttingsPotCheckbox), setPlanting({...planting, cuttings_pot_on: !cuttingsPotCheckbox})}}
                                            className={`${styles.checkbox} ${cuttingsPotCheckbox ? styles.active : null}`}
                                        ></div>
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.buttonsContainer}>
                <button onClick={() => save()}>Save Changes</button>
                <button onClick={() => reset()}>Reset</button>
            </div>
        </div>
    );
};

export default CurrentPlan;
