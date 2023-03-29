import React from 'react'
import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses,menuClasses, useProSidebar } from 'react-pro-sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutIcon from '@mui/icons-material/Logout';

function SidebarMenu() {
  const navigate = useNavigate();
  const { collapseSidebar } = useProSidebar();

  function handleOnClick(e){
    e.preventDefault();
    (async function(){
      let myUser = await fetch("http://localhost:5000/auth/logout",{method:"get", credentials:"include"});
      let myRes = await myUser.json();
      
      if(myRes.ECode === 0){
        localStorage.clear();
        navigate("/login")
      }

    })();
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: '#f2f7ff',
          },
        }}>
        <Menu  menuItemStyles={{
            button: ({ level, active, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0)
                return {
                  marginTop: '20px',
                  fontSize: '20px',
                  color: disabled ? 'red' : '#674188',
                  
                };
            },
          }}>
          
          <MenuItem
            className="menu1"
            icon={<MenuRoundedIcon onClick={() => {
              collapseSidebar();
            }} />}
          >
            <h2>POSR</h2>
          </MenuItem>

          <MenuItem icon={< BarChartRoundedIcon/>} component={<Link to="dashboard" />}> Dashboard</MenuItem>
          <MenuItem icon={<ReceiptRoundedIcon/>} component={<Link to="product" />}> Product</MenuItem>
          <MenuItem icon={<TableRestaurantIcon/>} component={<Link to="table" />}> Table</MenuItem>
          <MenuItem icon={<ReceiptLongIcon/>} component={<Link to="transaction" />}> Transaction</MenuItem>
          <MenuItem icon={<AccountCircleRoundedIcon/>} component={<Link to="user" />}> User</MenuItem>
          <MenuItem icon={<LogoutIcon/>} onClick={handleOnClick}> Log Out</MenuItem>
        </Menu>
      </Sidebar>
      <Outlet/>
    </div>
  )
}

export default SidebarMenu