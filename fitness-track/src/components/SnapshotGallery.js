import React, { useEffect, useState } from 'react';

function SnapshotGallery({poses}) {
    const [snapshots, setSnapshots] = useState(poses);

    useEffect(() => {
        setSnapshots(poses);
    }, [poses]);

    return(
        poses.length > 0 && (
            <>
                <div className='snapshot-gallery__title'>Movements</div>
                <div className='snapshot-gallery'>
                    {snapshots.length > 0 && (
                        snapshots.map((image, index) => (
                            <div key={index} className={`snapshot-gallery__image ${image.selected ? 'selected' : ''}`} >
                                <img src={image.screenshot} alt={`Image ${image.id}`} />
                            </div>
                        ))
                    )}
                </div>
            </>
        )
    );
}

export default SnapshotGallery;