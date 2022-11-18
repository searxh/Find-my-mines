import React from "react";
import { useLocation } from "react-router-dom";
import { GlobalContext } from "../../states";
import { NavigateContext } from "./Navigate";

const RouteCheck = ({ children }: { children: React.ReactNode }) => {
    const { global_state } = React.useContext(GlobalContext);
    const { setDestination } = React.useContext(NavigateContext);
    const { persistentFlags } = global_state;
    const location = useLocation();
    React.useEffect(() => {
        //kicks player if they have not registered their name
        //(can join through manually changing link)
        if (location.pathname !== "/" && !persistentFlags.canAutoNameRegister) {
            setDestination("root");
        }
    }, [location.pathname]);
    return <>{children}</>;
};

export default RouteCheck;
