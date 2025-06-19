import Lottie from 'lottie-react';
import animationData from './animation.json';

export const LottieAnimation = () => {
    return (
        <div style={{ width: '170px', height: '170px' }}>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
};


