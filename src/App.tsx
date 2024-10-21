import { useEffect, useState } from 'react';

import type { NewVideo, ProcessedVideo } from './common/interfaces';
import { getVideos, deleteVideo, updateVideo, createVideo } from './services/videos';
import { VideosTable } from './components/videos-table';
import { Button } from './components/button';
import { AddVideoModal } from './components/add-video-modal';
import styles from './app.module.css';

export const App = () => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    getVideos().then((videos) => {
      console.log("videos", videos);
      setVideos(videos);
    });
  }, []);

  const handleDeleteVideo = (videoId: number) => {
    deleteVideo(videoId).then(() => {
      setVideos(videos.filter((video) => video.id !== videoId));
    });
  };

  const handleUpdateVideo = (videoId: number, updatedVideo: Partial<ProcessedVideo>) => {
    updateVideo(videoId, updatedVideo).then((updated) => {
      if (updated) {
        const newVideos = [...videos];
        for (let i = 0; i < newVideos.length; i++) {
          if (newVideos[i].id === videoId) {
            newVideos[i] = { ...newVideos[i], ...updatedVideo };
          }
        }
        setVideos(newVideos);
      }
    });
  };

  const handleAddVideo = (newVideo: NewVideo) => {
    createVideo(newVideo).then((createdVideo) => {
      if (createdVideo) {
        setVideos([...videos, createdVideo]);
        setIsAddModalOpen(false);
      }
    });
  };

  return (
    <>
      <header className={styles.header}>
        Videos
        <Button primary onClick={() => setIsAddModalOpen(true)}>Add video</Button>
      </header>

      <main className={styles.main}>
        <h1>VManager Demo v0.0.1</h1>
        <VideosTable videos={videos} deleteVideo={handleDeleteVideo} updateVideo={handleUpdateVideo} />
      </main>

      <footer className={styles.footer}>VManager Demo v0.0.1</footer>

      {isAddModalOpen && (
        <AddVideoModal
          onModalClose={() => setIsAddModalOpen(false)}
          handleAddVideo={handleAddVideo}
        />
      )}
    </>
  );
};
