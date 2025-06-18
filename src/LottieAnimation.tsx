import Lottie from 'lottie-react';
import animationData from './animation.json';

export const LottieAnimation = () => {
    return (
        <div style={{ width: '175px', height: '175px' }}>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
};


