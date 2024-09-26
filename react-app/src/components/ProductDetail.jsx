import { useParams,Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import API_URL from "../constants";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom"; 
import './ProductDetail.css'



let socket;

function ProductDetail() {
  const [product, setproduct] = useState();
  const [msg, setmsg] = useState();
  const [msgs, setmsgs] = useState([]);
  const [user, setuser] = useState();
  const [showChat, setShowChat] = useState(false); // State to control chat visibility
  
  const navigate = useNavigate();

  const p = useParams();
  const { productId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-product/${productId}`);
        if (response.data.product) {
          setproduct(response.data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Server Error");
      }
    };

    fetchData();

    return () => {
      // Cleanup function if needed
    };
  }, [productId]);

  useEffect(() => {
    socket = io(API_URL);

    socket.on("connect", () => {
      console.log("con");
    });
    return () => {
      socket.disconnect(); // Cleanup function to disconnect the socket when component unmounts
    };

  },[])


  useEffect(() => {

socket.emit('getMsgs',{})

    socket.on("getMsg", (data) => {
      
      
        
        const _data = data.filter((item,index)=>{
          
          return item.productId == p.productId
        })
        console.log(_data,'_data')
         setmsgs(_data);
    
    });
  }, [p.productId]);

  const handleSend = () => {
    const data = { username: localStorage.getItem("userName"), msg, productId : localStorage.getItem('productId')};
    console.log(data,"data send")
    socket.emit("sendMsg", data);
    setmsg('')
  };

  useEffect(() => {
    const url = API_URL + "/get-product/" + p.productId;
    axios
      .get(url)
      .then((res) => {
        if (res.data.product) {
          setproduct(res.data.product);
          localStorage.setItem('productId',res.data.product._id)
        }
      })
      .catch((err) => {
        alert("Server Error");
      });
  }, []);

  const handleContact = (addedBy) => {
    console.log("id", addedBy);
    const url = API_URL + "/get-user/" + addedBy;
    axios
      .get(url)
      .then((res) => {
        if (res.data.user) {
          setuser(res.data.user);
        }
      })
      .catch((err) => {
        alert("Server Error");
      });
  };

  const handleClearChat = () => {
    setmsgs([]); // Clearing all messages
  };

  const handleBuyProduct = () => {
    navigate("/buy-product"); 
  };


  return (
    <>
      <Header />
      PRODUCT DETAILS:
      <div>
        {product && (
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <img
                width="400px"
                height="200px"
                src={API_URL + "/" + product.pimage}
                alt=""
              />
              {product.pimage2 && (
                <img
                  width="400px"
                  height="200px"
                  src={API_URL + "/" + product.pimage2}
                  alt=""
                />
              )}
              <h6>Product Details :</h6>
              
              <p className="m-2  price-text"> Rs.{product.price} /-</p>
              <p className="m-2 product-text">
      
                {product.pname} | {product.category}
              </p>
              <p className="m-2 text-success product-desc"> {product.pdesc}</p>

              {product.addedBy && (
                <button onClick={() => handleContact(product.addedBy)}>
                  SHOW CONTACT DETAILS
                </button>
              )}
              {user && user.username && <h6>UserName:{user.username}</h6>}
              {user && user.email && <h6>Email:{user.email}</h6>}
              {user && user.mobile && <h6>Ph No:{user.mobile}</h6>}
            </div>
            
            <div>
              {/* Button to toggle chat */}
              <button onClick={() => setShowChat(!showChat)} className="btn btn-primary">
                {showChat ? 'Hide Chat' : 'Show Chat'}
              </button>
              
              {/* Chat component (conditionally rendered based on showChat state) */}
              {showChat && (
                <div>
                  CHATS
                  {msgs &&
                    msgs.length > 0 &&
                    msgs.map((item, index) => {
                      if (item.username === localStorage.getItem("userName")) {
                        return (
                          <p key={item._id} style={{marginRight:'100px', background: "#61dafb", borderRadius: "5px" }}>
                  
                            {item.username}:{item.msg}
                          </p>
                        );
                      }
                      if (item.username !== localStorage.getItem("userName")) {
                        return (
                          <p key={item._id} style={{color:'#fff', marginLeft:'100px',background: "#282c34", borderRadius: "5px" }}>
                            {item.username}:{item.msg}
                          </p>
                        );
                      }
                    })}
                  <input
                    value={msg}
                    onChange={(e) => setmsg(e.target.value)}
                    className="form-control"
                    type="text"
                  />
                  <button onClick={handleSend} className="btn btn-primary">
                    {" "}
                    SEND
                  </button>
                  <button onClick={handleClearChat} className="btn btn-danger">
                    Clear Chat
                  </button>
                </div>
              )}
            </div>
            <div>
        <Link to={`/buy-product/${productId}`} className="btn btn-success buy">
          Buy Now
        </Link>
        </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail;
