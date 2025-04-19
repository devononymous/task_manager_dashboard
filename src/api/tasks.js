import axios from 'axios';


const API_URL = 'https://cac3aea190eb92b7c67e.free.beeceptor.com/api/users/0://api.example.com/tasks'; // Replace with your actual API URL


export const fetchTasks = async () => {
        const response = await axios.get(API_URL);
        return response.data;   
}

export const createTask = async (task) => {
        const response = await axios.post(API_URL, task);
        return response.data;
}
export const updateTask = async (taskId, updatedTask) => {
        const response = await axios.put(`${API_URL}/${taskId}`, updatedTask);
        return response.data;
}

export const deleteTask = async (taskId) => {
        const response = await axios.delete(`${API_URL}/${taskId}`);
        return response.data;
}
export const completeTask = async (taskId) => {
        const response = await axios.patch(`${API_URL}/${taskId}`, { completed: true });
        return response.data;
}