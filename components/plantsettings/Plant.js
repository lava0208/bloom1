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
            if(plant.earliest_seed === "" && plant.latest_seed === "" && plant.direct_seed === ""){
                swal({
                    title: "Warning!",
                    text: "Please fill all fields.",
                    icon: "warning",
                    className: "custom-swal",
                });
            }else{
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
                text: "Please fill all fields.",
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
                <div className={styles.inputContainer + " col-md-6"}>
                <div className="col-md-6">
  <Nav tabs>
    <NavItem>
      <NavLink
        className={classnames({ active: activeTab === "1" })}
        onClick={() => {
          toggleTab("1");
        }}
      >
        Seed (Indoors)
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={classnames({ active: activeTab === "2" })}
        onClick={() => {
          toggleTab("2");
        }}
      >
        Seed (Outdoors)
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={classnames({ active: activeTab === "3" })}
        onClick={() => {
          toggleTab("3");
        }}
      >
        Bulb/Corm
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={classnames({ active: activeTab === "4" })}
        onClick={() => {
          toggleTab("4");
        }}
      >
        Cutting
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={classnames({ active: activeTab === "5" })}
        onClick={() => {
          toggleTab("5");
        }}
      >
        Plugs
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        className={classnames({ active: activeTab === "6" })}
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
      {/* Indoor Timing content */}
    </TabPane>
    <TabPane tabId="2">
      {/* Direct Seed Timing content */}
    </TabPane>
    <TabPane tabId="3">
      {/* Bulb/Corm content */}
    </TabPane>
    <TabPane tabId="4">
      {/* Cutting content */}
    </TabPane>
    <TabPane tabId="5">
      {/* Plugs content */}
    </TabPane>
    <TabPane tabId="6">
      {/* Perennial content */}
    </TabPane>
  </TabContent>
</div>

            </div>
            </div>
        </>
    );
};

export default Plant;
