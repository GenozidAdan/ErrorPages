import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";

const UserDataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const currentUserEmail = localStorage.getItem("email"); 
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const [showModal, setShowModal] = useState(false); 
  const [userToEdit, setUserToEdit] = useState(null); 
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    control_number: '',
    age: '',
    tel: ''
  });
  

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.tel,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <span>
          <button
            className="btn btn-warning me-4"
            onClick={() => handleEditUser(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-danger me-4"
            onClick={() => handleDeleteUser(row)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </span>
      ),
    },
  ];



  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://127.0.0.1:8000/users/api/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      });
  };

  const handleDeleteUser = (user) => {
    if (currentUserEmail === user.email) {
      Swal.fire("Error", "No puedes eliminar tu propia cuenta", "error");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás a ${user.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(user.email); 
      }
    });
  };

  const deleteUser = async (userEmail) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/users/delete_user_by_email/${userEmail}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
      fetchUsers(); 
    } catch (error) {
      if (error.response?.status === 401) {
        await refreshAccessToken();
        deleteUser(userEmail); 
      } else {
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  const handleEditUser = (user) => {
    setFormData({
      email: user.email,
      name: user.name,
      surname: user.surname,
      control_number: user.control_number,
      age: user.age,
      tel: user.tel,
      password1: '',  
      password2: ''   
    });
    setUserToEdit(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateUser = async () => {
    if (formData.password1 !== formData.password2) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }
  

    const userDataToUpdate = { ...formData };

    if (!formData.password1 || !formData.password2) {
      delete userDataToUpdate.password1;
      delete userDataToUpdate.password2;
    }
  
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Actualizarás la información de ${userToEdit.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://127.0.0.1:8000/users/api/${userToEdit.id}/`, userDataToUpdate, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
  
          Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
          fetchUsers(); 
          handleCloseModal(); 
        } catch (error) {
          if (error.response?.status === 401) {
            await refreshAccessToken();
            handleUpdateUser(); 
          } else {
            Swal.fire("Error", "No se pudo actualizar el usuario", "error");
          }
        }
      }
    });
  };
  


  const refreshAccessToken = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/refresh/", {
        refresh: refreshToken,
      });

      localStorage.setItem("accessToken", response.data.access);
    } catch (error) {
      console.error("Error al refrescar token:", error);
      Swal.fire("Sesión Expirada", "Debes iniciar sesión nuevamente", "error");
    }
  };

  return (
    <div>
      <h3>Tabla de usuarios</h3>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        pointerOnHover
      />
      <Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Editar Usuario</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleFormChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          disabled
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Matricula</Form.Label>
        <Form.Control
          type="text"
          name="control_number"
          value={formData.control_number}
          onChange={handleFormChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Edad</Form.Label>
        <Form.Control
          type="number"
          name="age"
          value={formData.age}
          onChange={handleFormChange}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="text"
          name="tel"
          value={formData.tel}
          onChange={handleFormChange}
        />
      </Form.Group>
      {/* Campo para la contraseña */}
      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password1"
          value={formData.password1}
          onChange={handleFormChange}
        />
        <Form.Text className="text-muted">
          Al menos un número, una mayúscula y un carácter especial.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Repite Contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password2"
          value={formData.password2}
          onChange={handleFormChange}
        />
        <Form.Text className="text-muted">
          Confirma tu contraseña.
        </Form.Text>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={handleUpdateUser}>
      Actualizar
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default UserDataTable;
