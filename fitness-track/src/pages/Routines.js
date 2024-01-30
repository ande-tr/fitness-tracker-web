import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTimestamp } from '../helpers'

function Routines(){
    const [routines, setRoutines] = useState();
    const [deleteRoutine, setDeleteRoutine] = useState(null);
    const navigate = useNavigate();
    
    const handleCreateRoutine = () => {
        navigate('/createroutine');
    }

    useEffect(() => {
        const storedRoutines = JSON.parse(localStorage.getItem("routines"));
    
        if (storedRoutines && Array.isArray(storedRoutines)) {
            setRoutines(storedRoutines);
        } else {
            console.log("No routines found in localStorage");
        }
    }, []);


    const handleDeleteRoutine = (routineName) => {
        setDeleteRoutine(routineName);
    };

    const confirmDeleteRoutine = () => {
        if (deleteRoutine) {
            const updatedRoutines = routines.filter((routine) => routine.name !== deleteRoutine);
            localStorage.setItem("routines", JSON.stringify(updatedRoutines));
            setRoutines(updatedRoutines);
            setDeleteRoutine(null);
        }
    };

    const cancelDeleteRoutine = () => {
        setDeleteRoutine(null);
    };

    const handleSelectRoutine = (routineName) => {
        navigate(`/play/${routineName}`);
    }

    return(
        <>
            <header>Routines</header>

            {deleteRoutine && (
                <div className="modal">
                    <div className="modal-content">
                        <p className='modal__question'>Are you sure you want to permanently delete <span className='bold-text'>{deleteRoutine}</span>?</p>
                        <div className='modal-btns'>
                            <button className='modal-button modal-button__cancel' onClick={cancelDeleteRoutine}>No</button>
                            <button className='modal-button modal-button__delete' onClick={confirmDeleteRoutine}>Yes</button>
                        </div>
                    </div>
                </div>
            )}

            <div className='header__description'>Your list of routines - get some exercise done or create a new routine.</div>

            <button className='button exercises__create-exercise' onClick={handleCreateRoutine}>Create new routine</button>

            <ul className='exercises-list'>
                {routines && (
                    routines.length > 0 && (
                        routines.map((routine) => (
                            <li className='exercise' key={routine.name}>
                                <div className='exercise__name'>
                                    <div className='exercise__name-text'>{routine.name}</div>
                                    <div className='exercise__extras'>
                                        <div className='exercise__duration'>Duration: <span className='italic-text'>{formatTimestamp(routine.duration)}</span></div>
                                    </div>
                                </div>
                                <div className='exercise__btns'>
                                    <button onClick={() => handleSelectRoutine(routine.name)} className='icon-button exercise__btns__play'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                            <path fill="#41B8B9" d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                                        </svg>
                                    </button>
                                    <button onClick={() => handleDeleteRoutine(routine.name)} className='icon-button exercise__btns__delete'>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                            <path fill="#E13A52" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))
                    )
                )}

                {!routines && (
                    <div className='empty-warning'>
                        <div className='empty-warning__icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path fill="#d1d1d1" d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                            </svg>
                        </div>
                        <div className='empty-warning__text'>You currently have no routines.</div>
                    </div>
                )}
            </ul>
        </>
    );
}

export default Routines;