import React from 'react';
import image1 from '../images/404-image.png';
import image2 from '../images/1.jpeg';
import image3 from '../images/2.jpeg';
import image4 from '../images/3.jpeg';
import Card from '../components/Card';

const Activities = () => {
    return (
        <div className='flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-800'>
            {/* Header */}
            <div className='flex px-20 py-10 justify-center items-center w-full'>
                <div className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-700 dark:text-gray-200'>
                    Activities
                </div>
            </div>

            {/* Cards Section */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10 w-full'>
                <Card heading={'Color-Matching'} token={10} imgsrc={image4} link1={'/color-matching'} />
                <Card heading={'Meditate'} token={10} imgsrc={image1} link1={'/meditate'} />
                <Card heading={'Swirl'} token={10} imgsrc={image2} link1={'/meditate'} />
                <Card heading={'Switch'} token={10} imgsrc={image3} link1={'/meditate'} />
            </div>
        </div>
    );
};

export default Activities;