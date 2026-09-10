export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  playlist: string[];
}

export interface ISong {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  audio: string;
  album_id?: number;
  created_at?: string;
}

export interface IAlbum {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  created_at?: string;
}
