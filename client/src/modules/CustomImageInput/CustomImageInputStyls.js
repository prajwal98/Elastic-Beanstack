const customImageInputStyle = (theme) => ({
  hidden: { display: "none" },

  container: {
    margin: "auto",
  },
  title: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    //fontFamily: 'Roboto Slab',
    //fontWeight:'bold',
    width: "250px",
    padding: theme.spacing.unit,
  },
  bigAvatar: {
    margin: "auto",
    width: 60,
    height: 60,
    borderColor: theme.palette.primary.main,
    borderStyle: "solid",
    borderSize: "1px",
    cursor: "pointer",
  },
  avatarThumb: {
    maxWidth: 60,
    maxHeight: 60,
  },
  primaryBack: {
    background: theme.palette.primary.main,
  },
  whiteBack: {
    background: "#3f51b5",
  },

  errorBack: { background: theme.palette.error.main },

  root: {
    "& .MuiAvatar-root": {
      width: "190px",
      height: "20px",
      display: "flex",
      overflow: "hidden",
      position: "relative",
      fontSize: "1.25rem",
      alignItems: "center",
      flexShrink: "0",
      fontFamily: "Roboto",
      lineHeight: "1",
      userSelect: "none",
      borderRadius: "05px",
      justifyContent: "center",
    },
  },
});
export default customImageInputStyle;
