import React from 'react'
import bg from '../assets/images/notfound.jpg'

function Notfound() {


  const myStyle = {
    backgroundImage: `url(${bg})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height:'100vh',
    width:'100vw'
  }

  return (
    <div style={myStyle}>
    </div>
  )
}

export default Notfound