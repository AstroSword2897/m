declare module '@mui/material/Select' {
  export interface SelectChangeEvent<T = unknown> {
    target: {
      value: T;
      name?: string;
    };
  }
}

declare module '@mui/material/*';
declare module '@mui/icons-material/*'; 