import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

NewsCard.propTypes = {
  author: PropTypes.string.isRequired,
  createDate: PropTypes.string.isRequired,
  newtext: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default function NewsCard(props) {
  const { author, createDate, newtext, link } = props;
  return (
    <Box bgcolor="#253E66" borderRadius="5px" margin="1rem" padding="1rem">
      <Typography
        variant="body1"
        color="secondary"
        href={link}
        target="_blank"
        component="a"
      >
        {newtext}
      </Typography>
      <Box display="flex" justifyContent="space-between" marginTop="16px">
        <Typography variant="body1" color="secondary">
          {createDate}
        </Typography>
        <Typography variant="body1" color="secondary">
          {author}
        </Typography>
      </Box>
    </Box>
  );
}
