import React from "react";
import Loading from "../Loading";

export const Page4 = () => {
    const [loading, setLoading] = React.useState<boolean>(true);
    return (
        <>
            <Loading visible={loading} />
            <div
                className={`m-auto text-white  ${
                    loading ? "opacity-0" : "opacity-100"
                }`}
            >
                <div className="text-3xl my-2 text-cyan-300 font-righteous">
                    HOW TO PLAY
                </div>
                <div className="text-left mx-auto w-[90%] text-lg p-1">
                    ● Pressing the match button will randomly match you with
                    another user who also pressed the match button to a classic
                    6x6 game mode
                </div>
                <div className="flex text-lg mx-auto w-[90%] mx">
                    <div className="">
                        <div className="w-fit my-4 mx-auto">
                            <div
                                className={`flex m-auto bg-neutral-800 rounded-full py-3 px-10 text-center
                            text-white shadow-md text-xl my-auto w-fit`}
                            >
                                MATCH
                            </div>
                        </div>
                        <div className="text-left p-1">
                            ● Pressing invite challenges a specific user to a
                            match and allow you to set a custom grid and the
                            amount of mines for your match
                        </div>
                        <div
                            className={`relative flex px-5 py-2 justify-evenly
                        rounded-full bg-green-800 text-lg z-20 w-fit my-4 mx-auto`}
                        >
                            <div className="text-white text-xl">Invite</div>
                            <svg
                                className="fill-white w-8 h-8 m-auto mx-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                            >
                                <path d="M352 128c0 70.7-57.3 128-128 128s-128-57.3-128-128S153.3 0 224 0s128 57.3 128 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                            </svg>
                        </div>
                    </div>
                    <img
                        src="assets/images/page4.png"
                        className="w-1/2 aspect-video rounded-lg border-[1px] m-auto"
                        onLoad={() => {
                            setLoading(false);
                        }}
                        alt=""
                    />
                </div>
            </div>
        </>
    );
};

export default Page4;
