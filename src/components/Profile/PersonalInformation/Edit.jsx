/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import validator from "validator";
import PropTypes from "prop-types";
import { CameraAlt } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

Edit.propTypes = {
  setProfile: PropTypes.func.isRequired,
  profileInfo: PropTypes.array.isRequired,
  handleEditing: PropTypes.func.isRequired,
};

const useStyles = makeStyles({
  input: {
    display: "none",
  },
  imageOverlay: {
    // position='absolute' bottom='0' left='0' height='50%' width='100%' bgcolor='white'
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "50%",
    width: "100%",
  },
  imageOverlayBg: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: "#8ED0EE",
    opacity: 0.7,
    "&:hover": {
      opacity: 0.5,
    },
  },
  imageOverlayIcon: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function Edit({ setProfile, profileInfo, handleEditing }) {
  const classes = useStyles();
  // const [havePhoto, setPhoto] = useState(false);
  // const changePhoto = () => {
  //   setPhoto(!havePhoto);
  // };
  const [t, i18n] = useTranslation(["profile"]); 

  const [selectedFile, setSelectedFile] = useState(profileInfo.avatar_img);

  const [name, setName] = useState(profileInfo.first_name);
  const [lastName, setLastName] = useState(profileInfo.last_name);
  const [alias, setAlias] = useState(profileInfo.alias);
  const [email, setEmail] = useState(profileInfo.email);
  const [phoneNumber, setPhoneNumber] = useState(
    profileInfo.phone_number ? profileInfo.phone_number.toString() : ""
  );
  const namesValidator = (name) => {
    const isValidName = validator.isAlpha(name ? name.toString() : "");
    return isValidName;
  };
  const aliasValidator = (alias) => {
    const isValidAlias = validator.isAlphanumeric(alias ? alias : "");
    return isValidAlias;
  };
  const emailValidator = (email) => {
    const isValidEmail = validator.isEmail(email ? email : "");
    return isValidEmail;
  };
  const phoneValidator = (phone) => {
    const isValidPhone = validator.isMobilePhone(
      phone ? phone : "",
      validator.isMobilePhoneLocales
    );
    return isValidPhone;
  };
  const handleUpdate = async () => {
    const bodyInfo = {
      first_name: name,
      last_name: lastName,
      alias: alias,
      email: email,
      phone_number: phoneNumber,
      avatar_img: selectedFile,
    };
    try {
      const userId = localStorage.getItem("user_id");
      let response = await fetch(
        process.env.REACT_APP_TRADEASY_API + `users/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyInfo),
        }
      );
      setProfile(bodyInfo);
      handleEditing();
    } catch (error) {
      console.error(
        "No se ha podido actualizar tu informacion(cliente). Error: " + error
      );
    }
  };

  const onFileChange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result.length > 60000) {
        setSelectedFile(null);
        alert("File Size is Too Big!");
      } else {
        setSelectedFile(reader.result);
      }
    };
    reader.readAsDataURL(file);
    // setSelectedFile(e.target.files[0]);
  };

  const [errors, setErrors] = useState(true);
  useEffect(() => {
    if (
      namesValidator(name) &&
      namesValidator(lastName) &&
      aliasValidator(alias) &&
      emailValidator(email) &&
      phoneValidator(phoneNumber)
    ) {
      setErrors(false);
    } else {
      setErrors(true);
    }
  });

  return (
    <Box width="100%" mt="10px">
      <Grid>
        <Grid container spacing={0} alignItems="flex-start">
          <Grid item md={3}>
            <Box display="flex" mt="10px">
              <Box
                width="180px"
                height="180px"
                p="5px"
                mr="20px"
                bgcolor=" #E6AA17"
                borderRadius="10px"
                position="relative"
              >
                {selectedFile ? (
                  <Avatar
                    variant="square"
                    style={{
                      width: "170px",
                      height: "170px",
                      borderRadius: 10,
                    }}
                    src={selectedFile}
                  />
                ) : (
                  <Avatar
                    variant="square"
                    style={{
                      width: "170px",
                      height: "170px",
                      borderRadius: 10,
                    }}
                    src="./broken-image.png"
                  />
                )}
                <Box className={classes.imageOverlay}>
                  <Box className={classes.imageOverlayBg}></Box>
                  <Box className={classes.imageOverlayIcon}>
                    <CameraAlt
                      style={{ color: "white", fontSize: 40, zIndex: 1 }}
                    />
                  </Box>
                </Box>
              </Box>
              {selectedFile ? (
                <Box mr="58px">
                  <Box display="flex" flexDirection="column">
                    <Box width="100%" mb="20px">
                      <input
                        display="none"
                        accept="image/*"
                        id="contained-button-file"
                        onChange={onFileChange}
                        className={classes.input}
                        multiple
                        type="file"
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          component="span"
                        >
                          {t("change")}
                        </Button>
                      </label>
                    </Box>
                    <Box width="100%" mb="20px">
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={() => setSelectedFile(null)}
                      >
                        {t("delete")}
                      </Button>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="body2">
                    {t("acceptedFile")}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box mr="58px">
                  <Box display="flex" flexDirection="column">
                    <Box width="100%" mb="20px">
                      <input
                        display="none"
                        accept="image/*"
                        id="contained-button-file"
                        onChange={onFileChange}
                        className={classes.input}
                        multiple
                        type="file"
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          component="span"
                        >
                          {t("upload")}
                        </Button>
                      </label>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="body2">
                      {t("acceptedFile")}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item md={9}>
            <form>
              <Box>
                <Box display="flex" justifyContent="flex-end">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                  >
                    <Box display="flex" alignItems="center" my="10px">
                      <Typography>{t("name")}</Typography>
                      <Box ml="20px">
                        <TextField
                          required
                          size="small"
                          id="name"
                          variant="outlined"
                          onChange={(e) => setName(e.target.value)}
                          error={namesValidator(name) ? false : true}
                          helperText={
                            namesValidator(name) ? null : t("nameNotValid")
                          }
                          defaultValue={profileInfo.first_name}
                        ></TextField>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" my="10px">
                      <Typography>{t("lastName")}</Typography>
                      <Box ml="20px">
                        <TextField
                          onChange={(e) => setLastName(e.target.value)}
                          error={namesValidator(lastName) ? false : true}
                          helperText={
                            namesValidator(lastName)
                              ? null
                              : t("noValidLastName")
                          }
                          size="small"
                          id="name"
                          variant="outlined"
                          defaultValue={profileInfo.last_name}
                        ></TextField>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" my="10px">
                      <Typography>{t("alias")}</Typography>
                      <Box ml="20px">
                        <TextField
                          onChange={(e) => setAlias(e.target.value)}
                          error={aliasValidator(alias) ? false : true}
                          helperText={
                            aliasValidator(alias) ? null :  t("aliasNotValid")
                          }
                          required
                          size="small"
                          id="alias"
                          variant="outlined"
                          defaultValue={profileInfo.alias}
                        ></TextField>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-end"
                    ml="65px"
                  >
                    <Box display="flex" alignItems="center" my="10px">
                      <Typography>{t("email")}</Typography>
                      <Box ml="20px">
                        <TextField
                          onChange={(e) => setEmail(e.target.value)}
                          error={emailValidator(email) ? false : true}
                          helperText={
                            emailValidator(email) ? null : t("emailNotValid")
                          }
                          required
                          type="email"
                          size="small"
                          id="email"
                          variant="outlined"
                          defaultValue={profileInfo.email}
                        ></TextField>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" my="10px">
                      <Typography>{t("phone")}</Typography>
                      <Box ml="20px">
                        <TextField
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          error={phoneValidator(phoneNumber) ? false : true}
                          helperText={
                            phoneValidator(phoneNumber)
                              ? null
                              : t("phoneNotValid")
                          }
                          type="tel"
                          size="small"
                          id="phone"
                          variant="outlined"
                          defaultValue={profileInfo.phone_number}
                        ></TextField>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box width="100%" display="flex" justifyContent="flex-end">
                  <Box width="152px" height="36px" mr="20px">
                    <Button
                      fullWidth
                      fullHeight
                      variant="outlined"
                      color="primary"
                      onClick={handleEditing}
                    >
                      {t("cancel")}
                    </Button>
                  </Box>
                  <Box width="152px" height="36px">
                    <Button
                      disabled={errors}
                      fullWidth
                      fullHeight
                      disableElevation
                      variant="contained"
                      color="primary"
                      onClick={handleUpdate}
                    >
                      {t("update")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
