/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { userService, plantService } from "services";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";


import { Spinner } from "reactstrap";

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "firebaseConfig";

import styles from "~styles/components/plantsettings/plants.module.scss";

const Plant = (props) => {
    const [plant, setPlant] = useState({
        userid: "",
        name: "",
        species: "",
        description: "",
        image: "",
        earliest_seed: "",
        latest_seed: "",
        direct_seed: "",
        direct_seed_pinch: "",
        cold_stratify: "",
        pinch: "",
        pot_on: "",
        harden: "",
        transplant: "",
        maturity_early: "",
        maturity_late: "",
        light: false,
        depth: "",
        rebloom: false,
        indoor_seed_note: "",
        direct_seed_note: "",
        pinch_note: "",
        pot_on_note: "",
        transplant_note: "",
        harvest_note: "",
        bulb_presprout: "",
        bulb_pot_on: "",
        bulb_harden: "",
        bulb_transplant: "",
        bulb_maturity_early: "",
        bulb_maturity_late: "",
        bulb_transplant_note: "",
        cuttings_presprout: "",
cuttings: "",
cuttings_pot_on: "",
cuttings_harden: "",
cuttings_transplant: "",
cuttings_maturity_early: "",
cuttings_maturity_late: "",
cuttings_note: "",
cuttings_transplant_note: "",
plugs_maturity_early: "",
plugs_maturity_late: "",
plugs_harden: "",
plugs_transplant: "",
plugs_harden_note: "",
plugs_transplant_note: "",
perennial: "",
perennial_harvest_note: ""

    });

    useEffect(() => {
        getPlant(props.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getPlant = async () => {
        if(props.id !== 0){
            var response = await plantService.getById(props.id);
            setPlant(response.data)
        }       
    }

    const [imageFile, setImageFile] = useState()
    const [downloadURL, setDownloadURL] = useState('')
    const [percent, setPercent] = useState(0);
    const [activeTab, setActiveTab] = useState("1");

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
      };
      


    const handleSelectedFile = (files) => {
        if (files && files[0].size < 10000000) {
            setImageFile(files[0])
            const _imageFile = files[0]
            if (_imageFile) {
                const name = _imageFile.name
                const storageRef = ref(storage, `image/${name}`)
                const uploadTask = uploadBytesResumable(storageRef, _imageFile)
    
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const _percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                        setPercent(_percent);
                    },
                    (error) => {
                        swal({
                            title: "Error!",
                            text: error.message,
                            icon: "error",
                            className: "custom-swal",
                        });
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                            plant.image = url
                            setDownloadURL(url)
                        })
                    },
                )
            }
        } else {
            swal({
                title: "Error!",
                text: "File size to large",
                icon: "error",
                className: "custom-swal",
            });
        }
    }

    const uploadPlant = async () => {
        if(props.id === 0){
            const _result = await plantService.create(plant);
            if(_result.status === true){
                swal({
                    title: "Success!",
                    text: _result.message,
                    icon: "success",
                    className: "custom-swal",
                });
                props.savePlant()
            }else{
                swal({
                    title: "Warning!",
                    text: _result.message,
                    icon: "warning",
                    className: "custom-swal",
                }).then(function(){
                    props.savePlant();
                });
            }
        }else{
            const _result = await plantService.update(props.id, plant);
            if(_result.status === true){
                swal({
                    title: "Success!",
                    text: _result.message,
                    icon: "success",
                    className: "custom-swal",
                });
                props.savePlant()
            }else{
                swal({
                    title: "Warning!",
                    text: _result.message,
                    icon: "warning",
                    className: "custom-swal",
                }).then(function(){
                    props.savePlant();
                });
            }
        }
    }

    const savePlant = async () => {
        if (plant.name !== "" && plant.species !== "" && plant.description !== "") {
            {
                plant.userid = userService.getId();
                // plant.image = downloadURL;
                if(downloadURL !== ""){
                    plant.image = downloadURL;
                }else if(downloadURL === "" && plant.image !== ""){
                    plant.image = plant.image
                }else{
                    plant.image = ""
                }
                uploadPlant();
            }                                  
        } else {
            swal({
                title: "Warning!",
                text: "Please fill all required fields.",
                icon: "warning",
                className: "custom-swal",
            });
        }
    }

    return (
        <>
            <div className={styles.plantModalContainer}>
                <div className={styles.modalImageContainer}>
                    <label className={styles.modalImage}>
                        <input
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            hidden
                            onChange={(e) => handleSelectedFile(e.target.files)}
                        />
                        {downloadURL ? (
                            <img src={downloadURL} alt="plant" />
                        ) : (
                            plant && plant.image && (
                                <img src={plant.image} alt="plant" />
                            )                            
                        )}
                    </label>
                    {
                        imageFile && percent < 100 && (
                            <Spinner color="info"> Loading... </Spinner>
                        )
                    }
                </div>
                <div className={styles.inputContainer}>
                    <small>Variety Name</small>
                    <input
                        type="text"
                        className={styles.input}
                        value={plant ? plant.name : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                name: e.target.value,
                            });
                        }}
                    />
                    <small>Species</small>
                    <input
                        type="text"
                        className={styles.input}
                        value={plant ? plant.species : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                species: e.target.value,
                            });
                        }}
                    />
                    <small>Description</small>
                    <textarea
                        rows="3"
                        className={styles.input}
                        value={plant ? plant.description : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                description: e.target.value,
                            });
                        }}
                    />
                </div>
            </div>
            <div className="row mt-4">
            <div className="col-md-12">
  <Nav tabs>
    <NavItem>
      <NavLink
        className={classnames("tabLink", { active: activeTab === "1" })}
        style={{
            fontWeight: "bold",
            color: activeTab === "1" ? "#443750" : "white",
            cursor: "pointer",
            borderRadius: 20,
            margin: 5,
          }}
        onClick={() => {
          toggleTab("1");
        }}
      >
        Seed (Indoors)
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={classnames("tabLink", { active: activeTab === "2" })}
        style={{
            fontWeight: "bold",
            color: activeTab === "2" ? "#443750" : "white",
            cursor: "pointer",
            borderRadius: 20,
            margin: 5,
          }}
        onClick={() => {
          toggleTab("2");
        }}
      >
        Seed (Outdoors)
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={classnames("tabLink", { active: activeTab === "3" })}
        style={{
            fontWeight: "bold",
            color: activeTab === "3" ? "#443750" : "white",
            cursor: "pointer",
            borderRadius: 20,
            margin: 5,
          }}
        onClick={() => {
          toggleTab("3");
        }}
      >
        Bulb/Corm
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={classnames("tabLink", { active: activeTab === "4" })}
        style={{
            fontWeight: "bold",
            color: activeTab === "4" ? "#443750" : "white",
            cursor: "pointer",
            borderRadius: 20,
            margin: 5,
          }}
        onClick={() => {
          toggleTab("4");
        }}
      >
        Cutting
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={classnames("tabLink", { active: activeTab === "5" })}
        style={{
            fontWeight: "bold",
            color: activeTab === "5" ? "#443750" : "white",
            cursor: "pointer",
            borderRadius: 20,
            margin: 5,
          }}
        onClick={() => {
          toggleTab("5");
        }}
      >
        Plugs
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
       className={classnames("tabLink", { active: activeTab === "6" })}
       style={{
        fontWeight: "bold",
        color: activeTab === "6" ? "#443750" : "white",
        cursor: "pointer",
        borderRadius: 20,
        margin: 5,
      }}
        onClick={() => {
          toggleTab("6");
        }}
      >
        Perennial
      </NavLink>
    </NavItem>
  </Nav>
  <TabContent activeTab={activeTab}>
    <TabPane tabId="1">
    <div className="row">
    <div className={styles.inputContainer + " col-md-6"}>
                    <h5
                    style={{
                    paddingTop: 25,
                    }}
                    >Timing</h5>
                    <small>Earliest Seed (weeks before last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.earliest_seed : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                earliest_seed: e.target.value,
                            });
                        }}
                    />
                    <small>Latest Seed (weeks before last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.latest_seed : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                latest_seed: e.target.value,
                            });
                        }}
                    />
                    <small>Pinch (weeks after seeding indoors)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.pinch : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                pinch: e.target.value,
                            });
                        }}
                    />
                    <small>Pot On (weeks after seeding indoors)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.pot_on : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                pot_on: e.target.value,
                            });
                        }}
                    />
                    <small>Harden (weeks after last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.harden : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                harden: e.target.value,
                            });
                        }}
                    />
                    <small>Transplant (weeks after last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.transplant : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                transplant: e.target.value,
                            });
                        }}
                    />
                    <h5 className="mt-4">Seeding</h5>
                    <small>Depth (mm)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.depth : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                depth: e.target.value,
                            });
                        }}
                    />
                    <small>Cold Stratify (weeks before seeding)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.cold_stratify : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cold_stratify: e.target.value,
                            });
                        }}
                    />
                    <h6 className="d-flex align-items-center">
                        <label htmlFor="light">Light for germination</label>
                        <input type="checkbox" id="light"
                            value={plant ? plant.light : ""}
                            checked={plant ? plant.light : false}
                            onChange={(e) => {
                                setPlant({
                                    ...plant,
                                    light: e.target.checked,
                                });
                            }}
                        />
                    </h6>
                    <h5 className="mt-3">Maturity</h5>
                    <small>Maturity Early (days after seeding)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.maturity_early : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                maturity_early: e.target.value,
                            });
                        }}
                    />
                    <small>Maturity Late (days after seeding)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.maturity_late : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                maturity_late: e.target.value,
                            });
                        }}
                    />
                    <h6 className="d-flex align-items-center">
                        <label htmlFor="rebloom">Rebloom?</label>
                        <input
                            type="checkbox"
                            id="rebloom"
                            value={plant ? plant.rebloom : ""}
                            checked={plant ? plant.rebloom : false}
                            onChange={(e) => {
                                setPlant({
                                    ...plant,
                                    rebloom: e.target.checked,
                                });
                            }}
                        />
                    </h6>
                    
                </div>
                <div className={styles.inputContainer + " col-md-6"}>
                    <h5 style={{
                    paddingTop: 25,
                    }}>Notes</h5>
                    
                    
                    <small>Indoor Seed Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.indoor_seed_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                indoor_seed_note: e.target.value,
                            });
                        }}
                    />
                    <small>Pinch Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.pinch_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                pinch_note: e.target.value,
                            });
                        }}
                    />
                    <small>Pot On Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.pot_on_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                pot_on_note: e.target.value,
                            });
                        }}
                    />
                    <small>Transplant Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.transplant_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                transplant_note: e.target.value,
                            });
                        }}
                    />
                    <small>Harvest Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.harvest_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                harvest_note: e.target.value,
                            });
                        }}
                    />
                </div>
                <div className={styles.inputContainer + " text-center"}>
                    <button onClick={() => { savePlant() }}>Save Changes</button>
                    <button onClick={props.cancelPlant}>Cancel</button>
                </div>
                </div>
    </TabPane>
    <TabPane tabId="2">
    <div className="row">
    <div className={styles.inputContainer + " col-md-6"}>
                    <h5
                    style={{
                    paddingTop: 25,
                    }}
                    >Timing</h5>
                    <small>Direct Seed (weeks after last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.direct_seed : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                direct_seed: e.target.value,
                            });
                        }}
                    />
                    <small>Pinch (weeks after direct seeding)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.direct_seed_pinch : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                direct_seed_pinch: e.target.value,
                            });
                        }}
                    />
                    <h5 className="mt-4">Seeding</h5>
                    <small>Depth (mm)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.depth : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                depth: e.target.value,
                            });
                        }}
                    />
                    <small>Cold Stratify (weeks before seeding)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.cold_stratify : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cold_stratify: e.target.value,
                            });
                        }}
                    />
                    <h6 className="d-flex align-items-center">
                        <label htmlFor="light">Light for germination</label>
                        <input type="checkbox" id="light"
                            value={plant ? plant.light : ""}
                            checked={plant ? plant.light : false}
                            onChange={(e) => {
                                setPlant({
                                    ...plant,
                                    light: e.target.checked,
                                });
                            }}
                        />
                    </h6>
                    <h5 className="mt-4">Maturity</h5>
                    <small>Maturity Early (days after seeding)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.maturity_early : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                maturity_early: e.target.value,
                            });
                        }}
                    />
                    <small>Maturity Late (days after seeding)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.maturity_late : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                maturity_late: e.target.value,
                            });
                        }}
                    />
                    <h6 className="d-flex align-items-center">
                    <label htmlFor="rebloom">Rebloom?</label>
                        <input
                            type="checkbox"
                            id="rebloom"
                            value={plant ? plant.rebloom : ""}
                            checked={plant ? plant.rebloom : false}
                            onChange={(e) => {
                                setPlant({
                                    ...plant,
                                    rebloom: e.target.checked,
                                });
                            }}
                        />
                    </h6>
                </div>
                <div className={styles.inputContainer + " col-md-6"}>
                    <h5 style={{
                    paddingTop: 25,
                    }}>Notes</h5>
                    <small>Direct Seed Note</small>
                    <textarea
                        rows="3"
                        placeholder={"Optional"}
                        value={plant ? plant.direct_seed_note : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                direct_seed_note: e.target.value,
                            });
                        }}
                    />

                <small>Pinch Note</small>
                    <textarea
                        rows="3"
                        placeholder={"Optional"}
                        value={plant ? plant.pinch_note : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                pinch_note: e.target.value,
                            });
                        }}
                    />
                    <small>Harvest Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.harvest_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                harvest_note: e.target.value,
                            });
                        }}
                    />

                </div>
                <div className={styles.inputContainer + " text-center"}>
                    <button onClick={() => { savePlant() }}>Save Changes</button>
                    <button onClick={props.cancelPlant}>Cancel</button>
                </div>
                </div>
    </TabPane>
    <TabPane tabId="3">
    <div className="row">
    <div className={styles.inputContainer + " col-md-6"}>
                    <h5
                    style={{
                    paddingTop: 25,
                    }}
                    >Timing</h5>
                    <small>Pre-sprout (weeks before last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.bulb_presprout : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                bulb_presprout: e.target.value,
                            });
                        }}
                    />
                    <small>Pot On (weeks after pre-sprouting)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.bulb_pot_on : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                bulb_pot_on: e.target.value,
                            });
                        }}
                    />
                    <small>Harden Off (weeks after last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.bulb_harden : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                bulb_harden: e.target.value,
                            });
                        }}
                    />
                    <small>Transplant / Plant Out (weeks after last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.bulb_transplant : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                bulb_transplant: e.target.value,
                            });
                        }}
                    />
                    <h5 className="mt-4">Maturity</h5>
                    <small>Maturity Early (days after pre-sprouting/planting)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.bulb_maturity_early : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                bulb_maturity_early: e.target.value,
                            });
                        }}
                    />
                    <small>Maturity Late (days after pre-sprouting/planting)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.bulb_maturity_late : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                bulb_maturity_late: e.target.value,
                            });
                        }}
                    />
                    <h6 className="d-flex align-items-center">
                    <label htmlFor="rebloom">Rebloom?</label>
                        <input
                            type="checkbox"
                            id="rebloom"
                            value={plant ? plant.rebloom : ""}
                            checked={plant ? plant.rebloom : false}
                            onChange={(e) => {
                                setPlant({
                                    ...plant,
                                    rebloom: e.target.checked,
                                });
                            }}
                        />
                    </h6>
                </div>
                <div className={styles.inputContainer + " col-md-6"}>
                    <h5 style={{
                    paddingTop: 25,
                    }}>Notes</h5>
                    <small>Transplant Note</small>
                    <textarea
                        rows="3"
                        placeholder={"Optional"}
                        value={plant ? plant.bulb_transplant_note : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                bulb_transplant_note: e.target.value,
                            });
                        }}
                    />

                    <small>Harvest Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.harvest_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                harvest_note: e.target.value,
                            });
                        }}
                    />

                </div>
                <div className={styles.inputContainer + " text-center"}>
                    <button onClick={() => { savePlant() }}>Save Changes</button>
                    <button onClick={props.cancelPlant}>Cancel</button>
                </div>
                </div>
    </TabPane>
    <TabPane tabId="4">
    <div className="row">
    <div className={styles.inputContainer + " col-md-6"}>
                    <h5
                    style={{
                    paddingTop: 25,
                    }}
                    >Timing</h5>
                    <small>Pre-sprout (weeks before last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.cuttings_presprout : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cuttings_presprout: e.target.value,
                            });
                        }}
                    />
                    <small>Prepare Cuttings (weeks after pre-sprouting)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.cuttings : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cuttings: e.target.value,
                            });
                        }}
                    />
                    <small>Pot On (weeks after pre-sprouting)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.cuttings_pot_on : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cuttings_pot_on: e.target.value,
                            });
                        }}
                    />
                    <small>Harden (weeks after last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.cuttings_harden : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cuttings_harden: e.target.value,
                            });
                        }}
                    />
                    <small>Transplant (weeks after last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.cuttings_transplant : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cuttings_transplant: e.target.value,
                            });
                        }}
                    />
                    <h5 className="mt-4">Maturity</h5>
                    <small>Maturity Early (days after planting)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.cuttings_maturity_early : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cuttings_maturity_early: e.target.value,
                            });
                        }}
                    />
                    <small>Maturity Late (days after planting)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.cuttings_maturity_late : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cuttings_maturity_late: e.target.value,
                            });
                        }}
                    />
                    <h6 className="d-flex align-items-center">
                    <label htmlFor="rebloom">Rebloom?</label>
                        <input
                            type="checkbox"
                            id="rebloom"
                            value={plant ? plant.rebloom : ""}
                            checked={plant ? plant.rebloom : false}
                            onChange={(e) => {
                                setPlant({
                                    ...plant,
                                    rebloom: e.target.checked,
                                });
                            }}
                        />
                    </h6>
                </div>
                <div className={styles.inputContainer + " col-md-6"}>
                    <h5 style={{
                    paddingTop: 25,
                    }}>Notes</h5>
                    <small>Prepare Cuttings Note</small>
                    <textarea
                        rows="3"
                        placeholder={"Optional"}
                        value={plant ? plant.cuttings_note : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cuttings_note: e.target.value,
                            });
                        }}
                    />
                    <small>Transplant Note</small>
                    <textarea
                        rows="3"
                        placeholder={"Optional"}
                        value={plant ? plant.cuttings_transplant_note : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                cuttings_transplant_note: e.target.value,
                            });
                        }}
                    />

                    <small>Harvest Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.harvest_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                harvest_note: e.target.value,
                            });
                        }}
                    />

                </div>
                <div className={styles.inputContainer + " text-center"}>
                    <button onClick={() => { savePlant() }}>Save Changes</button>
                    <button onClick={props.cancelPlant}>Cancel</button>
                </div>
                </div>
    </TabPane>
    <TabPane tabId="5">
    <div className="row">
    <div className={styles.inputContainer + " col-md-6"}>
                    <h5
                    style={{
                    paddingTop: 25,
                    }}
                    >Timing</h5>
                    <small>Harden (weeks after last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.plugs_harden : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                plugs_harden: e.target.value,
                            });
                        }}
                    />
                    <small>Transplant (weeks after last frost)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.plugs_transplant : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                plugs_transplant: e.target.value,
                            });
                        }}
                    />

                    <h5>Maturity</h5>
                    <small>Maturity Early (days after plug arrival)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.plugs_maturity_early : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                plugs_maturity_early: e.target.value,
                            });
                        }}
                    />
                    <small>Maturity Late (days after plug arrival)</small>
                    <input
                        type="number"
                        className={styles.input}
                        value={plant ? plant.plugs_maturity_late : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                plugs_maturity_late: e.target.value,
                            });
                        }}
                    />
                    <h6 className="d-flex align-items-center">
                    <label htmlFor="rebloom">Rebloom?</label>
                        <input
                            type="checkbox"
                            id="rebloom"
                            value={plant ? plant.rebloom : ""}
                            checked={plant ? plant.rebloom : false}
                            onChange={(e) => {
                                setPlant({
                                    ...plant,
                                    rebloom: e.target.checked,
                                });
                            }}
                        />
                    </h6>
                </div>
                <div className={styles.inputContainer + " col-md-6"}>
                    <h5 style={{
                    paddingTop: 25,
                    }}>Notes</h5>
                    <small>Harden Note</small>
                    <textarea
                        rows="3"
                        placeholder={"Optional"}
                        value={plant ? plant.plugs_harden_note : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                plugs_harden_note: e.target.value,
                            });
                        }}
                    />
                    <small>Transplant Note</small>
                    <textarea
                        rows="3"
                        placeholder={"Optional"}
                        value={plant ? plant.plugs_transplant_note : ""}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                plugs_transplant_note: e.target.value,
                            });
                        }}
                    />

                    <small>Harvest Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.harvest_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                harvest_note: e.target.value,
                            });
                        }}
                    />

                </div>
                <div className={styles.inputContainer + " text-center"}>
                    <button onClick={() => { savePlant() }}>Save Changes</button>
                    <button onClick={props.cancelPlant}>Cancel</button>
                </div>
                </div>
    </TabPane>
    <TabPane tabId="6">
    <div className="row">
    <div className={styles.inputContainer + " col-md-6"}>
                    <h5
                    style={{
                    paddingTop: 25,
                    }}
                    >Existing Perennial</h5>
                    <h6 className="d-flex align-items-center">
                    <label htmlFor="perennial">Enable</label>
                        <input
                            type="checkbox"
                            id="perennial"
                            value={plant ? plant.perennial : ""}
                            checked={plant ? plant.perennial : false}
                            onChange={(e) => {
                                setPlant({
                                    ...plant,
                                    perennial: e.target.checked,
                                });
                            }}
                        />
                        </h6>
                </div>
                <div className={styles.inputContainer + " col-md-6"}>
                    <h5 style={{
                    paddingTop: 25,
                    }}>Notes</h5>
                    <small>Harvest Note</small>
                    <textarea
                        rows="3"
                        value={plant ? plant.perennial_harvest_note : ""}
                        placeholder={"Optional"}
                        onChange={(e) => {
                            setPlant({
                                ...plant,
                                perennial_harvest_note: e.target.value,
                            });
                        }}
                    />

                </div>
                <div className={styles.inputContainer + " text-center"}>
                    <button onClick={() => { savePlant() }}>Save Changes</button>
                    <button onClick={props.cancelPlant}>Cancel</button>
                </div>
                </div>
    </TabPane>
  </TabContent>
</div>

                
            </div>
        </>
    );
};

export default Plant;





