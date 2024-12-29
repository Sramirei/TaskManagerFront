import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import TaskDetail from "../../Components/TaskDetail/TaskDetail";
import CreateTask from "../../Components/CreateTaskt/CreateTask";
import "./style.css";

const Home = ({ session }) => {
  const [tasks, setTasks] = useState({
    Creada: [],
    Proceso: [],
    done: [],
  });
  const [history, setHistory] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getTaskAdmin = async () => {
    try {
      const userId = session?.user?.id || session?.id;

      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario.");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/task/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 1) {
        const organizedTasks = {
          Creada: [],
          Proceso: [],
          done: [],
        };

        response.data.data.forEach((task) => {
          const taskObj = {
            id: task.id,
            title: task.title,
            description: task.description,
            author: task.author.userName,
          };

          if (task.state === "created") {
            organizedTasks.Creada.push(taskObj);
          } else if (task.state === "progress") {
            organizedTasks.Proceso.push(taskObj);
          } else if (task.state === "finished") {
            organizedTasks.done.push(taskObj);
          }
        });

        setTasks(organizedTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const getTask = async () => {
    try {
      const userId = session?.user?.id || session?.id;

      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario.");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/task/forUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 1) {
        const organizedTasks = {
          Creada: [],
          Proceso: [],
          done: [],
        };

        // Organizar tareas según el estado
        response.data.data.forEach((task) => {
          const taskObj = {
            id: task.id,
            title: task.title,
            description: task.description,
            author: task.author.userName,
          };

          if (task.state === "created") {
            organizedTasks.Creada.push(taskObj);
          } else if (task.state === "progress") {
            organizedTasks.Proceso.push(taskObj);
          } else if (task.state === "finished") {
            organizedTasks.done.push(taskObj);
          }
        });

        setTasks(organizedTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const getHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.code === 1) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session?.user?.admin === true || session?.admin === true) {
      getTaskAdmin();
      getHistory();
    } else {
      getTask();
    }
  }, []);

  const handleDragStart = (e, taskId, column) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("fromColumn", column);
  };

  const handleDrop = async (e, toColumn) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");
    const fromColumn = e.dataTransfer.getData("fromColumn");

    if (fromColumn === toColumn) return; // No hacer nada si no se mueve de columna

    // Definir las transiciones válidas
    const validTransitions = {
      Creada: "Proceso",
      Proceso: "done",
    };

    if (validTransitions[fromColumn] !== toColumn) {
      console.error("Movimiento no permitido.");
      Swal.fire({
        title: "Cuidado!",
        text: "Movimiento no permitido.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    // Definir el body según la transición
    const updateBody =
      toColumn === "Proceso"
        ? { state: "progress", completed: false }
        : { state: "finished", completed: true };

    try {
      // Realizar la solicitud de actualización
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/task/edit/${taskId}`,
        updateBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 1) {
        console.log("Task updated successfully:", response.data.message);

        // Actualizar el estado local después de una respuesta exitosa
        setTasks((prevTasks) => {
          const task = prevTasks[fromColumn].find((t) => t.id === taskId);
          return {
            ...prevTasks,
            [fromColumn]: prevTasks[fromColumn].filter((t) => t.id !== taskId),
            [toColumn]: [...prevTasks[toColumn], task],
          };
        });
      } else {
        console.error("Error updating task:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript son de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const closeModal = () => {
    setIsOpen(false);
    if (session?.user?.admin === true || session?.admin === true) {
      getTaskAdmin();
      getHistory();
    } else {
      getTask();
    }
  };

  const openCreateModal = () => setShowCreateModal(true);

  const closeCreateModal = () => {
    setShowCreateModal(false);
    if (session?.user?.admin === true || session?.admin === true) {
      getTaskAdmin();
      getHistory();
    } else {
      getTask();
    }
  };

  const handleTaskClick = (id) => {
    setSelectedTaskId(id); // Establecer el ID de la tarea seleccionada
    setIsOpen(true); // Abrir el modal
  };

  return (
    <div className="app">
      <main className="project">
        <div className="project-info">
          <h1>Tareas</h1>
          <div className="project-participants">
            <button
              className="project-participants__add"
              onClick={openCreateModal}
            >
              Add task
            </button>
          </div>
        </div>
        <div className="project-tasks">
          {Object.keys(tasks).map((column) => (
            <div
              className="project-column"
              key={column}
              onDrop={(e) => handleDrop(e, column)}
              onDragOver={handleDragOver}
            >
              <div className="project-column-heading">
                <h2>{column}</h2>
              </div>
              {tasks[column].map((task) => (
                <div
                  className="task"
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, column)}
                  onClick={() => handleTaskClick(task.id)}
                >
                  <p>
                    <strong>Title:</strong> {task.title}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {task.description}
                  </p>
                  <p>
                    <strong>Usuario:</strong> {task?.author}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
      {session?.user?.admin === true || session?.admin === true ? (
        <aside className="task-details">
          <div className="tag-progress">
            <h2>Tareas en Proceso</h2>

            <div className="tag-progress">
              <p>Creadas ({tasks.Creada.length})</p>
              <progress
                className="progress progress--created"
                max={
                  tasks.Creada.length + tasks.Proceso.length + tasks.done.length
                }
                value={tasks.Creada.length}
              >
                {tasks.Creada.length}
              </progress>
            </div>

            <div className="tag-progress">
              <p>Proceso ({tasks.Proceso.length})</p>
              <progress
                className="progress progress--in-progress"
                max={
                  tasks.Creada.length + tasks.Proceso.length + tasks.done.length
                }
                value={tasks.Proceso.length}
              >
                {tasks.Proceso.length}
              </progress>
            </div>

            <div className="tag-progress">
              <p>Done ({tasks.done.length})</p>
              <progress
                className="progress progress--done"
                max={
                  tasks.Creada.length + tasks.Proceso.length + tasks.done.length
                }
                value={tasks.done.length}
              >
                {tasks.done.length}
              </progress>
            </div>
          </div>

          <div className="task-activity">
            <h2>Actividades recientes</h2>
            <ul>
              {history.length > 0
                ? history.map((item, _index) => (
                    <li key={item.id}>
                      <span className="task-icon task-icon--attachment">
                        <i className="fas fa-paperclip"></i>
                      </span>
                      <b>{item.user.userName}</b> {item.action}
                      <p>{formatDate(item.createdAt)}</p>
                    </li>
                  ))
                : ""}
            </ul>
          </div>
        </aside>
      ) : null}
      <TaskDetail id={selectedTaskId} isOpen={isOpen} onClose={closeModal} />
      <CreateTask
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        userId={session?.user?.id || session?.id}
      />
    </div>
  );
};

export default Home;
