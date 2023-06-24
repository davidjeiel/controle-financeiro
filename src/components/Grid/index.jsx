import React, {useRef} from "react";
import GridItem from "../GridItem";
import { Container, Table } from "react-bootstrap";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { CSVLink } from 'react-csv';

const Grid = ({ itens, setItens }) => {
  const tableRef = useRef(null);
  const onDelete = (ID) => {
    const newArray = itens.filter((transaction) => transaction.id !== ID);
    setItens(newArray);
    localStorage.setItem("transactions", JSON.stringify(newArray));
  };  

  return (   
    <Container className="">
      
      <div className="row text-center pb-5" id="collapseDownload">
        <div className="col-md-2">
          <div className="btn-group">
                <DownloadTableExcel            
                    filename="ControleFinanceiro"
                    sheet="Movimentacoes"
                    currentTableRef={tableRef.current}
                >
                  <button className="btn btn-outline-success text-white btn-xs"> XLS </button>
                </DownloadTableExcel>
            
                <CSVLink data={itens}>
                  <button className="btn btn-outline-success text-white">CSV</button>
                </CSVLink>
          </div>  
        </div>          
        <div className="col-md-4">
            
        </div>
        <div className="col-md-4"></div>
      </div>
      
      <Table ref={tableRef} className="table-striped table-hover text-center text-light">
        <thead>
          <tr className="active fw-bold">
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Entrada/Saída</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {itens?.map((item, index) => (
              <GridItem key={index} item={item} onDelete={onDelete} />
            ))}
        </tbody>
      </Table>   
    </Container>
  );
};

export default Grid;
