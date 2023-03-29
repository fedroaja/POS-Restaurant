import React, { useState } from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import PaidIcon from '@mui/icons-material/Paid';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const style = {
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
    transition: '0.3s',
    margin: 6,
    padding: 8,
    height: '20%',
    borderRadius: '5px',
    borderLeft: '10px solid #0095ffeb'
    
  };

function SalesHistory() {
const [state, setState] = useState({
    items: Array.from({ length: 20 }),
    hasMore: true
})

   function fetchMoreData(){
        if (state.items.length >= 500) {
          setState({ hasMore: false });
          return;
        }
        // a fake async api call like which sends
        // 20 more records in .5 secs
        setTimeout(() => {
          setState({
            items: state.items.concat(Array.from({ length: 20 }))
          });
        }, 500);
      };
  return (
    <div>
        <InfiniteScroll
          dataLength={state.items.length}
          next={fetchMoreData}
          hasMore={state.hasMore}
          loader={<h6>Loading...</h6>}
          height={350}
          className='scrollbar'
        >
          {state.items.map((i, index) => (
            <div style={style} key={index}>
              <Row>
                <Col><h6>Siomay</h6></Col>
                <Col></Col>
                <Col>2022-12-02</Col>
              </Row>
              <Row>
                <Col><small>Qty : 12</small></Col>
                <Col></Col>
                <Col><small><PaidIcon fontSize='small'/> 12.000</small></Col>
              </Row>
            </div>
          ))}
        </InfiniteScroll>
      </div>
  )
}

export default SalesHistory