import React, { createRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useScreenshot } from "use-react-screenshot";

import { Box, makeStyles, TextField, Typography } from "@material-ui/core";
import "@fontsource/karla/700.css";
import Detailed from "./Detailed";
import { Fade, Modal } from "@material-ui/core";
import theme from "lib/theme";
import Backdrop from "@material-ui/core/Backdrop";
import ScreenshotOperations from "./Operations";
import {
  Facebook,
  LinkedIn,
  WhatsApp,
  Twitter,
  ArrowDropDown,
  GetApp,
} from "@material-ui/icons";
import TelegramIcon from "@material-ui/icons/Telegram";
import MenuItem from "@material-ui/core/MenuItem";
import { useTranslation } from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from "@material-ui/core/Button";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 500,
  },
  expandComponent: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: "5px 0px",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    display: "flex",
    margin: "2rem",
    maxHeight: "90%",
    overflow: "auto",
  },
}));


// Main Component
export default function StrategyScreenShot({
  id,
  image,
  operations,
  currency,
  title,
  owner,
  ticker,
  timeframe,
  isCapture,
  setCapture,
}) {
  // Hooks
  const classes = useStyles();
  const [t] = useTranslation("validation");

  const ref = createRef(null);
  const [shotImageURL, setShotImageUrl] = useState("");
  const [shotImage, takeScreenshot] = useScreenshot();
  const [shotWidth, setShotWidth] = useState(0);
  const [shotHeight, setShotHeight] = useState(0);

  const [open, setOpen] = useState(isCapture);
  const handleClose = () => {
    setOpen(false);
    setCapture(false);
  };

  const shareImgID = new Date().getTime();

  const b64toBlob = (dataURI) => {
    var byteString = atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  };

  const getFile = () => {
    let file = b64toBlob(shotImage);

    let formData = new FormData();
    formData.append("upload", file);
  };

  useEffect(() => {
    if (ref && ref.current && isCapture) {
      let curr = ref.current;

      setTimeout(() => {
        if (document.getElementById("screenshot-container")) {
          const height = document.getElementById(
            "screenshot-container"
          ).clientHeight;
          const width = document.getElementById(
            "screenshot-container"
          ).clientWidth;
          setShotWidth(width);
          setShotHeight(height);
          takeScreenshot(curr);
        }
      }, 1500);
    }
    if (isCapture) {
      setShotImageUrl(
        process.env.REACT_APP_TRADEASY_API + "share-image/" + shareImgID
      );
      updateImage();
      setOpen(true);
    }
  }, [isCapture]);

  const updateImage = async () => {
    const API_URL = process.env.REACT_APP_TRADEASY_API;
    const body = {
      id: shareImgID,
      stratId: id,
      img: shotImage,
    };
    console.log("Tiempo de guardado " + shareImgID);
    try {
      const response = await fetch(`${API_URL}share-image/`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Update image error.");
    } catch (error) {
      console.error(error);
    }
  };

  const onDownload = () => {
    const downloadLink = document.createElement("a");
    const fileName = ticker + "-" + timeframe + "-" + new Date() + ".png";
    downloadLink.href = shotImage;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const copyImage = async () => {
    const base64Res = await fetch(shotImage);
    const blob = await base64Res.blob();
    try {
      navigator.clipboard.write([
        new window.ClipboardItem ({
          'image/png': blob,
        })
      ]);
    } catch (err) {
      console.err(err);
    }
  }

  return (
    <Box width="100%" height="100%">
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              {shotImage && (
                <>
                  <Box
                    marginLeft="auto"
                    marginTop="auto"
                    display="flex"
                    position="absolute"
                    color="#00419F"
                    right="40px"
                    top="30px"
                    height="30px"
                    overflow="unset"
                  >
                    {/* <button  onClick={getFile}>CLICK</button> */}
                    <Box fontSize="20px" fontWeight="bold" color="blue">
                      Share:
                    </Box>
                    <FacebookShareButton
                      url={shotImageURL}
                      title="Mira que estrategia he creado en tradEAsy"
                    >
                      <IconButton
                        size="small"
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        style={{ color: "#22579A" }}
                      >
                        <Facebook />
                      </IconButton>
                    </FacebookShareButton>

                    <TwitterShareButton
                      url={shotImageURL}
                      title="Mira que estrategia he creado en tradEAsy"
                    >
                      <IconButton
                        size="small"
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        style={{ color: "#00ADF1" }}
                      >
                        <Twitter />
                      </IconButton>
                    </TwitterShareButton>

                    <TelegramShareButton
                      url={shotImageURL}
                      title="Mira que estrategia he creado en tradEAsy"
                    >
                      <IconButton
                        size="small"
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        style={{ color: "#0000FF" }}
                      >
                        <TelegramIcon />
                      </IconButton>
                    </TelegramShareButton>

                    <WhatsappShareButton
                      url={shotImageURL}
                      title="Mira que estrategia he creado en tradEAsy"
                    >
                      <IconButton
                        size="small"
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        style={{ color: "#00FF00" }}
                      >
                        <WhatsApp />
                      </IconButton>
                    </WhatsappShareButton>

                    <Button
                      variant="contained"
                      size="small"
                      href="#contained-buttons"
                      disableElevation
                      style={{
                        minWidth: "30px",
                        width: "30px",
                        backgroundColor: "#0166FF",
                        color: "#fff",
                      }}
                      outlined
                      onClick={onDownload}
                    >
                      <GetApp />
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      href="#contained-buttons"
                      disableElevation
                      style={{
                        marginLeft: "5px",
                        minWidth: "30px",
                        width: "30px",
                        backgroundColor: "#FF2222",
                        color: "#fff",
                      }}
                      outlined
                      onClick={copyImage}
                    >
                      <FileCopyIcon />
                    </Button>

                  </Box>
                  <img width={shotWidth} height={shotHeight} src={shotImage} id="shot-image" />
                </>
              )}
            </div>
          </Fade>
        </Modal>
      </div>

      <Box ref={ref} position="fixed" zIndex="-1000">
        {open && (
          <Box id="screenshot-container" className={classes.container}>
            <Box component="tr" display="flex" width="100%">
              <Box
                component="td"
                display="flex"
                width="100%"
                bgcolor="white"
                justifyContent="space-between"
              >
                <Box border="5px solid blue" padding="5px" height="fit-content">
                  <Box display="flex" marginTop="35px" marginBottom="20px">
                    <Box display="flex" color="#00419F" paddingLeft="20px">
                      <Box fontSize="30px" fontWeight="bold">
                        {title}
                      </Box>
                      <Box marginTop="auto">
                        <Box
                          fontSize="17px"
                          marginBottom="5px"
                          marginLeft="10px"
                        >
                          (by {owner})
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box position="relative" minHeight="90px">
                    <img src={image} width="100%" alt="Balance chart" />
                    <Box
                      position="absolute"
                      display="flex"
                      top="0"
                      left="100px"
                    >
                      <Box>
                        <Typography>{t("ticker")}</Typography>
                        <TextField
                          select
                          value="de"
                          variant="outlined"
                          size="small"
                          name="ticker"
                          style={{ width: "120px" }}
                        >
                          <MenuItem value="de" selected>
                            {ticker}
                          </MenuItem>
                          <MenuItem value="de1">A</MenuItem>
                        </TextField>
                      </Box>
                      <Box marginLeft="10px">
                        <Typography>{t("timeframe")}</Typography>
                        <TextField
                          select
                          value="de"
                          variant="outlined"
                          size="small"
                          name="ticker"
                          style={{ width: "120px" }}
                        >
                          <MenuItem value="de" selected>
                            {timeframe}
                          </MenuItem>
                          <MenuItem value="de1">A</MenuItem>
                        </TextField>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" width="100%">
                    <Box
                      display="flex"
                      flexDirection="column"
                      width="50%"
                      bgcolor="#FFF"
                      p={2}
                      className={classes.expandComponent}
                      position="relative"
                    >
                      <ScreenshotOperations
                        wining={operations.trades_win}
                        losing={operations.trades_loss}
                        gains={operations.gains_only}
                        loses={operations.loses_only}
                        rate={operations.gain_loss_rate}
                        currency={currency}
                      />
                    </Box>
                    <Box
                      display="flex"
                      position="relative"
                      width="50%"
                      p={2}
                      bgcolor="#FFF"
                      className={classes.expandComponent}
                    >
                      <Detailed
                        currency={currency}
                        gains={operations.gains_only}
                        wining={operations.trades_win}
                        best={operations.best_gain}
                        worst={operations.worst_loss}
                        loses={operations.loses_only}
                        losing={operations.trades_loss}
                        bestTrade={operations.best}
                        runup={operations.runup}
                        relativeRunup={operations.relativeRunup}
                        drawdown={operations.drawdown}
                        relativeDrawdown={operations.relativeDrawdown}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
StrategyScreenShot.propTypes = {
  id: PropTypes.number,
  image: PropTypes.string, // Strategy balance image
  operations: PropTypes.object.isRequired, // Strategy operations
  currency: PropTypes.string.isRequired, // Strategy currency
  isCapture: PropTypes.bool,
  setCapture: PropTypes.func,
  title: PropTypes.string,
  owner: PropTypes.string,
  timeframe: PropTypes.string,
  ticker: PropTypes.string,
};
