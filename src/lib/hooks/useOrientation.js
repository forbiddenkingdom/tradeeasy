import React from "react";

/**
 * Hook used to detech user window orientation & device
 * @returns {{isDesktop: Boolean, isLandscape: Boolean, isPortrait: Boolean}} User's platform information.
 */
export default function useOrientation() {
  const [isLandscape, setIsLandscape] = React.useState(true);
  /**
   * Handle orientation change & save new orientation
   * @param {MediaQueryList} mql
   */
  const handleOrientationChange = (mql) => {
    setIsLandscape(mql.matches);
  };

  // Effect to setup listeners & current orientation
  React.useEffect(() => {
    const landscapeMediaQuery = window.matchMedia("(orientation: landscape)");
    setIsLandscape(landscapeMediaQuery.matches);
    landscapeMediaQuery.addEventListener("change", handleOrientationChange);

    // Cleanup function
    return () => {
      landscapeMediaQuery.removeEventListener(
        "change",
        handleOrientationChange
      );
    };
  }, []);
  return {
    isDesktop: !navigator.userAgentData.mobile,
    isLandscape: isLandscape,
    isPortrait: !isLandscape,
  };
}
