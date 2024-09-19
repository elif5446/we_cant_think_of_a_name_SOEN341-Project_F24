import React from 'react';
import styled from 'styled-components';

const MainContainer = styled.section`
    background-color:#f9f5f2;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    `;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
`;

const Button = styled.button`
  background-color: #fff700;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const Main = () => (
  <MainContainer>
    <Title>WELCOME TO THE PEER ASSESEMENT PROGRAM</Title>
    <Button>INSTRUCTOR LOGIN</Button>
    <Button>STUDENT LOGIN</Button>
  </MainContainer>
);

export default Main;



