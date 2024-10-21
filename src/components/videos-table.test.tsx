import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { VideosTable } from './videos-table';
import { ProcessedVideo } from '../common/interfaces';
import { deleteVideo, updateVideo } from '../services/videos';

const mockVideos: ProcessedVideo[] = [
  {
    id: 1,
    name: 'Test Video',
    author: 'Test Author',
    categories: ['Test Category'],
    releaseDate: '2024-10-21',
    formats: [
      { id: '1', resolution: '1080p', size: 1000 },
    ],
  },
];

const mockDeleteVideo = deleteVideo;
const mockUpdateVideo = updateVideo;

describe('VideosTable', () => {

  it('renders video data correctly', () => {
    render(<VideosTable videos={mockVideos} deleteVideo={mockDeleteVideo} updateVideo={mockUpdateVideo} />);
    
    expect(screen.getByText('Test Video')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('10/21/2024')).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    render(<VideosTable videos={mockVideos} deleteVideo={mockDeleteVideo} updateVideo={mockUpdateVideo} />);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  it('opens edit modal when edit button is clicked', () => {
    render(<VideosTable videos={mockVideos} deleteVideo={mockDeleteVideo} updateVideo={mockUpdateVideo} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(screen.getByText('Edit Video')).toBeInTheDocument();
  });
  
});
