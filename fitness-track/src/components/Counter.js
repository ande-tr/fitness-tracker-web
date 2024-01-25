import React, { useEffect, useState } from 'react';

function Counter({ onTimerFinish}) {
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer > 0) {
                    return prevTimer - 1;
                } else {
                    clearInterval(interval);
                    if (onTimerFinish) {
                        onTimerFinish();
                    }
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='timer-wrapper'>
            {timer > 0 && (
                <div>
                    <div>Recording will start in... </div>
                    <div>{timer}</div>
                </div>
            )}
            {timer <= 0 && (
                <div>Recording in progress!</div>
            )}
        </div>
    );
}

export default Counter;