import React from "react";
import Image from "../Image";
import { defaultMinesConfig } from "../../lib/defaults/Default";
import Loading from "../Loading";

const Page2 = () => {
    const [loading, setLoading] = React.useState<boolean>(true);
    return (
        <>
            <Loading visible={loading} />
            <div
                className={`m-auto text-white ${
                    loading ? "opacity-0" : "opacity-100"
                }`}
            >
                <div className="text-3xl my-2 text-cyan-300 font-righteous">
                    HOW TO PLAY
                </div>
                <div className="text-lg mx-auto w-[90%]">
                    If the revealed grid contains a mine, the player will be
                    rewarded with points. The game will end after all mines have
                    been found. Different types of mines will reward different
                    amount of points.
                </div>
                <div className="flex flex-col text-lg p-5">
                    <div className="flex flex-row-reverse justify-evenly w-full">
                        {Object.keys(defaultMinesConfig).map(
                            (mineKey, index) => (
                                <div
                                    className={`${
                                        index === 0
                                            ? "text-lime-400"
                                            : index === 1
                                            ? "text-red-500"
                                            : index === 2
                                            ? "text-cyan-500"
                                            : index === 3
                                            ? "text-neutral-400"
                                            : null
                                    }`}
                                >
                                    <div>{mineKey.toUpperCase()}</div>
                                    <Image
                                        type={mineKey}
                                        onLoad={() => {
                                            setLoading(false);
                                        }}
                                        className="w-28 h-28 m-auto hover:scale-110 transition duration-300"
                                    />
                                    <div>
                                        {defaultMinesConfig[mineKey].points}
                                    </div>
                                    <div>POINTS</div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page2;
