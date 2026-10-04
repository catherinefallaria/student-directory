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

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>LavaLust Product System</h1>

          <p className="subtitle">
            Login to continue
          </p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>

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

            <div className="form-group">
              <label>Password</label>

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

            <button type="submit">
              Login
            </button>
          </form>

          {message && (
            <p className="message">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // PRODUCT MANAGEMENT PAGE
  return (
    <div className="container">
      <h1>PRODUCT MANAGEMENT</h1>

      <p>
        Welcome, <strong>{username}</strong>!
      </p>

      <div className="top-buttons">
        <button onClick={fetchProducts}>
          Refresh Products
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      {message && (
        <p className="message">
          {message}
        </p>
      )}

      {/* ADD / EDIT FORM */}
      <h2>
        {editingId
          ? "Edit Product"
          : "Add Product"}
      </h2>

      <form
        onSubmit={
          editingId
            ? handleUpdateProduct
            : handleAddProduct
        }
      >
        <div className="form-group">
          <label>Product Name</label>

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

        <div className="form-group">
          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Enter product description"
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>

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

        <div className="form-group">
          <label>Quantity</label>

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

        <button type="submit">
          {editingId
            ? "Update Product"
            : "Add Product"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={clearForm}
          >
            Cancel
          </button>
        )}
      </form>

      {/* PRODUCT LIST */}
      <h2>Product List</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table>
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
                <td>{product.id}</td>

                <td>
                  {product.product_name}
                </td>

                <td>
                  {product.description}
                </td>

                <td>
                  ₱
                  {Number(product.price).toFixed(2)}
                </td>

                <td>
                  {product.quantity}
                </td>

                <td>
                  <button
                    onClick={() =>
                      startEdit(product)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProduct(
                        product.id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;