import React from "react";
import { GlobalContext } from "../../states";
import Image from "../Image";

export const Welcome = () => {
  const { global_state } = React.useContext(GlobalContext);
  const { name } = global_state;
  return (
    <div className="m-auto text-white">
      <div className="text-3xl py-2 text-lime-400 mx-auto font-righteous">
        WELCOME TO FIND MY MINES
        <div className="text-3xl font-quicksand">{name.toUpperCase()}</div>
      </div>
      <div className="text-lg w-[90%] mx-auto">
        In this game, two players take turns picking a grid to find the location
        of the mines, the player with the points worth of mines win!
      </div>
      <Image type="Epic" className="w-[35%] m-auto" />
      <img src="" alt="" />
    </div>
  );
};

export default Welcome;
