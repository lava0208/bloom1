/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";

import { plantService } from "services";

import CurrentPlan from "./CurrentPlan";

import 'bootstrap/dist/css/bootstrap.css';
import styles from "~styles/components/modifyplan/availableplans.module.scss";

const AvailablePlans = (props) => {
    const [origialArray, setOrigialArray] = useState([]);
    const [query, setQuery] = useState('');
    const [filteredArray, setFilteredArray] = useState([]);
    const [filteredPresets, setFilteredPresets] = useState([]);

    useEffect(() => {
        getOriginalArray();
    }, [])

const getOriginalArray = async () => {
    const response = await plantService.getAll();
    setOrigialArray(response.data)
    setFilteredArray(response.data)
    if (response.presets !== undefined) {
        setOriginalPresets(response.presets);
        setFilteredPresets(response.presets);
    } else {
        setOriginalPresets([]);
        setFilteredPresets([]);
    }
}


    useEffect(() => {
        refreshFilterdArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])


    const [plantId, setPlantId] = useState("");
    const [isShowActionText, setIsShowActionText] = useState(-1);
    const [isShowActionPreset, setIsShowActionPreset] = useState(-1);
    const [modalOpen, setModalOpen] = useState(false);
    const [isShowPresets, setIsShowPresets] = useState(true);
    const [preset, setPreset] = useState(false);
    const openCreateModal = (id, isPreset) => {
        setModalOpen(true);
        setPlantId(id);
        setPreset(isPreset);
    }
    const savePlanting = () => {
        setModalOpen(false);
    }
    
    if (response.data.presets !== undefined) {
    setOriginalPresets(response.presets);
} else {
    setOriginalPresets([]);
}

    
const refreshFilterdArray = async () => {
    var _filteredArray = origialArray.filter(
        (el) => el.name.toLowerCase().includes(query)
    );

    var _filteredPresets = originalPresets.filter(
        (el) => el.name.toLowerCase().includes(query)
    );

    setFilteredArray(_filteredArray);
    setFilteredPresets(_filteredPresets);
};



    return (
        <>
            <div className={styles.headerContainer}>
                <h2>Available</h2>
                <div>
                    {
                        props.isPro && (
                            <button onClick={() => setIsShowPresets(!isShowPresets)}>{isShowPresets ? "Hide " : "Show "} Presets</button>
                        )
                    }                    
                    <input className={styles.searchButton} placeholder={'Search'} onChange={(e) => setQuery((e.target.value).toLowerCase())} />
                </div>
            </div>
            <div className={styles.plansContainer}>
                {filteredArray.map((plant, i) => (
                    <div className={styles.planContainer} key={i} onMouseEnter={() => setIsShowActionText(i)} onMouseLeave={() => setIsShowActionText(-1)}>
                        <div className={styles.planImage}>
                            {
                                plant.image && (
                                    <img src={plant.image } alt="image" />
                                )
                            }
                        </div>
                        <div className={styles.planInfoContainer}>
                            <h3>{plant.name}</h3>
                            <h4>{plant.species}</h4>
                            <h5>{plant.description}</h5>
                        </div>
                        {
                            i === isShowActionText && (
                                <div className={styles.plantHoverText}>
                                    <button onClick={() => openCreateModal(plant._id, false)}>Add</button>
                                </div>
                            )
                        }
                    </div>
                ))}
                {isShowPresets && filteredPresets.map((plant, i) => (
                    <div className={styles.planContainer} key={i} onMouseEnter={() => setIsShowActionPreset(i)} onMouseLeave={() => setIsShowActionPreset(-1)}>
                        <div className={styles.planImage}>
                            {
                                plant.image && (
                                    <img src={plant.image } alt="image" />
                                )
                            }
                        </div>
                        <div className={styles.planInfoContainer}>
                            <button>pro preset</button>
                            <h3>{plant.name}</h3>
                            <h4>{plant.species}</h4>
                            <h5>{plant.description}</h5>
                        </div>
                        {
                            i === isShowActionPreset && (
                                <div className={styles.plantHoverText}>
                                    <button onClick={() => openCreateModal(plant._id, true)}>Add</button>
                                </div>
                            )
                        }
                    </div>
                ))}
            </div>
            <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen} centered modalClassName="modifyPlanModal">
                <ModalBody>
                    <CurrentPlan type="create" plantId={plantId}  savePlanting={savePlanting} preset={preset} />
                </ModalBody>
            </Modal>
        </>
    );
};

export default AvailablePlans;
