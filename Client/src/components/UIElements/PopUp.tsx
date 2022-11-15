import React from "react";

export const PopUp = (props: any) => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const handleOnClose = () => {
    setVisible(false);
  };
  return (
    <>
      {visible ? (
        <div
          className="absolute flex top-0 bottom-0 left-0 right-0 z-30
        bg-black bg-opacity-80 rounded-3xl p-4 w-[50%] h-[80%] m-auto"
        >
          <button
            onClick={handleOnClose}
            className="absolute -top-1 -left-1 w-10 h-10 bg-neutral-500 text-white
            text-center rounded-full font-righteous hover:scale-110 transition"
          >
            X
          </button>
          {props.children}
        </div>
      ) : null}
    </>
  );
};