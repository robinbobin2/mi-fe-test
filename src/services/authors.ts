import { Author } from '../common/interfaces';

const API_URL = process.env.REACT_APP_API || 'http://localhost:3001';

export const getAuthors = async (): Promise<Author[]> => {
  try {
    const response = await fetch(`${API_URL}/authors`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
};

export const updateAuthor = async (author: Author): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/authors/${author.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating author:', error);
  }
};
