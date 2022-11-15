import React from "react";
import { HowToPlayVisibleType } from "../types";
import { Page1 } from "./HowToPlayPages/Page1";
import { Page2 } from "./HowToPlayPages/Page2";
import { Page3 } from "./HowToPlayPages/Page3";
import { Page4 } from "./HowToPlayPages/Page4";
import { Welcome } from "./HowToPlayPages/Welcome";
import { PopUp } from "./UIElements/PopUp";

const lastPage = 4;

const HowToPlay = () => {
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
    <PopUp>
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
      {visible?.backButton ? (
        <button
          onClick={() => {
            handleOnClick(true);
          }}
          className="text-white"
        >
          {"<"}
        </button>
      ) : null}
      <div className="text-white">{currentPage}</div>
      {visible?.frontButton ? (
        <button
          onClick={() => {
            handleOnClick(false);
          }}
          className="text-white"
        >
          {">"}
        </button>
      ) : null}
    </PopUp>
  );
};

export default HowToPlay;
