import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const LottieAnimation = ({ animationData, width = '100%', height = '100%', loop = true, className = "" }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (typeof animationData === 'string') {
            fetch(animationData)
                .then(res => res.json())
                .then(json => setData(json))
                .catch(err => console.error("Lottie fetch error:", err));
        } else {
            setData(animationData);
        }
    }, [animationData]);

    if (!data) return <div style={{ width, height }} className={`${className} animate-pulse bg-gray-100 dark:bg-white/5 rounded-3xl`} />;

    return (
        <div style={{ width, height }} className={className}>
            <Lottie 
                animationData={data} 
                loop={loop} 
                autoplay={true}
                rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice'
                }}
            />
        </div>
    );
};

export default LottieAnimation;
