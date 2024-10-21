export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  catIds: number[];
  name: string;
  releaseDate: string;
  formats: {
    [key: string]: {
      res: string;
      size: number;
    };
  };
}

export interface Author {
  id: number;
  name: string;
  videos: Video[];
}

export interface ProcessedVideo {
  id: number;
  name: string;
  author: string;
  categories: string[];
  releaseDate: string;
  formats: {
    id: string;
    resolution: string;
    size: number;
  }[];
}

export interface NewVideo {
  name: string;
  authorId: string;
  catIds: number[];
  formats: {
    [key: string]: { res: string; size: number };
  };
  releaseDate: string;
}
