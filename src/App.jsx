import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://fallaria-catherine-lavalust.onrender.com";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editingId, setEditingId] = useState(null);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("Logging in...");

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const result = await response.json();

      if (result.status) {
        setIsLoggedIn(true);
        setMessage("Login successful!");
      } else {
        setMessage(
          result.message || "Invalid username or password."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the LavaLust API.");
    }
  };

  // GET PRODUCTS
  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.status) {
        setProducts(result.data);
      } else {
        setMessage(
          result.message || "Unable to load products."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  // ADD PRODUCT
  const handleAddProduct = async (e) => {
    e.preventDefault();

    setMessage("Adding product...");

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          product_name: productName,
          description: description,
          price: Number(price),
          quantity: Number(quantity),
        }),
      });

      const result = await response.json();

      if (result.status) {
        setMessage("Product added successfully!");

        clearForm();
        fetchProducts();
      } else {
        setMessage(
          result.message || "Unable to add product."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to add product.");
    }
  };

  // START EDIT
  const startEdit = (product) => {
    setEditingId(product.id);
    setProductName(product.product_name);
    setDescription(product.description);
    setPrice(product.price);
    setQuantity(product.quantity);

    setMessage(`Editing product #${product.id}`);
  };

  // UPDATE PRODUCT
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    setMessage("Updating product...");

    try {
      const response = await fetch(
        `${API_URL}/api/products/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            product_name: productName,
            description: description,
            price: Number(price),
            quantity: Number(quantity),
          }),
        }
      );

      const result = await response.json();

      if (result.status) {
        setMessage("Product updated successfully!");

        clearForm();
        fetchProducts();
      } else {
        setMessage(
          result.message || "Unable to update product."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to update product.");
    }
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("Deleting product...");

    try {
      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.status) {
        setMessage("Product deleted successfully!");

        fetchProducts();
      } else {
        setMessage(
          result.message || "Unable to delete product."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete product.");
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (result.status) {
        setIsLoggedIn(false);
        setUsername("");
        setPassword("");
        setProducts([]);
        clearForm();
        setMessage("Logged out successfully!");
      } else {
        setMessage(
          result.message || "Unable to logout."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the LavaLust API.");
    }
  };

  // CLEAR FORM
  const clearForm = () => {
    setProductName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setEditingId(null);
  };

  // LOAD PRODUCTS AFTER LOGIN
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  // =========================================
  // LOGIN PAGE
  // =========================================

  if (!isLoggedIn) {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="login-header">

            <div className="logo-circle">
              L
            </div>

            <h1>LavaLust</h1>

            <p>
              Sign in to manage your products
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            <div className="input-group">

              <label>
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter username"
                required
              />

            </div>

            <div className="input-group">

              <label>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                required
              />

            </div>

            <button
              className="login-button"
              type="submit"
            >
              Login
            </button>

          </form>

          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

        </div>

      </div>
    );
  }

  // =========================================
  // PRODUCT MANAGEMENT PAGE
  // =========================================

  return (
    <div className="product-page">

      <div className="product-container">

        <div className="product-header">

          <div>

            <p className="small-title">
              LAVALUST
            </p>

            <h1>
              Product Management
            </h1>

            <p className="welcome-text">
              Welcome, <strong>{username}</strong>!
            </p>

          </div>

          <div className="header-buttons">

            <button
              className="refresh-button"
              onClick={fetchProducts}
            >
              Refresh
            </button>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

        {message && (
          <div className="status-message">
            {message}
          </div>
        )}

        {/* ADD / EDIT PRODUCT */}

        <div className="form-card">

          <div className="section-title">

            <div className="section-icon">
              {editingId ? "✎" : "+"}
            </div>

            <div>

              <h2>
                {editingId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p>
                {editingId
                  ? "Update the product information below."
                  : "Enter the details of your new product."}
              </p>

            </div>

          </div>

          <form
            className="product-form"
            onSubmit={
              editingId
                ? handleUpdateProduct
                : handleAddProduct
            }
          >

            <div className="product-field">

              <label>
                Product Name
              </label>

              <input
                type="text"
                value={productName}
                onChange={(e) =>
                  setProductName(e.target.value)
                }
                placeholder="Enter product name"
                required
              />

            </div>

            <div className="product-field">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Enter product description"
                required
              />

            </div>

            <div className="product-field">

              <label>
                Price
              </label>

              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="Enter price"
                required
              />

            </div>

            <div className="product-field">

              <label>
                Quantity
              </label>

              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="Enter quantity"
                required
              />

            </div>

            <div className="form-actions">

              <button
                className="primary-button"
                type="submit"
              >
                {editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* PRODUCT LIST */}

        <div className="list-card">

          <div className="list-header">

            <div>

              <h2>
                Product List
              </h2>

              <p>
                Manage your available products.
              </p>

            </div>

            <span className="product-count">
              {products.length} Products
            </span>

          </div>

          {loading ? (
            <div className="empty-message">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="empty-message">
              No products found.
            </div>
          ) : (
            <div className="table-wrapper">

              <table className="product-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {products.map((product) => (
                    <tr key={product.id}>

                      <td>
                        <span className="id-badge">
                          #{product.id}
                        </span>
                      </td>

                      <td className="product-name-cell">
                        {product.product_name}
                      </td>

                      <td>
                        {product.description}
                      </td>

                      <td className="price-cell">
                        ₱
                        {Number(product.price).toFixed(2)}
                      </td>

                      <td>
                        {product.quantity}
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              startEdit(product)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDeleteProduct(
                                product.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default App;