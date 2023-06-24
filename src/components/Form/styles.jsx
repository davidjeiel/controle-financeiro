import styled from "styled-components";

export const Container = styled.div`
  max-width: 87%;
  margin: 20px auto;
  z-index:1000;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: space-around;
  padding: 15px 0px;
  gap: 10px;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 7%;
  margin-right: 7%;
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(15px);
  border: 1px solid #fff;
  border-bottom: 1px solid rgba(255,255,255,0.5);
  border-right: 1px solid rgba(255,255,255,0.5);
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.7);

  @media (max-width: 750px) {
    display: grid;
  }
`;

export const InputContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label``;

export const Input = styled.input`
  outline: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 15px;
  border: 1px solid #ccc;
`;

export const RadioGroup = styled.div`
  display: flex;
  align-items: center;

  input {
    margin-left: 20px;
    margin-right: 5px;
    accent-color: black;
    margin-top: 0;
  }
`;

export const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  background-color: teal;
`;
