import React, { createContext } from "react";
import { useNavigate } from "react-router-dom";
import Transition from "../../components/Transition";
import { NavigateContextType } from "../../types";

export const NavigateContext = createContext<NavigateContextType>(
    {} as NavigateContextType
);

export const NavigateProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const navigate = useNavigate();
    const [destination, setDestination] = React.useState<string>("");
    const [transition, setTransition] = React.useState<number>(0);
    React.useEffect(() => {
        if (destination === "root") {
            navigate("/");
        } else if (transition === 1 && destination !== "") {
            navigate("/" + destination);
        }
    }, [transition, destination]);
    return (
        <NavigateContext.Provider
            value={{
                destination: destination,
                setDestination: setDestination,
            }}
        >
            {destination !== "" && (
                <Transition
                    midCallback={() => setTransition(1)}
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
