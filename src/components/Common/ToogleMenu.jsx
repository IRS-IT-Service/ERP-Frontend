import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useSelector } from "react-redux";
import ListItemText from "@mui/material/ListItemText";
import { Typography, Collapse, Box, Badge, Tooltip } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomNavLink = styled(NavLink)(({ theme }) => ({
  width: "100%",
}));

const StyleNavLink = styled(NavLink)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "grey",

  width: "100%",

  "&:hover": {
    // backgroundColor: "#fff",
    color: theme.palette.mode === "dark" ? "Black" : "#fff",
    "& .MuiListItemIcon-root": {
      color: theme.palette.mode === "dark" ? "Black" : "#fff",
    },
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.mode === "dark" ? "#fff" : "grey",
  },
  "&.active": {
    // Add the active selector for activeClassName
    backgroundColor: theme.palette.mode === "dark" ? "#b3cbff" : "#4459ee",
    color: theme.palette.mode === "dark" ? "black" : "#fff",
    "& .MuiListItemIcon-root": {
      color: theme.palette.mode === "dark" ? "black" : "#fff",
    },
  },
}));
const StyleItemFilter = styled(ListItem)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "grey",
  backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#b3cbff",

  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#fff" : "grey",
    color: theme.palette.mode === "dark" ? "grey" : "#fff",
    "& .MuiListItemIcon-root": {
      color: theme.palette.mode === "dark" ? "grey" : "#fff",
    },
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.mode === "dark" ? "#fff" : "grey",
  },
}));

const ToogleMenu = ({ title, icon, childrens }) => {
  /// intialize
  const location = useLocation();

  /// global state
  const toggleShowNav2 = useSelector((state) => state.ui.ShowSide_nav);
  const { themeColor } = useSelector((state) => state.ui);
  const data = useSelector(
    (state) => state.api.queries["getUnApprovedCount(null)"]?.data?.data
  );

  const Requestcount =  useSelector(
    (state) => state.api.queries["getRequestCount(null)"]?.data?.data
  );
  const dataEmbeded ={...data , ...Requestcount}
 
  /// local state
  const [toggleSubmenu, setToggleSubmenu] = useState(false);

  return (
    <StyleItemFilter
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
      disablePadding
    >
      <StyleNavLink
        onClick={() => setToggleSubmenu(!toggleSubmenu)}
        sx={{
          color: "grey",

          width: "100%",

          "&:hover": {
            // backgroundColor: "#fff",
            color: "#fff",
            "& .MuiListItemIcon-root": {
              color: "#fff",
            },
          },
          "& .MuiListItemIcon-root": {
            color: "grey",
          },
          "&.active": {
            // Add the active selector for activeClassName
            backgroundColor: themeColor.sideBarColor1,
            color: "#fff",
            "& .MuiListItemIcon-root": {
              color: "#fff",
            },
          },
        }}
      >
        {toggleShowNav2 ? (
          <ListItemButton
            sx={{
              borderBottom: "1px solid #f2f2f2",
              display: "grid",
              gridTemplateColumns: "10% 80% 10%",
            }}
          >
            {/* Button content */}

            <ListItemIcon>
              <i className={icon}></i>
            </ListItemIcon>
            <ListItemText
              primary={title}
              sx={{ textAlign: "center", opacity: toggleShowNav2 ? 1 : 0 }}
            />
            <ExpandMoreIcon
              sx={{
                transition: ".7s",
                transform: toggleSubmenu ? "rotate(180deg)" : "rotate(0deg)",
                opacity: toggleShowNav2 ? 1 : 0,
              }}
            />
          </ListItemButton>
        ) : (
          <Tooltip title={title} placement="top">
            <ListItemButton
              sx={{
                borderBottom: "1px solid #f2f2f2",
                display: "grid",
                gridTemplateColumns: "10% 80% 10%",
              }}
            >
              {/* Button content */}

              <ListItemIcon>
                <i className={icon}></i>
              </ListItemIcon>
              <ListItemText
                primary={title}
                sx={{ textAlign: "center", opacity: toggleShowNav2 ? 1 : 0 }}
              />
              <ExpandMoreIcon
                sx={{
                  transition: ".7s",
                  transform: toggleSubmenu ? "rotate(180deg)" : "rotate(0deg)",
                  opacity: toggleShowNav2 ? 1 : 0,
                }}
              />
            </ListItemButton>
          </Tooltip>
        )}
      </StyleNavLink>
      {/* collapse Item */}
      <Collapse
        in={toggleSubmenu}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {toggleSubmenu &&
          childrens.map((childItems, index) => (
            <CustomNavLink to={childItems.path} key={index}>
              {toggleShowNav2 ? (
                <Box
                  key={childItems.id}
                  sx={{
                    display: "grid",
                    gap: ".4rem",
                    gridTemplateColumns: "11% 80% ",
                    paddingX: "1.2rem",
                    paddingY: ".6rem",
                    backgroundColor:
                      location.pathname === childItems.path
                        ? themeColor.sideBarColor2
                        : "#fff",
                    color: "#000",
                    "&:hover": {
                      backgroundColor: themeColor.sideBarColor2,
                    },
                    "&.active": {
                      backgroundColor: "black",
                    },
                  }}
                >
                  {childItems.notification ? (
                    <Badge
                      badgeContent={dataEmbeded?.[childItems.name]}
                      color="secondary"
                    >
                      <i
                        style={{ textAlign: "right" }}
                        className={childItems.icon}
                      ></i>
                    </Badge>
                  ) : (
                    <i
                      style={{ textAlign: "right" }}
                      className={childItems.icon}
                    ></i>
                  )}

                  <Typography
                    variant="h6"
                    sx={{ fontSize: ".9rem", opacity: toggleShowNav2 ? 1 : 0 }}
                  >
                    {childItems.name}
                  </Typography>
                </Box>
              ) : (
                <Tooltip title={childItems.name} placement="top">
                  <Box
                    key={childItems.id}
                    sx={{
                      display: "grid",
                      gap: ".4rem",
                      gridTemplateColumns: "11% 80% ",
                      // placeItems: 'center',

                      paddingX: "1.2rem",
                      paddingY: ".6rem",
                      // backgroundColor: '#fff',
                      // backgroundColor: active == childItems ? ' #b3d9ff' : '#fff',
                      backgroundColor:
                        location.pathname === childItems.path
                          ? "#b3d9ff"
                          : "#fff",
                      color: "#000",
                      "&:hover": {
                        backgroundColor: " #f2f2f2",
                      },
                      "&.active": {
                        backgroundColor: "black",
                      },
                    }}
                  >
                    {childItems.notification &&
                    childItems.notification > 1000 ? (
                      <Badge
                        badgeContent={childItems.notification}
                        color="secondary"
                      >
                        <i
                          style={{ textAlign: "right" }}
                          className={childItems.icon}
                        ></i>
                      </Badge>
                    ) : (
                      <i
                        style={{ textAlign: "right" }}
                        className={childItems.icon}
                      ></i>
                    )}

                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: ".9rem",
                        opacity: toggleShowNav2 ? 1 : 0,
                      }}
                    >
                      {childItems.name}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </CustomNavLink>
          ))}
      </Collapse>
    </StyleItemFilter>
  );
};

export default ToogleMenu;
