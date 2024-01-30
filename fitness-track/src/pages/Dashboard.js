import React, { useEffect, useRef, useState } from 'react';

function Dashboard(){
    const [history, setHistory] = useState([]);
    const [userData, setUserData] = useState();
    const [showModal, setShowModal] = useState(false);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

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
        
        const storedUserData = JSON.parse(localStorage.getItem("userData"));

        if (storedUserData) {
            setUserData(storedUserData);
        } else {
            setShowModal(true);
        }

    }, []);

    const handleUserDataSubmit = () => {
        if (!weight || !height) {
            alert('You cannot save an empty value!');
            return;
        }

        const currentUserData = { weight, height };
        const pastUserData = userData ? userData.pastUserData || [] : [];
    
        const newUserData = {
            currentUserData,
            pastUserData: [...pastUserData, currentUserData],
        };
    
        localStorage.setItem("userData", JSON.stringify(newUserData));
        setUserData(newUserData);
        setShowModal(false);
    };

    const checkPastDetails = () => {
        console.log('past details');
    }

    return (
        <div className='Dashboard'>
            {showModal && (
                <div className="userdata-modal">
                    <div className="modal-content">
                        <div className='modal-title'>Update your data</div>

                        <div className='form-group'>
                            <label htmlFor="weight">Weight (kg):</label>
                            <input id="weight" name="weight" type="number" placeholder='Your new weight' value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                        
                        <div className='form-group'>
                            <label htmlFor="height">Height (cm):</label>
                            <input id="height" name="height" type="number" value={height} placeholder='Your new height' onChange={(e) => setHeight(e.target.value)} />
                        </div>
                        
                        <div className='modal-btns'>
                            {userData && (
                                <button className='button modal-cancel' onClick={() => setShowModal(false)}>Cancel</button>
                            )}
                            <button className='button modal-save' onClick={handleUserDataSubmit}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            <header>Dashboard</header>
            <div className='header__description'>Hello! <br /> Check out your exercising history and update your personal data right from the Dashboard.</div>

            <div className='user-details__header'>
                <div className='user-history__title'>Your details</div>
            </div>
            <div className='user-details'>
                <div className='user-details__wrapper'>
                    <div className='user-details__weight'><span className='semibold-text'>Weight:</span> {userData?.currentUserData?.weight}kg</div>
                    <div className='user-details__height'><span className='semibold-text'>Height:</span> {userData?.currentUserData?.height}cm</div>
                </div>
                <button className='button update-btn' onClick={() => setShowModal(true)}>Update details</button>
            </div>
            <a className="user-details__past-btn" href="/past">See past details</a>

            <div className='user-history__title'>Previous workouts</div>
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