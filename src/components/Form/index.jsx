import React, { useEffect, useState } from "react";
import Grid from "../Grid";
import * as C from "./styles";
import { Button, Col, Container, FormControl, Row, Form as Formulario } from "react-bootstrap";
import CreatableSelect from 'react-select/creatable';

const Form = ({ handleAdd, transactionsList, setTransactionsList }) => {
  const [ desc,           setDesc           ] = useState("");
  const [ amount,         setAmount         ] = useState("");
  const [ isExpense,      setExpense        ] = useState(false);
  const [ selectedOption, setSelectedOption ] = useState("");
  const [ typeExpense,    setTypeExpense    ] = useState("");
  const [ options,        setOptions        ] = useState([
    {value: "Saude",     label:"Saúde"},
    {value: "Moradia",   label:"Moradia"},
    {value: "Transporte",label:"Transporte"},
    {value: "Seguranca", label:"Segurança"},
    {value: "Emprestimo",label:"Empréstimo"}
  ]);
  
  const generateID = () => Math.round(Math.random() * 1000);

  const handleChange = ( newValue, actionMeta )=>{
    setSelectedOption( newValue );
    console.debug( selectedOption );
  }

  const handleCreate = (inputValue)=>{
    let newOption = {
      value: inputValue.toLowerCase(),
      label: inputValue
    };
    setSelectedOption( newOption );
    
    let newOptions = [ ...options, newOption ];
    setOptions( newOptions );
    console.debug(selectedOption);
    console.debug(options);
  }

  useEffect(()=>{
      setTypeExpense(selectedOption.value);
  }, [selectedOption])

  const handleSave = () => {
    if (!desc || !amount) {
      alert("Informe a descrição e o valor!");
      return;
    } else if (amount < 1) {
      alert("O valor tem que ser positivo!");
      return;
    } 
    // else if( typeExpense === '' ){
    //   alert("A descrição da movimentação precisa ser selecionada!");
    //   return;
    // }

    const transaction = {
      id: generateID(),
      desc: desc,
      amount: amount,
      type: typeExpense,
      expense: isExpense,
    };

    handleAdd(transaction);

    setDesc("");
    setAmount("");
    setTypeExpense("");
    setSelectedOption("");
  };

  return (
    <>
      <Container className="pt-5 pb-5">
        <Row>          
          <Col md={2}>
            <label className="text-light">Valor</label>
            <FormControl
              value={amount}
              type="number"
              onChange={(e) => setAmount(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <label className="text-light">Descrição</label>
            <FormControl value={desc} onChange={(e) => setDesc(e.target.value)}/>            
          </Col>
          <Col md={3}>
            <label className="text-light">Tipo</label>            
            <CreatableSelect 
              style={{ color : "black"}}
              isClearable 
              value={selectedOption}
              options={options} 
              onChange={handleChange}
              onCreateOption={handleCreate}
            />         
          </Col>
          <Col md={2}  className="text-center pt-4">            
            <C.RadioGroup>              
              <C.Input
                type="radio"
                id="rIncome"
                defaultChecked
                name="group1"
                onChange={() => setExpense(!isExpense)}
              />
              <C.Label className="text-light" htmlFor="rIncome">Entrada</C.Label>
              <C.Input
                type="radio"
                id="rExpenses"
                name="group1"
                onChange={() => setExpense(!isExpense)}
              />
              <C.Label className="text-light" htmlFor="rExpenses">Saída</C.Label>
            </C.RadioGroup>            
          </Col>
          <Col md={1} className="mt-4 text-center">
            <Button variant="secondary" onClick={handleSave}>
              ADICIONAR
            </Button>     
          </Col>
        </Row>      
      </Container>
      <Grid itens={transactionsList} setItens={setTransactionsList} />
    </>
  );
};

export default Form;
