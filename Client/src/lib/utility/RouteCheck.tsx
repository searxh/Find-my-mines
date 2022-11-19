import React from "react";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../../socket";
import { GlobalContext } from "../../states";
import { NavigateContext } from "./Navigate";

const RouteCheck = ({ children }: { children: React.ReactNode }) => {
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { socket } = React.useContext(SocketContext);
    const { navigate } = React.useContext(NavigateContext);
    const { name, gameInfo, persistentFlags } = global_state;
    const location = useLocation();
    React.useEffect(() => {
        //kicks player if they have not registered their name
        //(can join through manually changing link)
        const gameInfoLength = Object.keys(gameInfo).length;
        if (location.pathname !== "/" && !persistentFlags.canAutoNameRegister) {
            navigate("root");
        }
        //kicks player if gameInfo is already invalid and player is still in the game page
        //(can go back to game through browser)
        if (location.pathname === "/game" && gameInfoLength === 0) {
            persistentFlags.canAutoNameRegister
                ? navigate("menu")
                : navigate("root");
        }
        //clears game info when out of the game
        //(can go back to menu through browser)
        if (location.pathname !== "/game" && gameInfoLength !== 0) {
            if (socket !== undefined) {
                socket.emit("leave room request", gameInfo.roomID);
            }
            dispatch({
                type: "set",
                field: "gameInfo",
                payload: {},
            });
        }
        //kicks player who is not admin from entering console
        //(can go to admin through browser)
        if (location.pathname === "/admin" && name.toLowerCase() !== "admin") {
            persistentFlags.canAutoNameRegister
                ? navigate("menu")
                : navigate("root");
        }
        //kicks admin back to admin console
        //(can go to other pages through browser)
        if (location.pathname !== "/admin" && name.toLowerCase() === "admin") {
            navigate("admin");
        }
    }, [location.pathname]);
    return <>{children}</>;
};

export default RouteCheck;
