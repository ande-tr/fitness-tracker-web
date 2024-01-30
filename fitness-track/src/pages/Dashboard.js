import React, { useEffect, useRef, useState } from 'react';

function Dashboard(){
    const [history, setHistory] = useState([]);
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    useEffect(() => {
        let historyData = JSON.parse(localStorage.getItem("history"));
        if (historyData && typeof historyData === 'object') {
            historyData = Object.values(historyData).map(innerObj => {
                return Object.values(innerObj);
            });
            setHistory(historyData);
        } else {
            console.log("No exercises found in localStorage");
        }
        console.log(historyData);
    }, []);

    const checkPastDetails = () => {
        console.log('past details');
    }

    return (
        <div className='Dashboard'>
            <header>Dashboard</header>
            <div className='header__description'>Hello! <br /> Check out your exercising history and update your personal data right from the Dashboard.</div>

            <div className='user-details'>
                <div className='user-details__weight'>Weight: 50kg</div>
                <div className='user-details__height'>Height: 1m 59cm</div>
            </div>
            <a className="user-details__past-btn" href="/past">See past details</a>

            <div className='user-history__title'>Previous workouts</div>
            <div className='calories-burned-week'>
                Calories burned this week: 1000
            </div>
            <div className='user-history'>
                <ul>
                    {history.slice(-5).map((entry, index) => {
                        const timestamp = entry[0];
                        const date = new Date(timestamp);
                        const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
                        
                        return(
                            <li className='history-entry' key={index}>
                                <div className='history-entry__header'>
                                    <div className='history-entry__name'>{entry[1]}</div>
                                    <div className='history-entry__date'>{formattedDate}</div>
                                </div>
                                <div className='history-entry__accuracy'>Accuracy: {entry[2]}%</div>
                                <div className='history-entry__calories'>Calories burned: {entry[3]} kcal</div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;