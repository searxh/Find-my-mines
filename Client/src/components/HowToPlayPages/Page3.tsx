import React from "react";
import Loading from "../Loading";

export const Page3 = () => {
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
                    <div className="text-left">GAME LOBBY</div>
                    <div className="text-left">
                        ● You can see all the available players on the server
                        and their statuses.
                    </div>
                    <div className="text-left">
                        ● You can then decide on starting a game with
                        matchmaking or invite challenges.
                    </div>
                </div>
                <div className="flex text-lg justify-center">
                    <img
                        src="assets/images/page3.png"
                        className="basis-[65%] w-1/2 rounded-lg border-[1px] border-white my-5 ml-8"
                        onLoad={() => {
                            setLoading(false);
                        }}
                        alt=""
                    />
                    <div className="relative basis-[25%] m-auto">
                        SERVER CHAT:
                        <br />
                        Chat with other online players
                        <br />
                        in the server lobby.
                        <img
                            src="assets/images/arrow.png"
                            className="absolute w-56 h-44 rotate-180 -scale-x-100 -left-1/2 top-[70%]"
                            onLoad={() => {
                                setLoading(false);
                            }}
                            alt=""
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page3;
