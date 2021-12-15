import React from "react";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { useTranslation } from "react-i18next";
NoEdit.propTypes = {
  profileInfo: PropTypes.object.isRequired,
};

export default function NoEdit(props) {
  // eslint-disable-next-line no-unused-vars
  const profileInfo = props.profileInfo;
  const [t, i18n] = useTranslation(["profile"]); 

  return (
    <Box width="100%" mt="10px">
      <Grid>
        <Grid container spacing={0} alignItems="center">
          <Grid item md={2}>
            <Box
              width="180px"
              height="180px"
              p="5px"
              mr="20px"
              bgcolor=" #E6AA17"
              borderRadius="10px"
              mt="10px"
            >
              {profileInfo.avatar_img ? (
                <Avatar
                  variant="square"
                  style={{ width: "170px", height: "170px", borderRadius: 10 }}
                  src={profileInfo.avatar_img}
                />
              ) : (
                <Avatar
                  variant="square"
                  style={{ width: "170px", height: "170px", borderRadius: 10 }}
                  src="./broken-image.png"
                />
              )}
            </Box>
          </Grid>
          <Grid item md={10}>
            <Box display="flex" alignItems="flex-end">
              <Box display="flex" flexDirection="column" alignItems="flex-end">
                <Box display="flex" alignItems="center" mb="15px">
                  <Typography color="textSecondary">{t("name")}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb="15px">
                  <Typography color="textSecondary">{t("alias")}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb="15px">
                  <Typography color="textSecondary">{t("email")}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb="15px">
                  <Typography color="textSecondary">{t("phone")}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography color="textSecondary">
                  {t("registration")}
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
              >
                <Box ml="20px" mb="15px">
                  <Typography variant="h6">{profileInfo.first_name}</Typography>
                </Box>
                <Box ml="20px" mb="15px">
                  <Typography>{profileInfo.alias}</Typography>
                </Box>
                <Box ml="20px" mb="15px">
                  <Typography>{profileInfo.email}</Typography>
                </Box>
                <Box ml="20px" mb="15px">
                  <Typography>{profileInfo.phone_number}</Typography>
                </Box>
                <Box ml="20px">
                  <Typography>
                    {profileInfo.registration_date
                      ? profileInfo.registration_date
                      : ""}
                    &nbsp;
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
