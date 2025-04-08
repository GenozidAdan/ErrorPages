import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const CustomUserForm = () => {
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    control_number: "",
    age: "",
    tel: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/users/form/")
      .then((response) => {
        console.log(response.data); // Verifica que los datos se reciban correctamente
        setFormFields(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los datos, contacte con el administrador", error);
        setLoading(false);
        });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post("http://127.0.0.1:8000/users/form/", formData)
      .then((response) => {
        alert(response.data.message); // Mensaje de éxito
        setErrors({}); // Limpiar errores en caso de éxito
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data); // Guardamos los errores en el estado
        }
        else{
            alert("Ocurrio un error inesperado, contacta al administrador.");
        }
        console.error("Error al enviar el formulario", error);
        setLoading(false);
        window.scrollTo(0, 0);
      });
  };

  if(loading){
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" style={{ width: "5rem", height: "5rem" }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      );
  }
  
  return (
    <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
              className="page"
            >
    <div>
      <h1>Nuevo Usuario</h1>
      <form onSubmit={handleSubmit}>
        {formFields &&
          Object.keys(formFields).map((field) => {
            const { label, input, type } = formFields[field];
            return (
              <div key={field}>
                <label htmlFor={input.id}>{label}</label>
                <input
                  {...input}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  name={field}
                  type={type || "text"}
                />
                {errors[field] && (
                    <span autoFocus className="text-danger">
                        {errors[field].map((errorMsg, index) => (
                            <span>
                            <i className="bi bi-exclamation-circle-fill me-1"></i>
                            {errorMsg}
                            </span>
                        ))}
                    </span>
                    )}
                <br />
              </div>
            );
          })}
        <button type="submit">Enviar</button>
      </form>
    </div>
    </motion.div>
  );
};

export default CustomUserForm;
