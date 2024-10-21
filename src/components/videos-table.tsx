import type { ProcessedVideo } from '../common/interfaces';
import { Button } from './button';
import { EditVideoModal } from './edit-video-modal';
import styles from './videos-table.module.css';
import { useState } from 'react';

type VideosTableProps = {
  videos: ProcessedVideo[];
  deleteVideo: (videoId: number) => void;
  updateVideo: (videoId: number, updatedVideo: Partial<ProcessedVideo>) => void;
};

export const VideosTable = ({ videos, deleteVideo, updateVideo }: VideosTableProps) => {
  const [editingVideo, setEditingVideo] = useState<ProcessedVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleEditClick = (video: ProcessedVideo) => {
    setEditingVideo(video);
  };

  const handleCloseModal = () => {
    setEditingVideo(null);
  };

  const filteredVideos = videos.filter((video) => {
    const query = searchQuery.toLowerCase();
    const name = video.name.toLowerCase();
    const author = video.author.toLowerCase();
    const categories = video.categories.map(cat => cat.toLowerCase());
    
    return name.includes(query) || author.includes(query) || categories.some(cat => cat.includes(query));
  });

  const getHighestQualityFormat = (formats: ProcessedVideo['formats']) => {
    let highestQuality = formats[0];

    for (const format of formats) {
      const currentRes = parseInt(format.resolution);
      const highestRes = parseInt(highestQuality.resolution);

      if (currentRes > highestRes || (currentRes === highestRes && format.size > highestQuality.size)) {
        highestQuality = format;
      }
    }

    return highestQuality;
  };

  const editVideo = editingVideo && (
    <EditVideoModal
      video={editingVideo}
      onClose={handleCloseModal}
      onUpdate={(updatedVideo: Partial<ProcessedVideo>) => {
        updateVideo(editingVideo.id, updatedVideo);
        handleCloseModal();
      }}
    />
  );

  return (
    <div className={styles.wrapper}>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, author or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Video Name</th>
            <th>Author</th>
            <th>Categories</th>
            <th>Release Date</th>
            <th>Highest Quality</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {filteredVideos.map((video) => {
            const highestQuality = getHighestQualityFormat(video.formats);
            return (
              <tr key={video.id}>
                <td>{video.name}</td>
                <td>{video.author}</td>
                <td>{video.categories.join(', ')}</td>
                <td>{`${highestQuality.id} ${highestQuality.resolution}`}</td>
                <td>{new Date(video.releaseDate).toLocaleDateString()}</td>
                <td>
                  <Button neutral classes='mr-2 btn-sm' onClick={() => handleEditClick(video)}>
                    Edit
                  </Button>
                  <Button danger classes='mr-2 btn-sm' onClick={() => deleteVideo(video.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {editVideo}
    </div>
  );
};
