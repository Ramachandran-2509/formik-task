import "./App.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { faBell, faEnvelope, faLaughWink, faSearch, faList } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuIcon from '@mui/icons-material/Menu';
import { useHistory } from "react-router";
import { Link, Route, Switch, Redirect, useParams } from "react-router-dom";
function App() {
  //to hide/show the side navbar when the menu button on the top is clicked(for small screens)
  const [navshow, setnavshow] = useState("block");
  return (
    <div className="wholepage">
      {/*hides side nav bar when the menu button is clicked */}
      <div className="nav-bar" style={{ display: navshow }}>
        <Link className="link" to="/Dashboard">
          <div className="nav-items">
            <FontAwesomeIcon icon={faLaughWink} size="2x" /><span>Dashboard</span>
          </div>
        </Link>
        <Link className="link" to="/products">
          <div className="nav-items" >
            <FontAwesomeIcon icon={faList} size="1x" />
            List products
          </div>
        </Link>
        <hr />
        <div className="procontainer">
          <img className="proimage" src="https://startbootstrap.github.io/startbootstrap-sb-admin-2/img/undraw_rocket.svg" alt = "" />
          <div>SB Admin Pro is packed with premium features, components, and more!</div>
          <button className="probutton">Upgrade to Pro!</button>
        </div>
      </div>
      {/*creating a menubar on top */}
      <div>
        <div className="topnavbar">
          {/*when menu button is clicked, the side navbar toggles between hide/show. 
              This menu button is not available for large screens and the sidenavbar is always visible */}
          <button className="navtogglebutton" onClick={() => { navshow === "block" ? setnavshow("none") : setnavshow("block") }}><MenuIcon /></button>

          <div className="searchbarNicon">
            <input type="text" placeholder="Search for..." className="topnavsearchbar"></input>
            <button className="topnavbaricon"><FontAwesomeIcon icon={faSearch} className="topnavicon" /></button>
          </div>
          <div className="topnavrightpart">
            <div className="topnavbellicon"><FontAwesomeIcon icon={faBell} /></div>
            <div className="topnavbellicon"><FontAwesomeIcon icon={faEnvelope} /></div>
            <div className="topnavproductname">douglas McGee</div>
          </div>
        </div>
        <Routes />

        {/*creating a copyright content at the bottom of screen */}
        <div className="coyrightcontainer">Copyright © Your Website 2021</div>
      </div>

    </div>

  );
}
//route paths
function Routes() {
  return (
    <>
      <div className="container">
        <Switch>
          <Route path="/Dashboard">
            <Dashboard />
          </Route>
          <Route path="/products">
            <Listproducts />
          </Route>

          <Route path="/create-product">
            <Createproduct />
          </Route>
          {/* "/:id" is dynamic, which is formed when the corresponding button is clicked */}
          <Route path="/edit-product/:id">
            <Editproduct />
          </Route>
          <Route path="/edit-price/:id">
            <Editprice />
          </Route>
          <Route exact path="/">
            <Redirect to="/Dashboard" />
          </Route>
        </Switch>
      </div>
    </>
  )
}
//creates the dashboard page 
function Dashboard() {
  return (
    <div className="dashboard-container">
      <Link className="dashboard-content" to="/create-product">Create product</Link><br />
      <Link className="dashboard-content" to="/products">List products</Link>
    </div>
  )
}
//creates new product
function Createproduct() {
  const addproduct = (product) => {
    fetch("https://6121377ff5849d0017fb41c6.mockapi.io/products", {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json());
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      pic: "",
      price: "",
    },
    validationSchema: yup.object({
      name: yup.string()
        .min(3, "please enter longer product name")
        .required("please provide product name"),
      pic: yup.string()
        .min(3, "please enter longer image url")
        .required("please provide image url"),
      price: yup.number()
        .required("please provide valid price (a number)")
    }),
    onSubmit: (product) => {
      addproduct(product)
    },
  });
  return (
    <div className="new-input-boxes">
      <form onSubmit={formik.handleSubmit}>
        <input className="input-box name-input" placeholder="product name..."
          name="name" onChange={formik.handleChange} value={formik.values.name} /><br/>
        {formik.touched.name && formik.errors.name ? (
          <p className = "errors">{formik.errors.name}</p>
        ) : ("")
        }
        <input className="input-box pic-input" placeholder="product image..."
          name="pic" onChange={formik.handleChange} value={formik.values.pic} /><br/>
        {formik.touched.pic && formik.errors.pic ? (
          <p className = "errors">{formik.errors.pic}</p>
        ) : ("")
        }
        <textarea rows="3" placeholder="product price..." className="input-box"
          name="price" onChange={formik.handleChange} value={formik.values.price} />
        {formik.touched.price && formik.errors.price ? (
          <p className = "errors">{formik.errors.price}</p>
        ) : ("")
        }
        {/*product list will be updated by adding the new product price */}
        <button className="input-button" type="submit">Add product</button><br />
      </form>
    </div>
  )
}
//lists the products with price
function Listproducts() {
  const [newlist, setnewlist] = useState([]);
  const history = useHistory();
  //fetched data from API
  function getproducts() {
    fetch("https://6121377ff5849d0017fb41c6.mockapi.io/products", {
      method: "GET"
    })
      .then((data) => data.json())
      .then((products) => setnewlist(products));
  }
  //deletes the product from API with the id
  function deleteproduct(id) {
    fetch(`https://6121377ff5849d0017fb41c6.mockapi.io/products/${id}`, {
      method: "DELETE"
    })
      .then((data) => data.json())
      .then(() => getproducts());
  }
  //To execute only once while loading
  useEffect(() => {
    getproducts();
  }, []);
  return (
    <div className="list-products">
      {newlist.map(({ name, pic, price, id }) =>
        <div className="card">
          <img src={pic} alt = "" />
          <div className="productname">{name}</div>
          <div className="price">${price}.00</div>
          <div className="list-buttons">
            {/*routes to the new path with the current id, when edit button is clicked */}
            <button onClick={() => history.push("/edit-product/" + id)}>Edit product</button>
            {/*removes the product with the current id from the list, when delete button is clicked */}
            <button className="delete-button" onClick={() => deleteproduct(id)} >Delete product</button><br />
            <button className="price-button" onClick={() => history.push("/edit-price/" + id)}>Edit price</button>
          </div>
        </div>)}
    </div>
  )
}
//edits the product 
function Editproduct() {
  // takes the id from the dynamic path using the hook useparams 
  const { id } = useParams();
  function edit(product) {
    fetch(`https://6121377ff5849d0017fb41c6.mockapi.io/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    })
      .then((data) => data.json())
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      pic: "",
    },
    validationSchema: yup.object({
      name: yup.string()
        .min(3, "please enter longer product name")
        .required("please provide product name"),
      pic: yup.string()
        .min(3, "please enter longer image url")
        .required("please provide image url")
    }),
    onSubmit: (product) => {
      edit(product)
    },
  });
  return (
    <div className="new-input-boxes">
      <form onSubmit={formik.handleSubmit}>
        <input className="input-box name-input" placeholder="product name..."
          name="name" onChange={formik.handleChange} value={formik.values.name} /><br/>
        {formik.touched.name && formik.errors.name ? (
          <p className = "errors">{formik.errors.name}</p>
        ) : ("")
        }
        <input placeholder="product image..." className="input-box pic-input"
          name="pic" onChange={formik.handleChange} value={formik.values.pic} /><br/>
        {formik.touched.pic && formik.errors.pic ? (
          <p className = "errors">{formik.errors.pic}</p>
        ) : ("")
        }
        <button type="submit" className="input-button">Edit product</button><br />
      </form>
    </div>
  )
}
//edits price price
function Editprice() {
  // takes the id from the dynamic path using the hook useparams 
  const { id } = useParams();
  //edits the price in API with the id
  function edit(product) {
    fetch(`https://6121377ff5849d0017fb41c6.mockapi.io/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    })
  }
  const formik = useFormik({
    initialValues: {
      price: "",
    },
    validationSchema: yup.object({
      price: yup.number()
        .required("please provide valid price (a number)")
    }),
    onSubmit: (product) => {
      edit(product)
    },
  });
  return (
    <div className="price-page">
      <form onSubmit={formik.handleSubmit}>
        <textarea rows="3" placeholder="product price..." className="input-box"
          name="price" onChange={formik.handleChange} value={formik.values.price} /><br />
        {formik.touched.price && formik.errors.price ? (
          <p className = "errors">{formik.errors.price}</p>
        ) : ("")
        }
        <button type = "submit" className="input-button">Edit product price</button><br />
      </form>
    </div>
  )

}
export default App;