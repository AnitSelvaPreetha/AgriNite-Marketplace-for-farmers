import { useEffect, useState } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories.jsx";
import { FaHeart } from "react-icons/fa"
import './Home.css'
import API_URL from "../constants";

function Home() {
  const navigate = useNavigate();

  const [products, setproducts] = useState([]);
  const [likedproducts, setlikedproducts] = useState([]);
  const [refresh, setrefresh] = useState(false);
  console.log(likedproducts);
  const [search, setsearch] = useState('');
  const [cproducts, setcproducts] = useState([]);
  const [issearch, setissearch] = useState(false);

 


//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       navigate("/login");
//     }
//   }, []);

  useEffect(() => {
    const url = API_URL + "/get-products";
    axios
      .get(url)
      .then((res) => {
        if (res.data.products) {
          setproducts(res.data.products);
        }
      })
      .catch((err) => {
        alert("Server Error");
      });

      const url2 = API_URL + "/liked-products";
      let data={userId:localStorage.getItem('userId')}
    axios
      .post(url2,data)
      .then((res) => {
        if (res.data.products) {
          setlikedproducts(res.data.products);
        }
      })
      .catch((err) => {
        alert("Server Error");
      });

  }, [refresh]);

  const handlesearch=(value)=> {
    setsearch(value);
  }

  const handleClick=()=> {

    const url=API_URL + '/search?search='+search+ '&loc=' + localStorage.getItem('userLoc');
    axios
        .get(url)
        .then((res) => {
    setcproducts(res.data.products)
    setissearch(true);

        })
        .catch((err) => {
          alert("Server Err");
        });
  }



// //     let filteredProducts=products.filter((item)=> {
// // if(item.pname.toLowerCase().includes(search.toLowerCase) || 
// // item.pdesc.toLowerCase().includes(search.toLowerCase())||
// // item.category.toLowerCase().includes(search.toLowerCase()))
// // {
// //   return item;
// // }
// // })
//     setcproducts(filteredProducts)
   
const handleCategory=(value)=> {
let filteredProducts=products.filter((item,index)=> {
if(item.category == value)
{
  return item;
}
})
    setcproducts(filteredProducts)
}

const handleDisLike=(productId,e)=>{
  e.stopPropagation();
  let userId=localStorage.getItem('userId');
  if(!userId){
    alert('Please Login First')
    return;
  }


  const url=API_URL + '/dislike-product';
  const data={userId ,productId};
  axios
      .post(url,data)
      .then((res) => {
  if(res.data.message)
  {
    // alert('DisLiked')
    setrefresh(!refresh)
  }
      })
      .catch((err) => {
        alert("Server Error");
      });
}


const handleLike=(productId,e)=>{
  e.stopPropagation();
  let userId=localStorage.getItem('userId');
  if(!userId){
    alert('Please Login First')
    return;
  }


  const url=API_URL + '/like-product';
  const data={userId ,productId};
  axios
      .post(url,data)
      .then((res) => {
  if(res.data.message)
  {
    // alert('Liked')
    setrefresh(!refresh)
  }
      })
      .catch((err) => {
        alert("Server Error");
      });
}



const handleProduct=(id)=>{
  navigate('/product/'+id)
}

  return (
    <div>
      <Header search={search}  handlesearch={handlesearch } handleClick={handleClick}/>
      <Categories handleCategory={handleCategory} />
   
{issearch && cproducts && <h5>SEARCH RESULTS
  <button className="clear-btn" onClick={()=>  setissearch(false)}>CLEAR</button>
  </h5>}

{issearch && cproducts && cproducts.length== 0 && <h5>No Results Found</h5>}
{issearch && <div className="d-flex justify-content-center flex-wrap">

{cproducts &&
  cproducts.length > 0 &&
  cproducts.map((item,index) => {

    return( 
    <div  key={item._id} className="card m-3 ">
      <div onClick={()=>handleLike(item._id)} className="icon-con">
            <FaHeart className="icons" />
              </div>
      <img width="300px" height="200px" src={ API_URL +'/' + item.pimage} />
      <p className="m-2"> { item.pname } | {item.category}</p>
      <p className="m-2 text-success"> { item.pdesc}</p>
      <p className="m-2  text-danger"> { item.price}</p>
      <button>Buy Product</button>
      </div>
    )
  })}
  </div>}
{!issearch &&      <div className="d-flex justify-content-center flex-wrap">

      {products &&
        products.length > 0 &&
        products.map((item,index) => {

          return( 
          <div onClick={()=>handleProduct(item._id)}  key={item._id} className="card m-3 ">
            <div  className="icon-con">
              {
                likedproducts.find((likedItem)=> likedItem._id==item._id) ?
                <FaHeart onClick={(e)=>  handleDisLike(item._id,e)} className="red-icons" />:
                <FaHeart onClick={(e)=>  handleLike(item._id,e)} className="icons" />
                
              }
            
              </div>
            <img width="250px" height="150px" src={ API_URL + '/' + item.pimage} />
            <p className="m-2  price-text"> Rs.{ item.price} /- </p>
            <p className="m-2"> { item.pname } | {item.category}</p>
            <p className="m-2 text-success"> { item.pdesc}</p>
            <button>Buy Product</button>
            
            
            </div>
          )
        })}
        </div>}
        
    </div>
  );
}

export default Home;
