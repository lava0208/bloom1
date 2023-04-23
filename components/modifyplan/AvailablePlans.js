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


    const getOriginalArray = async () => {
        const response = await plantService.getAll();
        setOrigialArray(response.data)
        setFilteredArray(response.data)
        if(response.presets !== undefined){
            setFilteredPresets(response.presets)
            // Set the original presets here
            setOriginalPresets(response.presets)
        }else{
            setFilteredPresets([])
            setOriginalPresets([])
        }
    }


useEffect(() => {
    refreshFilteredArray();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [query])

    
    const refreshFilteredArray = async () => {
    var _filteredArray = origialArray.filter(
        (el) => el.name.toLowerCase().includes(query)
    );

    if (query === '') {
        setFilteredPresets(originalPresets);
    } else {
        // Change this line to filter originalPresets instead of filteredPresets
        var _filteredPresets = originalPresets.filter(
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
                                <p>You don't currently have any plants available to add to your plan.</p>
                                <button onClick={goToPlantSettings} style={{color: 'white', fontWeight: 700, fontSize: '0.9rem', border: '5px solid #505168', background: '#505168', borderRadius: '10px', padding: '3px 1.7rem', cursor: 'pointer'}}>
  Go to Plant Settings and Add New Plant <span style={{marginLeft: '5px'}}>&#8594;</span>
</button> <button onClick={goToProfile} style={{color: 'white', fontWeight: 700, fontSize: '0.9rem', border: '5px solid #505168', background: '#505168', borderRadius: '10px', padding: '3px 1.7rem', cursor: 'pointer'}}>
  Upgrade to PRO and Access Hundreds of Presets <span style={{marginLeft: '5px'}}>&#8594;</span>
</button>

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
