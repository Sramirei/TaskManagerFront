import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import "./style.css";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const TaskDetail = ({ id, isOpen, onClose }) => {
  const [task, setTask] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });

  const getTask = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/task/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 1) {
        const fetchedTask = response.data.data;
        setTask(fetchedTask);
        reset({
          title: fetchedTask.title || "",
          description: fetchedTask.description || "",
        }); // Carga los valores en el formulario
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const onSubmit = async (data) => {
    const body = { title: data.title, description: data.description };
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/task/edit/${id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 1) {
        Swal.fire({
          title: "Exitoso",
          text: "Task Editada Correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        });
        reset({});
        onClose();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Error inesperado Intentalo de nuevo",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const deletedTask = async () => {
    Swal.fire({
      title: "Seguro quieres eliminar esta Task?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/task/deleted/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.code === 1) {
          onClose();
          Swal.fire("Eliminada!", "", "success");
        }
      } else if (result.isDenied) {
        Swal.fire("No se hicieron cambios", "", "info");
      }
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "finished":
        return "text-green-600";
      case "created":
        return "text-blue-600";
      case "progress":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "finished":
        return "Terminada";
      case "created":
        return "Creada";
      case "progress":
        return "En proceso";
      default:
        return "Estado no disponible";
    }
  };

  useEffect(() => {
    if (id) {
      getTask(id);
    }
  }, [id]);

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-full max-w-2xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-6 py-5 sm:p-8">
                <DialogTitle
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900"
                >
                  Editar Tarjeta
                </DialogTitle>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-5 space-y-4"
                >
                  {/* Título */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Título
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      defaultValue={task?.title}
                      {...register("title", {
                        required: "El título es obligatorio",
                      })}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.title ? "border-red-500" : ""
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      defaultValue={task?.description}
                      {...register("description")}
                      rows="4"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Escribe la descripción aquí (opcional)..."
                    ></textarea>
                  </div>

                  {/* Estado */}
                  <div>
                    <label
                      htmlFor="status"
                      className={`block text-sm font-medium ${getStatusClass(
                        task?.state
                      )}`}
                    >
                      {getStatusText(task?.state)}
                    </label>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={deletedTask}
                      className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500"
                    >
                      Eliminar Task
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
                    >
                      Editar Task
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TaskDetail;
