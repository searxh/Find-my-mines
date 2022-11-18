import React, { SetStateAction, Dispatch, createContext } from "react";
import { useNavigate } from "react-router-dom";
import Transition from "../../components/Transition";

export const NavigateContext = createContext<NavigateContextType>(
    {} as NavigateContextType
);

interface NavigateContextType {
    destination: string;
    setDestination: Dispatch<SetStateAction<string>>;
}

export const NavigateProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const navigate = useNavigate();
    const [destination, setDestination] = React.useState<string>("");
    const [transition, setTransition] = React.useState<number>(0);
    React.useEffect(() => {
        if (transition === 1 && destination !== "") {
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
                    endCallback={() => setDestination("")}
                />
            )}
            {children}
        </NavigateContext.Provider>
    );
};
