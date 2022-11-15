import React from "react";

export const Page3 = () => {
  return (
    <div className="m-auto text-white">
      <div className="text-3xl my-2 text-cyan-300 font-righteous">
        HOW TO PLAY
      </div>
      <div className="text-lg mx-auto w-[90%]">
        <div className="text-left">GAME LOBBY</div>
        <div className="text-left">
          ● You can see all the available players on the server and their
          statuses.
        </div>
        <div className="text-left">
          ● You can then decide on starting a game with matchmaking or invite
          challenges.
        </div>
      </div>
      <div className="flex text-lg justify-center">
        <img
          src="assets/images/page3.png"
          className="basis-[65%] w-1/2 rounded-lg border-[1px] border-white my-5 ml-8"
          alt=""
        />
        <div className="basis-[25%] m-auto">
          SERVER CHAT:
          <br />
          Chat with other online players
          <br />
          in the server lobby.
        </div>
      </div>
    </div>
  );
};

export default Page3;
