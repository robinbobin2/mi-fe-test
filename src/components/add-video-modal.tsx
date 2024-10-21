import { useState, useEffect } from 'react';
import { Button } from './button';
import { getAuthors } from '../services/authors';
import { getCategories } from '../services/categories';
import { Author, Category } from '../common/interfaces';

type AddVideoModalProps = {
  onModalClose: () => void;
  handleAddVideo: (newVideo: any) => void;
};

export const AddVideoModal = ({ onModalClose, handleAddVideo }: AddVideoModalProps) => {
  const [newVideo, setNewVideo] = useState({
    name: '',
    authorId: '',
    catIds: [] as number[],
    formats: {
      one: {
        res: '1080p',
        size: 1000
      }
    },
    releaseDate: new Date().toISOString().split('T')[0]
  });
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
    // console.log("name", name);
    // console.log("value", value);
    setNewVideo(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedOptions = [] as number[];
    for (let i = 0; i < e.target.selectedOptions.length; i++) {
      selectedOptions.push(parseInt(e.target.selectedOptions[i].value));
    }
    setNewVideo(function(prev) {
      return {
        ...prev,
        catIds: selectedOptions
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("newVideo", newVideo);
    handleAddVideo(newVideo);
  };

  return (
    <div className="modal modal-open">

      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Video</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Video Name</span>
            </label>

            <input
              type="text"
              name="name"
              value={newVideo.name}
              onChange={handleInputChange}
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">

              <span className="label-text">Video author</span>
            </label>
            <select
              name="authorId"
              value={newVideo.authorId}
              onChange={handleInputChange}
              className="select select-bordered"
              required
            >

              <option value="">Select</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">

            <label className="label">
              <span className="label-text">Video categories</span>
            </label>

            <select
              multiple
              name="catIds"
              value={newVideo.catIds.join(',')}
              onChange={handleCategoryChange}
              className="select select-bordered"
              required
            >

              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}

            </select>
          </div>
          <div className="modal-action">
            <Button type="submit" primary>Submit</Button>
            <Button onClick={onModalClose} secondary>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
