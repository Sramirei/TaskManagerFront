import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import UserContext from "../../Context/userContext";
import "./style.css";

const Login = ({ session }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  // React Hook Form para el login
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm({ mode: "onChange" });

  // React Hook Form para el registro
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
  } = useForm({ mode: "onChange" });

  // Función para cambiar entre los formularios
  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  // Función para manejar el envío del formulario de login
  const onLoginSubmit = async (data) => {
    const body = { userName: data.username, password: data.password };
    const user = await login(body);
    if (user?.success === true) {
      Swal.fire({
        title: "success!",
        text: "Sesion iniciada Correctamente",
        icon: "success",
        confirmButtonText: "Ok",
      });
      navigate("/home", { replace: true });
    } else {
      Swal.fire({
        title: "Revise sus credenciales...",
        text: "El usuario o contraseña puede ser incorrecto.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  // Función para manejar el envío del formulario de registro
  const onRegisterSubmit = async (data) => {
    const body = { userName: data.username, password: data.password };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/create`,
        body
      );

      if (response.data.code === 1) {
        const user = await login(body);
        if (user?.success === true) {
          Swal.fire({
            title: "success!",
            text: "Usuario creado correctamente",
            icon: "success",
            confirmButtonText: "Ok",
          });
          navigate("/home", { replace: true });
        }
      }
    } catch (error) {
      console.log("Error during registration:", error);
      Swal.fire({
        title: "error!",
        text: "Hubo un error Intentalo mas tarde",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  if (session) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <div className="login-page">
        <div className="form">
          {/* Formulario de registro */}
          <form
            className={`register-form ${isRegistering ? "show" : "hiden"}`}
            onSubmit={handleSubmitRegister(onRegisterSubmit)}
          >
            <h1>Registro</h1>
            <input
              type="text"
              name="username"
              placeholder="username"
              {...registerRegister("username", {
                required: "Username is required",
              })}
            />
            {errorsRegister.username && (
              <span>{errorsRegister.username.message}</span>
            )}

            <input
              type="password"
              name="password"
              placeholder="password"
              {...registerRegister("password", {
                required: "Password is required",
                pattern: {
                  value: /^.{8,32}$/,
                  message: "La contraseña debe tener entre 8 y 32 caracteres.",
                },
              })}
            />
            {errorsRegister.password && (
              <span>{errorsRegister.password.message}</span>
            )}

            <button type="submit">Create</button>
            <p className="message">
              <a href="#" onClick={toggleForm}>
                Login
              </a>
            </p>
          </form>

          {/* Formulario de inicio de sesión */}
          <form
            className={`login-form ${!isRegistering ? "show" : "hiden"}`}
            onSubmit={handleSubmitLogin(onLoginSubmit)}
          >
            <h1>Login</h1>
            <input
              type="text"
              placeholder="username"
              {...registerLogin("username", {
                required: "Username is required",
              })}
            />
            {errorsLogin.username && (
              <span>{errorsLogin.username.message}</span>
            )}

            <input
              type="password"
              placeholder="password"
              {...registerLogin("password", {
                required: "Password is required",
                pattern: {
                  value: /^.{8,32}$/,
                  message: "La contraseña debe tener entre 8 y 32 caracteres.",
                },
              })}
            />
            {errorsLogin.password && (
              <span>{errorsLogin.password.message}</span>
            )}

            <button type="submit">Login</button>
            <p className="message">
              <a href="#" onClick={toggleForm}>
                Crear Cuenta
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
