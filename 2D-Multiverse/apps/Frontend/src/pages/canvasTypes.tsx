export interface User {
    x: number;
    y: number;
    userId: string;
  }
  
  export interface Element {
    element:{
    imageUrl: string;
    };
    x: number;
    y: number;
  }
  
  export interface CanvasProps {
    currentUser: User;
    users: Map<string, User>;
    imageUrl: string;
  }