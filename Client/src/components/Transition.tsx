import React from "react";

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
            setTimeout(() => setTransition(true), 100);
            setTimeout(() => midCallback(), middleTime);
            setTimeout(() => {
                setTransition(false);
            }, visibleTime / 2);
        }
    }, [visible]);
    return visible ? (
        <div
            className={`absolute h-full w-full transition duration-500
         bg-black z-50 ${transition ? "translate-x-0" : "translate-x-[100%]"}`}
        >
            Transition
        </div>
    ) : null;
};

export default Transition;
