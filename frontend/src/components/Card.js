import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ heading, token, imgsrc, link1 }) => {
    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
            {/* Image Section */}
            <Link to={link1}>
                <img
                    className="p-4 rounded-t-lg w-full h-96 object-cover"
                    src={imgsrc}
                    alt={heading}
                />
            </Link>

            {/* Content Section */}
            <div className="flex flex-col flex-grow px-5 pb-5">
                <Link to={link1}>
                    <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
                        {heading}
                    </h5>
                </Link>

                {/* Rating Section */}
                <div className="flex items-center mt-2 mb-4">
                    <div className="flex items-center space-x-1">
                        {[...Array(4)].map((_, index) => (
                            <svg
                                key={index}
                                className="w-4 h-4 text-yellow-300"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 22 20"
                            >
                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                        ))}
                        <svg
                            className="w-4 h-4 text-gray-200 dark:text-gray-600"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                        >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">
                        5.0
                    </span>
                </div>

                {/* Price and Button Section */}
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {token} SOL
                    </span>
                    <Link
                        to={link1}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-300"
                    >
                        Start
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Card;
