import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const ComponentTitle = withStyles({
  root: {
    fontWeight: 500,
    fontSize: 16,
    color: "#9D9DA6",
  },
})(Typography);

export default ComponentTitle;
