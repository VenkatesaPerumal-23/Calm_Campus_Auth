declare namespace Express {
  export interface Request {
    user?: {
      user_id?: string | number;
      [key: string]: any;
    };
  }
}
