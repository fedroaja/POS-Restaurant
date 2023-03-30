import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import bg from '../assets/images/bg_login.jpg'

function Login() {

    const navigate = useNavigate();

    const myStyle = {
        backgroundImage: `url(${bg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height:'100vh',
        width:'100vw'
    }

    async function authUser(username, password){
        let result = await fetch(process.env.REACT_APP_BASE_URL + "/auth", {
                method: "post",
                body: JSON.stringify({ username, password }),
                headers: {
                    "Content-type" : "application/json;charset=UTF-8"
                },
                credentials:"include"
            });
        
        return await result;
    }

    useEffect(() =>{
        
        const isLogin = localStorage.getItem("loggedIn");
        if(isLogin){
            (async function(){
                let myUser = await fetch(process.env.REACT_APP_BASE_URL + "/auth", {method:"get", credentials:"include"});
                let myRes = await myUser.json();
                
                if(myRes.ECode === 0){
                    switch(myRes.role)
                    {
                        case 0:
                            navigate("/admin/dashboard")
                            break;
                        case 1:
                            navigate("/cashier")
                            break;
                        case 2:
                            break;
                        default:break;
                    }
                }
          
              })();
        }

        // (async function(){
        //     const auth = JSON.parse(localStorage.getItem('user'));
        //     if(!auth) navigate("/login");
        //     else{
        //         let result = await authUser(auth.username, auth.password)
        //         result = await result.json();

        //         console.log(result)
        //         if (result.ECode == 0){
        //             switch(result.role)
        //             {
        //                 case 0:
        //                     navigate("/admin/dashboard")
        //                     break;
        //                 case 1:
        //                     navigate("/cashier")
        //                     break;
        //                 case 2:
        //                     break;
        //             }
        //         }else{
        //             localStorage.clear();
        //             alert(result.EMsg)
        //         }
        //     }
        // })();

    }, [])

    async function handleSubmit(e){
        e.preventDefault();

        let result = await authUser(e.target.username.value, e.target.password.value)
        result = await result.json();
        //console.log(result.username)
        if(result.ECode === 0){
            localStorage.setItem('loggedIn', true)
            switch(result.role)
            {
                case 0:
                    navigate("/admin/dashboard")
                    break;
                case 1:
                    navigate("/cashier")
                    break;
                case 2:
                    break;
                default:break;
            }
        }else{
            localStorage.clear()
            alert(result.EMsg)
        }

    }

  return (
    <div style={myStyle}>
        <div className="Auth-form-container">
            <form className="Auth-form"
                onSubmit={handleSubmit}>
                <div className="Auth-form-content">
                <h3 className="Auth-form-title">Sign In</h3>
                <div className="form-group mt-3">
                    <label>Username</label>
                    <input
                    type="text"
                    name="username"
                    className="form-control mt-1"
                    placeholder="Enter Username"
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Password</label>
                    <input
                    type="password"
                    name="password"
                    className="form-control mt-1"
                    placeholder="Enter password"
                    />
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button 
                        type="submit"
                        className="btn btn-primary">
                    Submit
                    </button>
                </div>
                </div>
            </form>
    </div>
    </div>
  )
}

export default Login