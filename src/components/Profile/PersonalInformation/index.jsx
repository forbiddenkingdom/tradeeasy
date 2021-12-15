/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import NoEdit from "./NoEdit";
import Edit from "./Edit";
import { useTranslation } from "react-i18next";

export default function PersonalInformation() {
  const [profile, setProfile] = useState({
    first_name: null,
    alias: null,
    email: null,
    phone_number: null,
    registration_date: null,
  });
  const [editing, setEditing] = React.useState(false);
  const [t, i18n] = useTranslation(["profile"]); 

  useEffect(async () => {
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    const userId = localStorage.getItem("user_id");
    try {
      let response = await fetch(`${url}users/${userId}`, {
        signal: abortController.signal,
      });
      let data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error(
        "There was an error fetching Profile info. Contact with support. Error: " +
          error
      );
    }

    return () => {
      abortController.abort();
    };
  }, []);

  const handleEditing = () => {
    setEditing(!editing);
  };

  return (
    <Box m={3} borderRadius={10}>
      <Box mx={2} p={3}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" color="textSecondary">
            {t("information")}
          </Typography>
          {!editing ? (
            <Button color="primary" variant="outlined" onClick={handleEditing}>
              {t("editInformation")}
            </Button>
          ) : null}
        </Box>
        <Box display="flex" width="100%">
          {editing ? (
            <Edit
              setProfile={setProfile}
              handleEditing={handleEditing}
              profileInfo={profile}
            />
          ) : (
            <NoEdit profileInfo={profile} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
