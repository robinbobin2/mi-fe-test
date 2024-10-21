import { useState, useEffect } from 'react';
import { ProcessedVideo, Category } from '../common/interfaces';
import { Button } from './button';
import { getAuthors } from '../services/authors';
import { getCategories } from '../services/categories';
import { Author } from '../common/interfaces';

type EditVideoModalProps = {
  video: ProcessedVideo;
  onClose: () => void;
  onUpdate: (updatedVideo: Partial<ProcessedVideo>) => void;
};

export const EditVideoModal = ({ video, onClose, onUpdate }: EditVideoModalProps) => {
  const [editedVideo, setEditedVideo] = useState(video);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getAuthors().then(authors => {
      setAuthors(authors);
    });

    getCategories().then(categories => {
      setCategories(categories);
    });
    
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedVideo(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setEditedVideo(prev => ({ ...prev, categories: selectedOptions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let authorId = null;
    for (let i = 0; i < authors.length; i++) {
      if (authors[i].name === editedVideo.author) {
        authorId = authors[i].id;
        break;
      }
    }
    const updatedVideo = {
      ...editedVideo,
      authorId: authorId
    };
    onUpdate(updatedVideo);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">

        <h3 className="font-bold text-lg">Edit Video</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label" htmlFor="name">
              <span className="label-text">Video Name</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={editedVideo.name}
              onChange={handleInputChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="author">
              <span className="label-text">Video author</span>
            </label>

            <select
              name="author"
              id="author"
              value={editedVideo.author}
              onChange={handleInputChange}
              className="select select-bordered"
            >
              {authors.map(author => (
                <option key={author.id} value={author.name}>
                  {author.name}
                </option>
              ))}

            </select>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="categories">
              <span className="label-text">Video categories</span>
            </label>

            <select
              multiple
              name="categories"
              id="categories"
              value={editedVideo.categories}
              onChange={handleCategoryChange}
              className="select select-bordered"
            >
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

          </div>
          <div className="modal-action">
            <Button type="submit" primary>Submit</Button>
            <Button onClick={onClose} secondary>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
