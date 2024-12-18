import React from "react";

const LaptopList = ({ laptops, onEdit, onDelete }) => {
  return (
    <section className="container">
      <div className="item">
        <table border="1" style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th className="item1">Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {laptops.map((laptop) => (
              <tr key={laptop.id}>
                <td>{laptop.id}</td>
                <td>{laptop.laptopName}</td>
                <td>${laptop.laptopPrice}</td>
                <td>{laptop.laptopDescription}</td>
                <td>
                  <button onClick={() => onEdit(laptop)}>Edit</button>
                  <button onClick={() => onDelete(laptop.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LaptopList;