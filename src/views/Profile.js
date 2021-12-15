import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import PersonalInformation from "components/Profile/PersonalInformation/";
import Password from "components/Profile/Password/";
import Typography from "@material-ui/core/Typography";
import LoadingShow from "components/common/LoadingShow";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const [profile, setProfile] = useState(undefined);
  const [isLoading, setLoading] = useState(true);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(
        "There was an error fetching Profile info. Contact with support. Error: " +
          error
      );
    }
    return () => {
      abortController.abort();
    };
  }, []);
  return (
    <Box
      bgcolor="#fff"
      height="100%"
      width="100%"
      overflow="auto"
      display="flex"
      flexDirection="column"
    >
      {isLoading && <LoadingShow />}
      <Box display="flex" flexDirection="column">
        <PersonalInformation />
        <Password />
        <Box bgcolor="#FBFBFD" borderRadius={10}>
          <Box mx={2} p={3}>
            <Box display="flex">
              <Typography variant="h4" color="textSecondary">
                {t("plan")}
              </Typography>
              <Box ml="auto">
                <Button
                  color="secondary"
                  variant="contained"
                  disableElevation
                  style={{
                    border: "1px solid #85858C",
                    color: "#85858C",
                    marginRight: "15px",
                  }}
                  href="https://tradeasy.tech/wp-content/themes/Divi/autotrade/portalstripe.php"
                >
                  {t("unsubscribe")}
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  disableElevation
                  href="https://tradeasy.tech/wp-content/themes/Divi/autotrade/portalstripe.php"
                >
                  {t("changePlan")}
                </Button>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column">
              <Box display="flex" mt={1} alignItems="baseline">
                <Typography variant="body1" color="textSecondary">
                  {t("currentPlan")}
                </Typography>
                <Box mx={1} />
                <Typography variant="h6" color="textPrimary">
                  {profile ? profile.current_plan : null}
                </Typography>
              </Box>
              <Box display="flex" mt={1}>
                <Typography variant="body1" color="textSecondary">
                  {t("nextCharge")}
                </Typography>
                <Box mx={1} />
                <Typography variant="body1" color="textPrimary">
                  {profile ? profile.next_charge : null}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box marginTop="auto" bgcolor="#FFF">
        <Box bgcolor="#FBFBFD" mt={3} borderRadius={10} width="100%">
          <Box py="15px" pl="20px" width="100%">
            <Box display="flex">
              <Button
                color="primary"
                variant="contained"
                disableElevation
                style={{ textTransform: "none" }}
                href="https://tradeasy.tech/recomienda-amigo/"
              >
                {t("inviteFriends")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
