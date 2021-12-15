import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";

import PasswordForm from "./PasswordForm";

export default function PersonalInformation() {
  const [editing, setEditing] = React.useState(false);
  const [t, i18n] = useTranslation(["profile"]); 

  const handleEditing = () => {
    setEditing(!editing);
  };

  return (
    <Box bgcolor="#FBFBFD" m={3} borderRadius={10}>
      <Box mx={2} p={3}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" color="textSecondary">
            {t("passwordOptions")}
          </Typography>
          <Box display={editing ? "none" : "block"}>
            <Button
              color="primary"
              variant="outlined"
              disableElevation
              href="https://tradeasy.tech/mi-cuenta/lost-password/"
            >
              {t("createNew")}
            </Button>
          </Box>
        </Box>
        {editing ? <PasswordForm modifyEditingStatus={handleEditing} /> : null}
      </Box>
    </Box>
  );
}
