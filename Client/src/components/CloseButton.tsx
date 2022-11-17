import React from "react";

interface CloseButtonPropsType {
    onClick: Function;
}

export const CloseButton = ({ onClick }: CloseButtonPropsType) => {
    return (
        <button
            onClick={() => onClick()}
            className="absolute -top-1 -right-1 w-10 h-10 bg-neutral-500 text-red-500 shadow-md z-30
            text-center rounded-full font-righteous hover:scale-110 transition hover:bg-red-700"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="fill-white w-5 h-5 m-auto"
            >
                <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
            </svg>
        </button>
    );
};
export default CloseButton;
