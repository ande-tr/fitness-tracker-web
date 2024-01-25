import React, { useEffect, useState, useRef } from 'react';

function Dashboard(){
    const lastExercise = localStorage.getItem("lastExercise");

    return (
        <div className='Dashboard'>
            <header>Dashboard</header>

            {/* <div className="exercise-reminder">
                You haven't exercised in ... days.
            </div> */}
            <div className="exercise-history">
                { lastExercise === null ? 'You have no workout history. Head to Routines and exercise today.' : (
                    <div>
                        Exercise name
                        Exercise duration
                        Exercise calories burned
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;