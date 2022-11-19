import React from "react";
import { useLocation } from "react-router-dom";
import { SocketContext } from "../../socket";
import { GlobalContext } from "../../states";
import { NavigateContext } from "./Navigate";

const RouteCheck = ({ children }: { children: React.ReactNode }) => {
    const { global_state, dispatch } = React.useContext(GlobalContext);
    const { socket } = React.useContext(SocketContext);
    const { navigate } = React.useContext(NavigateContext);
    const { gameInfo, persistentFlags } = global_state;
    const location = useLocation();
    React.useEffect(() => {
        //kicks player if they have not registered their name
        //(can join through manually changing link)
        const gameInfoLength = Object.keys(gameInfo).length;
        if (location.pathname !== "/" && !persistentFlags.canAutoNameRegister) {
            navigate("root");
        }
        //kicks player if gameInfo is already invalid and player is still in the game page
        //(can go back through browser)
        else if (location.pathname === "/game" && gameInfoLength === 0) {
            persistentFlags.canAutoNameRegister
                ? navigate("menu")
                : navigate("root");
        } else if (location.pathname !== "/game" && gameInfoLength !== 0) {
            console.log("still see gameInfo in other path wtf");
            if (socket !== undefined) {
                socket.emit("leave room request", gameInfo.roomID);
            }
            dispatch({
                type: "set",
                field: "gameInfo",
                payload: {},
            });
        }
    }, [location.pathname]);
    return <>{children}</>;
};

export default RouteCheck;
