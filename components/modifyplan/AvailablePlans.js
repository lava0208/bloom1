/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";
import { HashLoader } from 'react-spinners';
import { useRouter } from 'next/router';

import { plantService } from "services";

import CurrentPlan from "./CurrentPlan";

import 'bootstrap/dist/css/bootstrap.css';
import styles from "~styles/components/modifyplan/availableplans.module.scss";

const AvailablePlans = (props) => {
    const [origialArray, setOrigialArray] = useState([]);
    const [query, setQuery] = useState('');
    const [filteredArray, setFilteredArray] = useState([]);
    const [filteredPresets, setFilteredPresets] = useState([]);
    const [originalPresets, setOriginalPresets] = useState([]);
    const [loading, setLoading] = useState(true);
    const updateCounter = props.updateCounter;
    const setUpdateCounter = props.setUpdateCounter;
    const [originalCore, setOriginalCore] = useState([]);
    const [shouldShowNonProContent, setShouldShowNonProContent] = useState(false);



    const router = useRouter();

    // Rest of your component code...

    const goToPlantSettings = () => {
        router.push('/plantsettings');
    }
    const goToProfile = () => {
        router.push('/profile');
    }

    useEffect(() => {
        getOriginalArray();
    }, [])

    useEffect(() => {
        if (props.isPro) {
            setShouldShowNonProContent(false);
        } else {
            setShouldShowNonProContent(true);
        }
    }, [props.isPro]);


    const getOriginalArray = async () => {
        const response = await plantService.getAll();
        setOrigialArray(response.data);
        setFilteredArray(response.data);
        if (response.presets !== undefined) {
            setFilteredPresets(response.presets);
            setOriginalPresets(response.presets);
        } else if (response.core !== undefined) { // Add this condition for core plants
            setFilteredPresets(response.core);
            setOriginalCore(response.core);
        } else {
            setFilteredPresets([]);
            setOriginalPresets([]);
            setOriginalCore([]);
        }
    };


useEffect(() => {
    refreshFilteredArray();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [query])

    
const refreshFilteredArray = async () => {
    var _filteredArray = origialArray.filter(
        (el) => el.name.toLowerCase().includes(query)
    );

    if (query === '') {
        setFilteredPresets(originalPresets.length > 0 ? originalPresets : originalCore);
    } else {
        var _filteredPresets = (originalPresets.length > 0 ? originalPresets : originalCore).filter(
            (el) => el.name.toLowerCase().includes(query)
        );
        setFilteredPresets(_filteredPresets);
    }

    setFilteredArray(_filteredArray);
    setLoading(false);
}



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
    
            {loading ? (
                <div className={styles.plansContainer}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                        }}
                    >
                        <HashLoader color="#505168" size={100} />
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.plansContainer}>
{/* Add custom varieties message container */}
{!props.isPro && shouldShowNonProContent && (
    <div className={`${styles.planContainer} ${styles.nonProContainer}`} style={{background: '#5a5b75'}}>
        <div className={styles.corePlanInfoContainer}>
            <h3 style={{textAlign: 'center', fontSize: '1.5rem'}}>Add New Varieties</h3>
            <p style={{color: 'white'}}>Add your own custom varieties - the possibilities are endless!</p>
            <div className={styles.customButtonConatiner} style={{display: 'flex', justifyContent: 'center'}}>
                <button onClick={goToPlantSettings}>Add New Custom Variety</button>
            </div>
        </div>
    </div>
)}

{/* Upgrade to pro message container */}
{!props.isPro && shouldShowNonProContent && (
    <div className={`${styles.planContainer} ${styles.nonProContainer}`} style={{background: '#5a5b75'}}>
        <div className={styles.corePlanInfoContainer}>
            <h3 style={{textAlign: 'center', fontSize: '1.5rem'}}>Access PRO Presets</h3>
            <p style={{color: 'white'}}>Gain access to hundreds of presets with <b>Bloom Manager PRO!</b></p>
            <div className={styles.customButtonConatiner} style={{display: 'flex', justifyContent: 'center'}}>
                <button onClick={goToProfile} style={{color: '#FFD700'}}>Upgrade to PRO</button>
            </div>
        </div>
    </div>
)}


                        {filteredArray.length > 0 || props.isPro ? (
                            filteredArray.map((plant, i) => (
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
                            ))
                        ) : (
                            <div className={styles.emptyMessage}>
                                                            </div>
                        )}





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
                                <button>{originalCore.includes(plant) ? 'free preset' : 'pro preset'}</button> {/* Update button text here */}
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
                    <CurrentPlan type="create" plantId={plantId} savePlanting={savePlanting} preset={preset} updateCounter={updateCounter}
  setUpdateCounter={setUpdateCounter} />
                    </ModalBody>
              </Modal>
            </>
          )}
        </>
      ) ;

          }

export default AvailablePlans;
