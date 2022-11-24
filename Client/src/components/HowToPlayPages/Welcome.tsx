import React from "react";
import { GlobalContext } from "../../states";
import Loading from "../Loading";

const loadingComponents = 4;

export const Welcome = () => {
    const { global_state } = React.useContext(GlobalContext);
    const { name } = global_state;
    const [loadingCount, setLoadingCount] = React.useState<number>(0);
    const handleOnLoad = () => {
        setLoadingCount((loading) => loading + 1);
    };
    const isLoading = () => {
        return loadingCount < loadingComponents;
    };
    return (
        <>
            <Loading visible={isLoading()} />
            <div
                className={`m-auto text-white  ${
                    isLoading() ? "opacity-0" : "opacity-100"
                }`}
            >
                <div className="text-3xl py-2 text-lime-400 mx-auto font-righteous">
                    WELCOME TO FIND MY MINES
                    <div className="text-3xl font-quicksand">
                        {name.toUpperCase()}
                    </div>
                </div>
                <div className="text-lg w-[90%] mx-auto">
                    In this game, two players take turns picking a grid to
                    locate the mines, and the one with mines worth the most
                    points wins!
                </div>
                <div className="relative">
                    <img
                        src="assets/images/clickshovel.png"
                        className="w-[35%] m-auto drop-shadow-lg"
                        onLoad={handleOnLoad}
                        alt=""
                    />
                    <img
                        src="assets/images/CommonMine.png"
                        className="absolute left-44 -bottom-5 right-0 top-0 w-[28%] m-auto -z-10 opacity-50 rotate-45"
                        onLoad={handleOnLoad}
                        alt=""
                    />
                    <img
                        src="assets/images/RareMine.png"
                        className="absolute -left-48 -bottom-10 right-0 top-0 w-[25%] m-auto -z-10 drop-shadow-md opacity-50"
                        onLoad={handleOnLoad}
                        alt=""
                    />
                    <img
                        src="assets/images/LegendaryMine.png"
                        className="absolute left-0 -bottom-15 right-0 top-0 w-[25%] m-auto -z-20 opacity-30"
                        onLoad={handleOnLoad}
                        alt=""
                    />
                </div>
            </div>
        </>
    );
};

export default Welcome;
