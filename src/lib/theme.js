import { createTheme, responsiveFontSizes } from "@material-ui/core/styles";
import "@fontsource/karla";

const theme = responsiveFontSizes(
  createTheme({
    typography: {
      fontFamily: ["Karla"].join(","),
    },
    palette: {
      primary: {
        main: "#27AAE1",
        dark: "057CAE",
        contrastText: "#fff",
      },
      secondary: {
        main: "#fff",
        contrastText: "#25AAE2",
      },
    },
  })
);

theme.typography.body1 = {
  fontSize: "1rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
};

theme.typography.subtitle1 = {
  fontSize: "1rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
};

theme.typography.h6 = {
  fontSize: "0.8rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.6rem",
  },
};

theme.typography.h5 = {
  fontSize: "1.3118rem",
  fontWeight: 400,
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8rem",
  },
  "@media (max-width: 374px)": {
    fontSize: "0.8rem",
  },
};

theme.typography.h4 = {
  fontSize: "1.8219rem",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.2rem",
  },
};

export default theme;
