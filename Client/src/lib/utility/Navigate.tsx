import React, { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Transition from "../../components/Transition";
import { NavigateContextType } from "../../types";
import { playAudio } from "./Audio";

export const NavigateContext = createContext<NavigateContextType>(
    {} as NavigateContextType
);

export const NavigateProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [destination, setDestination] = React.useState<string>("");
    const [transition, setTransition] = React.useState<number>(0);
    const navigationHandler = (dest: string) => {
        if (!location.pathname.includes(dest)) {
            playAudio("slide.wav");
            setDestination(dest);
        }
    };
    React.useEffect(() => {
        if (transition === 1 && destination === "root") {
            navigate("/");
        } else if (transition === 1 && destination !== "") {
            navigate("/" + destination);
        }
    }, [transition, destination]);
    return (
        <NavigateContext.Provider
            value={{
                navigate: navigationHandler,
            }}
        >
            {destination !== "" && (
                <Transition
                    midCallback={() => {
                        setTransition(1);
                        playAudio("slide.wav");
                    }}
                    endCallback={() => {
                        setDestination("");
                        setTransition(0);
                    }}
                />
            )}
            {children}
        </NavigateContext.Provider>
    );
};
