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
        bg-black bg-opacity-80 rounded-3xl p-5 w-[50vw] h-[70vh] m-auto"
        >
          <button
            onClick={handleOnClose}
            className="absolute -top-1 -left-1 w-10 h-10 bg-neutral-500 text-white
            rounded-full font-righteous hover:scale-110 transition z-50"
          >
            X
          </button>
          <div className="relative text-center flex flex-1">
            {props.children}
          </div>
        </div>
      ) : null}
    </>
  );
};
