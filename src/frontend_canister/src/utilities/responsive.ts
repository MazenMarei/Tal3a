export const useResponsive = () => {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const getBreakpoint = () => {
    const width = window.innerWidth;
    if (width >= breakpoints["2xl"]) return "2xl";
    if (width >= breakpoints.xl) return "xl";
    if (width >= breakpoints.lg) return "lg";
    if (width >= breakpoints.md) return "md";
    if (width >= breakpoints.sm) return "sm";
    return "xs";
  };

  const getResponsiveStyle = (
    styles: { [x: string]: string },
    defaultValue = ""
  ) => {
    const breakpoint = getBreakpoint();
    return styles[breakpoint] || defaultValue;
  };

  const onBreakpointChange = (callback: (arg0: string) => void) => {
    let lastBreakpoint = getBreakpoint();
    const handleResize = () => {
      const currentBreakpoint = getBreakpoint();
      if (currentBreakpoint !== lastBreakpoint) {
        lastBreakpoint = currentBreakpoint;
        callback(currentBreakpoint);
      }
    };
    window.addEventListener("resize", handleResize);
    callback(lastBreakpoint);
    return () => window.removeEventListener("resize", handleResize);
  };

  return {
    getBreakpoint,
    getResponsiveStyle,
    onBreakpointChange,
    breakpoints,
  };
};
