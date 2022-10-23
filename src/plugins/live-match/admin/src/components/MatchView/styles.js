import styled, { createGlobalStyle } from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
`;

export const MatchOpponents = styled.div`
  width: 80%;
  display: flex;
  flex-direction: colums;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  text-align: center;
  margin: auto;
`;

export const Side = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    border-radius: 5px;
    margin-bottom: 10px;
  }
`;

export const LeftSide = styled(Side)``;

export const RightSide = styled(Side)``;

export const Result = styled.div`
  font-size: 30px;
  font-family: Helvetica;
`;

export const ControlPanel = styled.div`
  width: 70%;
  margin: 15px auto;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  min-height: 120px;
  position: relative;
  &::before {
    position: absolute;
    content: "Control Panel";
    display: inline-block;
    padding: 5px 10px;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 0px 0px 5px 0px;
  }
`;

export const FinalScoreInputs = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

export const WinnerField = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  & > div {
    width: 100%;
  }
`;

export const StrikerField = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  & > div {
    width: 100%;
  }
`;

export const Selections = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const BtnWrapper = styled.div`
  width: 100%;
  padding: 0px 20px 20px 20px;
`;

export const Legend = styled.div`
    font-size: 14px;
    text-transform: uppercase;
    background-color: #4945ff;
    border-radius: 3px;
    padding: 4px 8px;
    color: white;
    max-width: 150px;
    text-align: center;
    margin: 25px auto;
    position: relative;
    &::before {
        content: " ";
        display: block;
        width: 150px;
        height: 1px;
        background-color: #4945ff;
        position: absolute;
        top: 10px;
        left: -150px;
    }
    &::after {
        content: " ";
        display: block;
        width: 150px;
        height: 1px;
        background-color: #4945ff;
        position: absolute;
        top: 10px;
        right: -150px;
    }
`;
