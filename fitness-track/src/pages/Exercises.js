import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTimestamp } from '../helpers'

function Exercises(){
    const [deleteExercise, setDeleteExercise] = useState(null);

    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const storedExercises = JSON.parse(localStorage.getItem("exercises"));
    
        if (storedExercises && Array.isArray(storedExercises)) {
            setExercises(storedExercises);
        } else {
            console.log("No exercises found in localStorage");
        }
    }, []);


    const handleDeleteExercise = (exerciseName) => {
        setDeleteExercise(exerciseName);
    };

    const confirmDeleteExercise = () => {
        if (deleteExercise) {
            const updatedExercises = exercises.filter((exercise) => exercise.name !== deleteExercise);
            localStorage.setItem("exercises", JSON.stringify(updatedExercises));
            setExercises(updatedExercises);
            setDeleteExercise(null);
        }
    };

    const cancelDeleteExercise = () => {
        setDeleteExercise(null);
    };

    const handleSelectExercise = (exerciseName) => {
        navigate(`/play/${exerciseName}`);
    }

    const handleCreateExercise = () => {
        navigate('/createexercise');
    }

    return (
        <div className='Exercises'>
            <header>Exercises</header>

            {deleteExercise && (
                <div className="modal">
                    <div className="modal-content">
                        <p className='modal__question'>Are you sure you want to permanently delete <span className='bold-text'>{deleteExercise}</span>?</p>
                        <div className='modal-btns'>
                            <button className='modal-button modal-button__cancel' onClick={cancelDeleteExercise}>No</button>
                            <button className='modal-button modal-button__delete' onClick={confirmDeleteExercise}>Yes</button>
                        </div>
                    </div>
                </div>
            )}

            <div className='header__description'>Discover your exercise list here. Choose exercises individually or record a new custom exercise.</div>

            <button className='button exercises__create-exercise' onClick={handleCreateExercise}>Create new exercise</button>

            <ul className='exercises-list'>
                {exercises.length > 0 && (
                    exercises.map((exercise) => (
                        <li className='exercise' key={exercise.name}>
                            <div className='exercise__name'>
                                <div className='exercise__name-text'>{exercise.name}</div>
                                <div className='exercise__extras'>
                                    <div className='exercise__duration'>Duration: <span className='italic-text'>{formatTimestamp(exercise.duration)}</span></div>
                                </div>
                            </div>
                            <div className='exercise__btns'>
                                <button onClick={() => handleSelectExercise(exercise.name)} className='icon-button exercise__btns__play'>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path fill="#41B8B9" d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                                    </svg>
                                </button>
                                <button onClick={() => handleDeleteExercise(exercise.name)} className='icon-button exercise__btns__delete'>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                        <path fill="#E13A52" d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))
                )}

                {exercises.length === 0 && (
                    <div className='empty-warning'>
                        <div className='empty-warning__icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path fill="#d1d1d1" d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                            </svg>
                        </div>
                        <div className='empty-warning__text'>You currently have no exercises.</div>
                    </div>
                )}
            </ul>
        </div>
    );
}

export default Exercises;