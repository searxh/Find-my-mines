import React from "react";
import { HowToPlayVisibleType } from "../types";
import Welcome from "./HowToPlayPages/Welcome";
import Page1 from "./HowToPlayPages/Page1";
import Page2 from "./HowToPlayPages/Page2";
import Page3 from "./HowToPlayPages/Page3";
import Page4 from "./HowToPlayPages/Page4";
import { PagesDot } from "./UIElements/PagesDot";
import { PopUp } from "./UIElements/PopUp";
import { GlobalContext } from "../states";

const lastPage = 4;

const HowToPlay = () => {
  const { global_state, dispatch } = React.useContext(GlobalContext);
  const { persistentFlags } = global_state;
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [visible, setVisible] = React.useState<HowToPlayVisibleType | null>(
    null
  );
  const getVisibleState = () => {
    if (currentPage === 0) {
      return { backButton: false, frontButton: true };
    } else if (currentPage === lastPage) {
      return { backButton: true, frontButton: false };
    } else {
      return { backButton: true, frontButton: true };
    }
  };
  const handleOnClick = (isBackward: boolean) => {
    if (isBackward && currentPage - 1 >= 0) {
      setCurrentPage((currentPage) => currentPage - 1);
    } else if (!isBackward && currentPage + 1 <= lastPage) {
      setCurrentPage((currentPage) => currentPage + 1);
    }
  };
  //init visible state through function
  React.useEffect(() => {
    if (visible === null) {
      setVisible(getVisibleState());
    }
  }, []);
  React.useEffect(() => {
    setVisible(getVisibleState());
  }, [currentPage]);
  return (
    <>
      {persistentFlags.howToPlayIsActive ? (
        <PopUp
          onClose={() => {
            //set how to play is active flag to false
            //(prevents it from displaying to user again)
            const newPersistentFlags = {
              ...persistentFlags,
              howToPlayIsActive: false,
            };
            dispatch({
              type: "set",
              field: "persistentFlags",
              payload: newPersistentFlags,
            });
          }}
        >
          <div className="relative flex-1">
            <div className="absolute top-0 bottom-0 right-0 left-0 flex flex-col">
              {currentPage === 0 ? (
                <Welcome />
              ) : currentPage === 1 ? (
                <Page1 />
              ) : currentPage === 2 ? (
                <Page2 />
              ) : currentPage === 3 ? (
                <Page3 />
              ) : currentPage === 4 ? (
                <Page4 />
              ) : null}
            </div>
            <div className="flex justify-between bottom-0 w-full">
              {visible?.backButton ? (
                <button
                  onClick={() => {
                    handleOnClick(true);
                  }}
                  className="text-white absolute -left-2 top-0 bottom-0 hover:scale-110 transition"
                >
                  <svg
                    className="w-8 h-8 hover:fill-white fill-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                  </svg>
                </button>
              ) : (
                <div className="w-8 h-8" />
              )}
              <div className="absolute bottom-0 w-full">
                <PagesDot currentPage={currentPage} totalPages={lastPage + 1} />
              </div>

              {visible?.frontButton ? (
                <button
                  onClick={() => {
                    handleOnClick(false);
                  }}
                  className="text-white absolute -right-2 top-0 bottom-0 hover:scale-110 transition"
                >
                  <svg
                    className="w-8 h-8 hover:fill-white fill-neutral-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path d="M342.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L274.7 256 105.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                  </svg>
                </button>
              ) : (
                <div className="w-8 h-8" />
              )}
            </div>
          </div>
        </PopUp>
      ) : null}
    </>
  );
};

export default HowToPlay;
