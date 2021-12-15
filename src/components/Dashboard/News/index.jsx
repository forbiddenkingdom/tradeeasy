import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import moment from "moment";

import ComponentTitle from "components/Dashboard/ComponentTitle";
import NewsCard from "./NewsCard";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import Typography from "@material-ui/core/Typography";
import { useTranslation } from "react-i18next";

export default function News() {
  const [t, i18n] = useTranslation("dashboard");
  const [news, setNews] = useState([]);
  let displayNews = news.filter(
    (item) => item.lang_id == i18n.language.toUpperCase()
  );
  useEffect(async () => {
    const abortController = new AbortController();
    const url = process.env.REACT_APP_TRADEASY_API;
    try {
      const response = await fetch(`${url}news/`, {
        signal: abortController.signal,
      });
      if (!response.ok) throw new Error("News fetch finished with errors");
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error(error);
    }
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <Box
      bgcolor="white"
      borderRadius="10px 0px 0px 0px"
      width="100%"
      height="100%"
    >
      <Box p={2} display="flex" alignItems="center">
        <ComponentTitle>{t("news")}</ComponentTitle>
      </Box>
      <Box overflow="auto" height="312px">
        {displayNews.length ? (
          displayNews.map((newInfo, index) => {
            return (
              <Box key={index} my={2}>
                <NewsCard
                  createDate={moment(newInfo.creation_date).format("llll")}
                  author={newInfo.author}
                  newtext={newInfo.title}
                  link={newInfo.link}
                />
              </Box>
            );
          })
        ) : (
          <Box
            display="flex"
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            color="rgba(0, 0, 0, 0.54)"
          >
            <DoneAllIcon fontSize="large" />
            <Typography variant="h6">{t("noNews")}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
