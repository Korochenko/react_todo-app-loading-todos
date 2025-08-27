const API_URL = 'https://mate-academy.github.io/fe-students-api/todos';

export const loadTodos = async (userId: number) => {
    const response = await fetch(`${API_URL}?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to load todos');
    }
    return await response.json();
};