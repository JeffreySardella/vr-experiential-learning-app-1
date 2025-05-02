import React from 'react';
import dynamic from 'next/dynamic';

const VrPlayer = dynamic(() => import('react-vr-player'), { ssr: false });

function VideoViewer({ videoUrl }) {
    const sources = [
        { url: videoUrl, type: 'video/mp4' }
    ];

    return (
        <div>
{/*              pass in brand and title */}
            <VrPlayer sources={sources} brand="React VR Player" title="Example Video" />
        </div>
    );
}

export default VideoViewer;
