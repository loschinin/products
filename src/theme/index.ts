import { createTheme } from "@mui/material/styles";

// Расширяем типы для TypeScript
declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#242EDB",
    },
    secondary: {
      main: "#dc004e",
    },
    neutral: {
      main: "#505060",
      light: "#DFDFDF",
      dark: "#3a3a47",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
        },
      },
      variants: [
        {
          props: { variant: "outlined", color: "neutral" },
          style: {
            borderColor: "#DFDFDF",
            color: "#505060",
            "&:hover": {
              borderColor: "#BFBFBF",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          },
        },
        {
          props: { variant: "contained", color: "neutral" },
          style: {
            backgroundColor: "#505060",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#3a3a47",
            },
          },
        },
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
      defaultProps: {
        size: "small",
      },
    },
  },
});
