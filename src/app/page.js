'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddItem = async () => {
    if (newItem.trim() === '') return;

    const newTodo = {
      title: newItem,
      completed: false,
    };

    try {
      const res = await axios.post('/api/todos', newTodo);
      setItems([...items, res.data]);
      setNewItem('');
    } catch (error) {
      console.error('Error al agregar el item', error);
    }
  };

  const getTodos = async () => {
    try {
      const res = await axios.get('/api/todos');
      setItems(res.data);
    } catch (error) {
      console.error('Error al obtener los datos', error);
    }
  };

  const toggleTodo = async (index) => {
    const updatedTodo = items[index];

    const updatedItem = {
      ...updatedTodo,
      completed: !updatedTodo.completed,
    };

    try {
      await axios.patch(`/api/todos/${updatedTodo._id}`, updatedItem);

      const updatedItems = items.map((item, i) =>
        i === index ? updatedItem : item
      );
      setItems(updatedItems);
    } catch (error) {
      console.error('Error al actualizar el item', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error al eliminar el item', error);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingValue(items[index].title);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const saveEdit = async (index) => {
    const updatedTodo = {
      ...items[index],
      title: editingValue,
    };

    try {
      await axios.patch(`/api/todos/${updatedTodo._id}`, updatedTodo);

      const updatedItems = items.map((item, i) =>
        i === index ? updatedTodo : item
      );
      setItems(updatedItems);

      cancelEditing();
    } catch (error) {
      console.error('Error al guardar los cambios', error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Lista de cosas por hacer 💕
      </h1>

      <div className="mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Agregá una nueva tarea"
          className="w-full p-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agregar tarea
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((todo, index) => (
          <li
            key={todo._id}
            className="flex justify-between items-center p-2 border border-gray-300 rounded"
          >
            {editingIndex === index ? (
              <input
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                className="flex-grow p-2 border rounded text-black"
              />
            ) : (
              <span
                className={`text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}
              >
                <button
                    onClick={() => toggleTodo(index)}
                    className={`px-4 py-2 rounded`}
                  >
                    {todo.completed ? '✅' : '🫵'}
                  </button>
                {todo.title}
              </span>
            )}

            <div className="flex space-x-2">
              {editingIndex === index ? (
                <>
                  <button
                    onClick={() => saveEdit(index)}
                    className="text-white px-2 py-2"
                  >
                    ✔️
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-white py-2"
                  >
                    ❌
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(index)}
                    className="text-white px-4 py-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-white py-2"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
