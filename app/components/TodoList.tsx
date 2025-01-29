"use client";

import { useState } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState<{ text: string; completed: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const addTodo = () => {
    if (input.trim() !== "") {
      setTodos([...todos, { text: input, completed: false }]);
      setInput("");
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const toggleCompletion = (index: number) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditText(todos[index].text);
  };

  const saveEdit = () => {
    if (editIndex !== null && editText.trim() !== "") {
      const updatedTodos = [...todos];
      updatedTodos[editIndex].text = editText;
      setTodos(updatedTodos);
      setEditIndex(null);
      setEditText("");
    }
  };

  return (
    <div className="fixed right-4 bottom-4 w-80 bg-white p-4 rounded-lg shadow-lg z-50">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">To-Do List</h2>

      {/* Input and Add Task */}
      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded-l px-4 py-2 w-full"
          placeholder="Enter a new task"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {todos.map((todo, index) => (
          <li key={index} className="flex items-center justify-between space-x-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleCompletion(index)}
              className="cursor-pointer"
            />
            {editIndex === index ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="border px-2 py-1 w-full"
              />
            ) : (
              <span
                className={`flex-1 ${todo.completed ? "line-through text-gray-500" : ""}`}
              >
                {todo.text}
              </span>
            )}

            <div className="flex space-x-2">
              {editIndex === index ? (
                <button onClick={saveEdit} className="text-green-500">
                  Save
                </button>
              ) : (
                <button onClick={() => startEdit(index)} className="text-blue-500">
                  Edit
                </button>
              )}
              <button
                onClick={() => removeTodo(index)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
