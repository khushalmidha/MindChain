import React from 'react';
import image1 from '../images/404-image.png'
import image2 from '../images/1.jpeg'
import image3 from '../images/2.jpeg'
import image4 from '../images/3.jpeg' 
import Card from '../components/Card';
import CalmColorMatching from '../components/colorMatching';
// import GameSwirl from '../components/Swirl';
const Activities = () => {
    return (
        <div className='flex items-start justify-start flex-col'>
            <div className='flex px-20 py-10 justify-center items-center w-screen'>
                <div className='2xl:text-5xl lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold text-gray-700 dark:text-gray-200'>
                    Activities
                </div>


            </div>
            <div className='flex flex-col w-screen justify-evenly'>
               <div className='flex flex-row items-center justify-evenly py-10'>
               <Card heading={"Break"} token={3} imgsrc={image4} link={"/colormatching"}/>
                <Card heading={"Switch"} token={4} imgsrc={image3}/>
               
               </div>
               <div className='flex flex-row items-center justify-evenly py-10'>
               <Card heading={"Swirl"} token={5} imgsrc={image2}/>
               <Card heading={"Meditate"} token={6} imgsrc={image1}/>

               </div>
               
            </div>
            {/* <GameSwirl /> */}
        </div>
    );
}

export default Activities;
