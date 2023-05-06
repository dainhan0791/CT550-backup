import React from 'react';
import styled from 'styled-components';

const SCLoaderRedWrapper = styled.section`
  width: 100%;
  display: inline-block;
  text-align: center;
  min-height: 215px;
  vertical-align: top;
  margin: 1%;
  background: #080915;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 30px 1px #103136 inset;
  box-shadow: 0px 0px 30px 1px #103136 inset;
`;
const SCLoaderWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 75px;
  display: inline-block;
  vertical-align: middle;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;
const SCLoaderOutter = styled.div`
  position: absolute;
  border: 4px solid #f50057;
  border-left-color: transparent;
  border-bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  -webkit-animation: spin 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
  animation: spin 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
`;
const SCLoaderInner = styled.div`
  position: absolute;
  border: 4px solid #f50057;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  left: calc(50% - 20px);
  top: calc(50% - 20px);
  border-right: 0;
  border-top-color: transparent;
  -webkit-animation: spin 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
  animation: spin 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
`;
const SCLoaderProgress = styled.div`
  color: #fff;
`;

const RedLoader = ({ progress }: { progress: number }) => {
  return (
    <SCLoaderRedWrapper>
      <SCLoaderWrapper>
        <SCLoaderOutter></SCLoaderOutter>
        <SCLoaderInner></SCLoaderInner>
      </SCLoaderWrapper>
      <SCLoaderProgress>{`${progress} %`} </SCLoaderProgress>
    </SCLoaderRedWrapper>
  );
};

export default RedLoader;
