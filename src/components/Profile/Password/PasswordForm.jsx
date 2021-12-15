import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useTranslation } from "react-i18next";

PasswordForm.propTypes = {
  modifyEditingStatus: PropTypes.func.isRequired,
};

const useStyles = makeStyles(() => ({
  root: {
    color: "#25AAE2",
  },
  textSeparation: {
    margin: "0 1rem 1rem 0",
  },
}));

export default function PasswordForm(props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [rePassword, setRePassword] = React.useState("");
  const [verifyPassword, setVerifyPassword] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [t, i18n] = useTranslation(["profile"]); 

  const classes = useStyles();

  const handleChangePass = () => {
    setShowPassword(!showPassword);
  };
  const handleSave = () => {
    if (!password || !rePassword) {
      setError(true);
    } else {
      if (password !== rePassword) {
        setError(true);
        setVerifyPassword(true);
      } else {
        props.modifyEditingStatus();
      }
    }
  };
  return (
    <Box
      display="flex"
      my={2}
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="baseline"
        justifyContent="center"
      >
        <Typography
          variant="body1"
          color="textPrimary"
          className={classes.textSeparation}
        >
          {t("currentPassword")}
        </Typography>
        <FormControl>
          <OutlinedInput
            className={classes.root}
            id="current-password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="dense"
            name="currentPassword"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleChangePass}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="current-password" className={classes.root}>
            {t("forgotPassword")}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <Box
          display="flex"
          flexDirection="row"
          alignItems="baseline"
          justifyContent="center"
        >
          <Typography
            variant="body1"
            color="textPrimary"
            className={classes.textSeparation}
          >
            {t("newPassword")}
          </Typography>
          <FormControl>
            <OutlinedInput
              error={error}
              required
              className={classes.root}
              id="current-password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="dense"
              name="newPassword"
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleChangePass}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="baseline">
          <Typography
            variant="body1"
            color="textPrimary"
            className={classes.textSeparation}
          >
            {t("verifyPassword")}
          </Typography>
          <FormControl>
            <OutlinedInput
              error={error}
              required
              className={classes.root}
              id="current-password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="dense"
              name="verifyPassword"
              onChange={(e) => setRePassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleChangePass}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        {verifyPassword ? (
          <Box color="red">
            <Typography>{t("doNotMatch")}</Typography>
          </Box>
        ) : null}
      </Box>
      <Box display="flex" flexDirection="column">
        <Button
          type="submit"
          color="primary"
          variant="contained"
          disableElevation
          onClick={handleSave}
        >
          {t("changePassword")}
        </Button>
      </Box>
    </Box>
  );
}
