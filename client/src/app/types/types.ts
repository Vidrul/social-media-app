export interface IPayloadSignUp {
  email: string;
  password: string;
  profileImg: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface IPayloadLogin {
  email: string;
  password: string;
}

export interface ITokens {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  userId: number;
}

export interface IUserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: null;
  profilePicture: string;
  coverPicture: string;
  followers: string[];
  followings: string[];
  isAdmin: boolean;
  desc: string;
  city: string;
  from: string;
}

export interface IPost {
  id: number;
  userId: number;
  desc: string;
  img: string;
  likes: [];
  create_date: string;
}

export interface ILocationState {
  from: {
    pathname: string;
  };
}
