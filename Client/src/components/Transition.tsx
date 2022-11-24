import React from "react";
import Image from "./Image";

//duration = 500ms for each transition
const transitionCycleTime = 1000;
const loadingTime = 500;
const mines = ["Legendary", "Epic", "Rare", "Common"];

const Transition = ({
    midCallback,
    endCallback,
}: {
    midCallback: Function;
    endCallback: Function;
}) => {
    const [visible, setVisible] = React.useState<boolean>(true);
    const [transition, setTransition] = React.useState<boolean>(false);
    const [icon] = React.useState<string>(() => {
        return mines[Math.floor(Math.random() * mines.length)];
    });
    React.useEffect(() => {
        setVisible(true);
        setTimeout(() => {
            endCallback();
            setVisible(false);
        }, transitionCycleTime + loadingTime);
    }, []);
    React.useEffect(() => {
        if (visible) {
            setTimeout(() => setTransition(true), 50);
            setTimeout(() => {}, loadingTime);
            setTimeout(() => {
                setTransition(false);
                midCallback();
            }, transitionCycleTime / 2 + loadingTime);
        }
    }, [visible]);
    return visible ? (
        <div
            className={`absolute flex h-screen w-full transition duration-500 shadow-md bg-cover
            bg-[url('../public/assets/images/bg.png')] z-[100] backdrop-blur-md ${
                transition ? "translate-x-0" : "translate-x-[100%]"
            }`}
        >
            <Image
                type={icon}
                className="absolute top-0 left-0 right-0 bottom-0 w-[35%] h-[35%] m-auto animate-spin"
            />
        </div>
    ) : null;
};

export default Transition;
