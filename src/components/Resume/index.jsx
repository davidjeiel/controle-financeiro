import React from "react";
import { Card, CardGroup, Container } from "react-bootstrap";

const estiloCard = {
  marginLeft: "7%",
  marginRight: "7%",
  background: "rgba(255,255,255,0.25)",
  backdropFilter: "blur(15px)",
  border: "1px solid #fff",
  borderBottom: "1px solid rgba(255,255,255,0.5)",
  borderRight: "1px solid rgba(255,255,255,0.5)",
  borderRadius: "12px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.7)"
}

const blurStyle = {
  background: "rgba(255,255,255,0.25)",
  backdropFilter: "blur(15px)",
  border: "1px solid #fff",
  borderBottom: "1px solid rgba(255,255,255,0.5)",
  borderRight: "1px solid rgba(255,255,255,0.5)",
  borderRadius: "12px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.7)"
}



const Resume = ({ income, expense, total }) => {
  return (
      <Container>
        <Card style={estiloCard}>
          <Card.Header>
            <h3 className="text-center text-light fs-display-5">
              Resumo
            </h3>
          </Card.Header>
          <Card.Body>
            <CardGroup>
              <Card className="text-bg-success opacity-75" style={blurStyle}>
                <Card.Header >
                  <h3 className="text-center">Entrou</h3>
                </Card.Header>
                <Card.Body>
                  <h4 className="text-center">{ income }</h4>
                </Card.Body>
              </Card>
              <Card className="text-bg-warning opacity-75" style={blurStyle}>
                <Card.Header>
                  <h3 className="text-center">Saiu</h3>
                </Card.Header>
                <Card.Body>
                  <h4 className="text-center">{ expense }</h4>
                </Card.Body>
              </Card>
              <Card style={blurStyle} className={ 
                 // parseFloat( total ) > 0.0 ? "text-bg-success": "text-bg-danger"
                 "text-bg-secondary"
                }>
                <Card.Header>
                  <h3 className="text-center">
                    { 
                      //parseFloat( total ) > 0.0 ? "Sobrou": "Faltou"
                      "Sobrou"
                    }
                  </h3>
                </Card.Header>
                <Card.Body>
                  <h4 className="text-center">{ total }</h4>
                </Card.Body>
              </Card>
            </CardGroup>
          </Card.Body>
        </Card>
      </Container>    
  );
};

export default Resume;
