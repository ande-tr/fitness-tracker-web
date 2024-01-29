import React, { useEffect, useRef, useState } from 'react';

function Dashboard(){
    const [history, setHistory] = useState([]);
    useEffect(() => {
        // const keys = Object.keys(localStorage);
        // setExerciseNames(keys);

        const history = JSON.parse(localStorage.getItem("history"));

        if (history && typeof history === 'object') {
            const keys = Object.keys(history);
            setHistory(keys);
        } else {
            console.log("No exercises found in localStorage");
        }
        console.log(history);
    }, []);

    return (
        <div className='Dashboard'>
            <header>Dashboard</header>

            <ul>
            {history.map((entry) => (
                <li key={entry.accuracy}>{entry.accuracy}</li>
                // console.log(entry);
            ))}
            </ul>
        </div>
    );
}

export default Dashboard;