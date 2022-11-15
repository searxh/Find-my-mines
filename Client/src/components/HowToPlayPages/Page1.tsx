import React from "react";

export const Page1 = () => {
  return (
    <div className="m-auto text-white">
      <div className="text-3xl my-2 text-cyan-300 font-righteous">
        HOW TO PLAY
      </div>
      <div className="text-lg mx-auto w-[90%]">
        In classic mode, there are 11 mines randomly placed in a 6x6 grid. The
        goal of the game is for each player to find as many mines as he/she can.
        Each turn, the player will have 10 seconds to choose a slot in the grid
        to reveal it.
      </div>
      <img
        src="assets/images/page1.png"
        className="w-[60%] m-auto my-5 rounded-lg border-[1px]"
        alt=""
      />
    </div>
  );
};

export default Page1;
