import React, { useState ,useEffect } from "react";
import "./App.css";

function TaskBoard() {
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskColumn, setNewTaskColumn] = useState("todo");
    const Columns = ["todo", "inprogress", "done"];

    const defaultTasks = [
        { id: 1, text: "Task 1", status: "todo" },
        { id: 2, text: "Task 2", status: "inprogress" },
        { id: 3, text: "Task 3", status: "done" },
        { id: 4, text: "Task 4", status: "todo" }
    ];

    const getSavedTasks = () => {
        const savedTasks = localStorage.getItem("tasks");
        return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
    };

    const [tasks, setTasks] = useState(getSavedTasks);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const allowDrop = (e) => e.preventDefault();

    const onDragStart = (e, id) => {
        e.dataTransfer.setData("taskId", id);
    };

    const onDrop = (e, targetTaskId, targetColumn) => {
        const draggedTaskId = parseInt(e.dataTransfer.getData("taskId"));

        if (draggedTaskId === targetTaskId) return;

        setTasks((prevTasks) => {
            const draggedTaskIndex = prevTasks.findIndex(task => task.id === draggedTaskId);
            const targetTaskIndex = prevTasks.findIndex(task => task.id === targetTaskId);
            const draggedTask = prevTasks[draggedTaskIndex];

            let updatedTasks = [...prevTasks];

            if (targetTaskId !== null) {
                if (draggedTask.status === updatedTasks[targetTaskIndex].status) {
                    [updatedTasks[draggedTaskIndex], updatedTasks[targetTaskIndex]] =
                        [updatedTasks[targetTaskIndex], updatedTasks[draggedTaskIndex]];
                } else {
                    updatedTasks[draggedTaskIndex] = { ...draggedTask, status: targetColumn };
                }
            } else {
                updatedTasks[draggedTaskIndex] = { ...draggedTask, status: targetColumn };
            }

            return updatedTasks;
        });
    };

    const addNewTask = () => {
        if (newTaskText.trim() === "") return;

        const newTask = {
            id: tasks.length + 1,
            text: newTaskText,
            status: newTaskColumn
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setNewTaskText("");
    };

    return (
        <>
            <h1 className="center">TaskBoard</h1>
            <div className="form-group">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Enter new task"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                />
                <select
                    className="select-field"
                    value={newTaskColumn}
                    onChange={(e) => setNewTaskColumn(e.target.value)}
                >
                    {Columns.map((column) => (
                        <option key={column} value={column}>
                            {column.charAt(0).toUpperCase() + column.slice(1)}
                        </option>
                    ))}
                </select>
                <button onClick={addNewTask} className="button">
                    Add Task
                </button>
            </div>
            <div className="kanban-board">
                {Columns.map((column, index) => (
                    <div
                        key={index}
                        className="kanban-column"
                        onDragOver={allowDrop}
                        onDrop={(e) => onDrop(e, null, column)}
                    >
                        <h2>{column.toUpperCase()}</h2>
                        {tasks
                            .filter((task) => task.status === column)
                            .map((task) => (
                                <div
                                    key={task.id}
                                    className="task-card"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, task.id)}
                                    onDragOver={allowDrop}
                                    onDrop={(e) => onDrop(e, task.id, column)}
                                >
                                    {task.text}
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </>
    );
}

export default TaskBoard;
