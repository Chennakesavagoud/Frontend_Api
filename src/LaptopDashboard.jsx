import React, { useEffect, useState } from "react";
import LaptopList from "./LaptopList";

const LaptopDashboard = () => {
  const [laptops, setLaptops] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    laptopName: "",
    laptopPrice: "",
    laptopDescription: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    laptopName: "",
    laptopPrice: "",
    laptopDescription: "",
  });

  const API_URL = "http://localhost:8086/api/laptops";

  useEffect(() => {
    fetchLaptops();

    const intervalId = setInterval(() => {
      fetchLaptops();
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchLaptops = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch laptops");
      }
      const data = await response.json();
      setLaptops(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createLaptop = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create laptop");
      }
      const newLaptop = await response.json();
      setLaptops([...laptops, newLaptop]);
      setFormData({
        id: "",
        laptopName: "",
        laptopPrice: "",
        laptopDescription: "",
      });
      setMessage("Laptop created successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const updateLaptop = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update laptop");
      }
      const updatedLaptop = await response.json();
      setLaptops(
        laptops.map((laptop) =>
          laptop.id === updatedLaptop.id ? updatedLaptop : laptop
        )
      );
      setFormData({
        id: "",
        laptopName: "",
        laptopPrice: "",
        laptopDescription: "",
      });
      setIsEdit(false);
      setMessage("Laptop updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const deleteLaptop = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete laptop");
      }
      // Update the state by removing the deleted laptop
      setLaptops(laptops.filter((laptop) => laptop.id !== id));
      setMessage("Laptop deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const selectLaptopForEdit = (laptop) => {
    setFormData(laptop);
    setIsEdit(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredLaptops = laptops.filter((laptop) =>
    Object.keys(filters).every((key) =>
      filters[key] === "" ||
      laptop[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  return (
    <div>
      <h1>Laptop Dashboard</h1>
      {message && <p>{message}</p>}

      <form onSubmit={isEdit ? updateLaptop : createLaptop}>
        {isEdit && <input type="hidden" name="id" value={formData.id} />}
        <input
          type="text"
          name="laptopName"
          placeholder="Laptop Name"
          value={formData.laptopName}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="laptopPrice"
          placeholder="Laptop Price"
          value={formData.laptopPrice}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="laptopDescription"
          placeholder="Laptop Description"
          value={formData.laptopDescription}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{isEdit ? "Update" : "Create"}</button>
      </form>

      <div className="container">
        <h2>Laptop List with Filter Components</h2>
        <div className="data">
          <input
            type="text"
            name="id"
            placeholder="Id Component"
            value={filters.id}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="laptopName"
            placeholder="Name Component"
            value={filters.laptopName}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="laptopPrice"
            placeholder="Price Component"
            value={filters.laptopPrice}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="laptopDescription"
            placeholder="Description Component"
            value={filters.laptopDescription}
            onChange={handleFilterChange}
          />
        </div>

        <LaptopList
          laptops={filteredLaptops}
          onEdit={selectLaptopForEdit}
          onDelete={deleteLaptop}
        />
      </div>
    </div>
  );
};

export default LaptopDashboard;
