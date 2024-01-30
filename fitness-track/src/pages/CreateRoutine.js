import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { formatTimestamp } from '../helpers'

function CreateRoutine(){
    const navigate = useNavigate();
    const [routineName, setRoutineName] = useState('');
    const [exercises, setExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [routineDuration, setRoutineDuration] = useState(0);

    useEffect(() => {
        const storedExercises = JSON.parse(localStorage.getItem("exercises"));
    
        if (storedExercises && Array.isArray(storedExercises)) {
            setExercises(storedExercises);
        } else {
            console.log("No exercises found in localStorage");
        }
    }, []);

    const toggleExerciseSelection = (exercise) => {
        const isSelected = selectedExercises.some((selected) => selected.name === exercise.name);

        if (isSelected) {
            setSelectedExercises((prevSelected) => prevSelected.filter((selected) => selected.name !== exercise.name));
        } else {
            setSelectedExercises((prevSelected) => [...prevSelected, exercise]);
        }

        setSelectedExercises((prevSelected) => {
            const totalDuration = prevSelected.reduce((total, selected) => total + selected.duration, 0);
            setRoutineDuration(totalDuration);
            return prevSelected;
        });
    };

    const handleSaveRoutine = (e) => {
        e.preventDefault();

        const calorieBurnRatePerHour = 270; // average calories burned for calisthenics for average person
        const millisecondsInHour = 3600000;
        const createdAt = Date.now();

        const combinedPoses = selectedExercises.reduce((poses, exercise) => {
            return poses.concat(exercise.poses);
        }, []);    

        const routineDurationInHours = routineDuration / millisecondsInHour;
        const caloriesBurned = calorieBurnRatePerHour * routineDurationInHours;

        const newRoutine = {
            'name': routineName,
            'poses': combinedPoses,
            'duration': routineDuration,
            'created-at': createdAt,
            'calories-burned': caloriesBurned
        };

        if (localStorage.getItem("routines") === null) {
            const routines = [newRoutine];
            localStorage.setItem("routines", JSON.stringify(routines));
            navigate('/routines');
        } else {
            const routines = JSON.parse(localStorage.getItem("routines"));

            if (routines.some(routine => routine.name === routineName)) {
                alert('The name is already taken!');
            } else {
                routines.push(newRoutine);
                localStorage.setItem("routines", JSON.stringify(routines));
                navigate('/routines');
            }
        }
    }

    return(
        <>
            <header>Create a routine</header>
            <div className='header__description'>Select the exercises in your prefered <br /> order and make a workout routine.</div>
        
            <form name="save-routine" onSubmit={(e) => e.preventDefault()}>
                <input type="text" value={routineName} onChange={(e) => setRoutineName(e.target.value)} className='routine__name' placeholder="Routine name" />
                <ul className='exercises-list'>
                <div className='routine-creator__duration'><span className='bold-text'>Duration: </span>{formatTimestamp(routineDuration)}</div>
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

                <button className='button routine-editor__save' onClick={handleSaveRoutine}>Save routine</button>
            </form>
        </>
    );
}

export default CreateRoutine;