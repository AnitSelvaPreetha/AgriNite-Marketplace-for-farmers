import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css"; // Import your CSS file

function AdminLogin() {
    const navigate = useNavigate();
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");

    const handleApi = () => {
        if ( username === "Admin" && password === "agriNite") {
            console.log("Navigating to admin page...");
            navigate('/admin');
        } else {
            alert("Invalid Admin Details")
        }
    };

    return (
        <div>
            <Header />
            <div className="login-container">
                <div className="login-form">
                    <h3>Welcome to Login</h3>
                    <input className="form-control" type="text" placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)} />
                    <input className="form-control" type="password" placeholder="Password" value={password} onChange={(e) => setpassword(e.target.value)} />
                    <button className="btn btn-primary" onClick={handleApi}>ADMIN LOGIN</button>

                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
