import { getCategories } from './categories';
import { getAuthors, updateAuthor } from './authors';
import { NewVideo, ProcessedVideo } from '../common/interfaces';

const API_URL = process.env.REACT_APP_API || 'http://localhost:3001';

export const getVideos = async (): Promise<ProcessedVideo[]> => {
  const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);

  const processedVideos: ProcessedVideo[] = [];
  for (const author of authors) {
    for (const video of author.videos) {
      processedVideos.push({
        id: video.id,
        name: video.name,
        author: author.name,
        categories: video.catIds.map((catId) => {
          const category = categories.find((cat) => cat.id === catId);
          return category?.name || 'No category';
        }),
        releaseDate: video.releaseDate,
        formats: Object.entries(video.formats).map(([key, value]) => ({
          id: key,
          resolution: value.res,
          size: value.size,
        })),
      });
    }
  }

  return processedVideos;
};

export const deleteVideo = async (videoId: number): Promise<boolean> => {
  try {
    const authors = await getAuthors();
    const authorWithVideo = authors.find((author) => author.videos.some((video) => video.id === videoId));

    if (!authorWithVideo) {
      console.error('Video not found');
      return false;
    }

    const updatedVideos = authorWithVideo.videos.filter((video) => video.id !== videoId);
    const updatedAuthor = { ...authorWithVideo, videos: updatedVideos };

    const response = await fetch(`${API_URL}/authors/${authorWithVideo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedAuthor),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
};

export const createVideo = async (newVideo: NewVideo): Promise<ProcessedVideo | null> => {
  const authors = await getAuthors();
  const author = authors.find((a) => a.id === parseInt(newVideo.authorId));
  // debugger;
  if (!author) {
    console.error('Author not found');
    return null;
  }

  const videoId = Math.max(...authors.flatMap((a) => a.videos.map((v) => v.id))) + 1;
  const videoToAdd = {
    id: videoId,
    ...newVideo,
  };

  const updatedVideos = [...author.videos, videoToAdd];
  const updatedAuthor = { ...author, videos: updatedVideos };

  const response = await fetch(`${API_URL}/authors/${author.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAuthor),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const categories = await getCategories();
  return {
    id: videoId,
    name: newVideo.name,
    author: author.name,
    categories: newVideo.catIds.map((catId) => categories.find((c) => c.id === catId)?.name || 'Unknown'),
    releaseDate: newVideo.releaseDate,
    formats: Object.entries(newVideo.formats).map(([key, value]) => ({
      id: key,
      resolution: value.res,
      size: value.size,
    })),
  };
};

export const updateVideo = async (videoId: number, updatedVideo: Partial<ProcessedVideo>): Promise<boolean> => {
  try {
    const authors = await getAuthors();
    const categories = await getCategories();

    // debugger;
    let authorFound = null;
    let videoFound = null;
    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];
      for (let j = 0; j < author.videos.length; j++) {
        if (author.videos[j].id === videoId) {
          authorFound = author;
          videoFound = author.videos[j];
          break;
        }
      }
      if (authorFound) {
        break;
      }
    }

    if (!authorFound || !videoFound) {
      console.log("Couldn't find the video");
      return false;
    }

    let authorIndex = -1;
    for (let i = 0; i < authors.length; i++) {
      if (authors[i] === authorFound) {
        authorIndex = i;
        break;
      }
    }

    let videoIndex = -1;
    for (let i = 0; i < authorFound.videos.length; i++) {
      if (authorFound.videos[i] === videoFound) {
        videoIndex = i;
        break;
      }
    }

    // debugger;
    const updatedVideoData = {
      ...authors[authorIndex].videos[videoIndex],
      name: updatedVideo.name || authors[authorIndex].videos[videoIndex].name,
    };

    if (updatedVideo.categories) {
      updatedVideoData.catIds = [];
      for (let cat of updatedVideo.categories) {
        let catId = categories.find((c) => c.name === cat)?.id;
        if (catId) {
          updatedVideoData.catIds.push(catId);
        }
      }
    }

    // debugger;
    if (updatedVideo.author && updatedVideo.author !== authors[authorIndex].name) {
      const newAuthorIndex = authors.findIndex((author) => author.name === updatedVideo.author);
      if (newAuthorIndex === -1) {
        throw new Error('New author not found');
      }

      authors[authorIndex].videos = authors[authorIndex].videos.filter((v) => v.id !== videoId);

      authors[newAuthorIndex].videos.push(updatedVideoData);

      await updateAuthor(authors[authorIndex]);
      await updateAuthor(authors[newAuthorIndex]);
    } else {
      authors[authorIndex].videos[videoIndex] = updatedVideoData;
      await updateAuthor(authors[authorIndex]);
    }

    return true;
  } catch (error) {
    console.error('Error updating video:', error);
    return false;
  }
};
