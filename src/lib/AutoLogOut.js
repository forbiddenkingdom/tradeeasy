import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router";

/**
 * Component used to add an auto log out to the app.
 * @param {Object} props Component propss
 * @param {Number} props.idleMinutes Minutes that user can be idle.
 *
 * @example
 * // Log out after 60 minutes.
 * <AutoLogOut idleMinutes={60} />
 */
export default function AutoLogOut({ idleMinutes }) {
  const history = useHistory();
  const [idleTime, setIdleTime] = React.useState(0);

  /**
   * Handler that will +1 to idleTime every time it gets executed
   */
  const handleIdle = () => {
    setIdleTime((prevIdleTime) => prevIdleTime + 1);
  };

  /**
   * Handle user activity
   */
  const handleActivity = () => {
    setIdleTime(0);
  };

  // Effect to setup idle handler & event listeners
  React.useEffect(() => {
    const id = setInterval(handleIdle, 60000);
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);

    // Cleanup function
    return () => {
      clearInterval(id);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
    };
  }, []);
  // effect that will check if the user reached max idle time
  React.useEffect(() => {
    if (idleTime === idleMinutes) {
      localStorage.removeItem("user_id");
      history.push("/");
    }
  }, [idleTime]);

  return <React.Fragment />;
}

AutoLogOut.propTypes = {
  idleMinutes: PropTypes.number,
};
AutoLogOut.defaultProps = {
  idleMinutes: 120,
};
