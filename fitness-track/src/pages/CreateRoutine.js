import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { formatTimestamp } from '../helpers'

function CreateRoutine(){
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);

    useEffect(() => {
        const storedExercises = JSON.parse(localStorage.getItem("exercises"));
    
        if (storedExercises && Array.isArray(storedExercises)) {
            setExercises(storedExercises);
        } else {
            console.log("No exercises found in localStorage");
        }
    }, []);

    const isSelected = (exercise) => {
       return false;
    }

    const toggleExerciseSelection = (exercise) => {
        const isSelected = selectedExercises.some((selected) => selected.name === exercise.name);

        if (isSelected) {
            setSelectedExercises((prevSelected) => prevSelected.filter((selected) => selected.name !== exercise.name));
        } else {
            setSelectedExercises((prevSelected) => [...prevSelected, exercise]);
        }
    };

    return(
        <>
            <header>Create a routine</header>
            <div className='header__description'>Select the exercises in your prefered <br /> order and make a workout routine.</div>
        
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
                                <button
                                    className={selectedExercises.some((selected) => selected.name === exercise.name) ? 'exercise__check-box selected' : 'exercise__check-box'}
                                    onClick={() => toggleExerciseSelection(exercise)}
                                >
                                    {selectedExercises.some((selected) => selected.name === exercise.name) && (
                                        <div className='exercise__check-box__number'>{selectedExercises.findIndex((selected) => selected.name === exercise.name) + 1}</div>
                                    )}
                                </button>
                            </div>
                        </li>
                    ))
                )}

                {!exercises && (
                    <div className='empty-warning'>
                        <div className='empty-warning__icon'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                                <path fill="#d1d1d1" d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480v-160q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v160q0 17 11.5 28.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                            </svg>
                        </div>
                        <div className='empty-warning__text'>You should first create some exercises.</div>
                    </div>
                )}
            </ul>
        </>
    );
}

export default CreateRoutine;