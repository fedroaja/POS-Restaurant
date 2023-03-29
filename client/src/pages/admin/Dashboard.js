import React from 'react'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ChartComp from '../../components/admin/ChartComp';
import SalesHistory from '../../components/admin/SalesHistory';

function Dashboard() {
  const dataPenjualan = [4,2,2,6,4,9,7];
  const dataProduct = [8,6,2,3,4,9,7];
  const dataTable = [2,6,9,5,4,10,2];
  return (
    <div style={{height:'100%', width: '100%', padding: '3%'}}>
      <Container>
        <Row>
          <Col>
            <Card style={{ 
              width: '22rem',
              border: 'none',
              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
              transition: '0.3s',
              background:'linear-gradient(45deg, rgba(255,243,0,0.299124649859944) 0%, rgba(149,0,255,0.2234943977591037) 100%)' }}>
              <Card.Body>
                <Card.Title><PaidIcon/> Earning</Card.Title>
                <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                <Card.Text style={{marginTop: '22%'}}>
                  <h2>Rp. 830.030.299</h2>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ 
              width: '22rem',
              border: 'none',
              boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
              transition: '0.3s',
              background:'linear-gradient(45deg, rgba(255,243,0,0.499124649859944) 0%, rgba(255,115,0,0.4234943977591037) 100%)' }}>
              <Card.Body>
                <Card.Title><ReceiptIcon/> Product</Card.Title>
                <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                <Card.Text style={{marginTop: '22%'}}>
                  <h2>232</h2>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ 
                width: '22rem',
                border: 'none',
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                transition: '0.3s',
                background:'linear-gradient(90deg, rgba(255,243,0,0.499124649859944) 0%, rgba(50,255,187,0.4234943977591037) 100%)' }}>
                <Card.Body>
                  <Card.Title><TableRestaurantIcon/> Table</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                  <Card.Text style={{marginTop: '22%'}}>
                    <h2>12</h2>
                  </Card.Text>
                </Card.Body>
              </Card>
          </Col>
        </Row>
        <Row style={{marginTop:'8%'}}>
          <Col>
              <ChartComp penjualan={dataPenjualan} product={dataProduct} table={dataTable}/>
          </Col>
          <Col >
              <SalesHistory/>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Dashboard