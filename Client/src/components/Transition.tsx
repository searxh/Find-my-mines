import React from "react";
import Image from "./Image";

const visibleTime = 2000;
const middleTime = 1000;

const Transition = ({
    midCallback,
    endCallback,
}: {
    midCallback: Function;
    endCallback: Function;
}) => {
    const [visible, setVisible] = React.useState<boolean>(true);
    const [transition, setTransition] = React.useState<boolean>(false);
    React.useEffect(() => {
        setVisible(true);
        setTimeout(() => {
            endCallback();
            setVisible(false);
        }, visibleTime);
    }, []);
    React.useEffect(() => {
        if (visible) {
            setTimeout(() => setTransition(true), 50);
            setTimeout(() => midCallback(), middleTime);
            setTimeout(() => {
                setTransition(false);
            }, visibleTime / 2);
        }
    }, [visible]);
    return visible ? (
        <div
            className={`absolute flex h-screen w-full transition duration-500 shadow-md bg-contain
            bg-[url('../public/assets/images/bg.png')] z-50 backdrop-blur-md ${
                transition ? "translate-x-0" : "translate-x-[100%]"
            }`}
        >
            <Image
                type="Legendary"
                className="absolute top-0 left-0 right-0 bottom-0 w-[35%] h-[35%] m-auto animate-spin"
            />
        </div>
    ) : null;
};

export default Transition;
