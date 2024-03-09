import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { toggleShowNav } from "../../features/slice/uiSlice";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import {
  Avatar,
  Typography,
  useMediaQuery,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import userRolesData from "../../constants/UserRolesItems";
import ToggleMenu from "./ToogleMenu";
import { setTheme} from "../../features/slice/uiSlice";
import { useGetUnApprovedCountQuery } from "../../features/api/productApiSlice";
import { logout as dispatchLogout } from "../../features/slice/authSlice";
import logo2 from "../../assets/IRS2.png";
import { useLogoutMutation } from "../../features/api/usersApiSlice";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";
import themeColors from "../../constants/ThemeColor";
import Header from "./Header";

const drawerWidth = 220;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  outline: "2px solid rgba(145, 152, 161,0.2)",
  background:
    theme.palette.mode === "dark"
      ? "Black"
      : "linear-gradient(0deg, #01127D, #04012F)",
  color: "blue",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBarWrapper = styled(AppBar)(({ theme, open }) => ({
  background:
    theme.palette.mode === "dark"
      ? "Black"
      : "linear-gradient(0deg, #01127D, #04012F)",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerWrapper = styled(Drawer)(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const ToggleNav = () => {
  /// initialize
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  // open close sidebar
  const [toggleNavData, setToggleNavData] = useState(userRolesData);

  /// global state
  const toggleShowNav2 = useSelector((state) => state.ui.ShowSide_nav);
  const { themeColor } = useSelector((state) => state.ui);
  const { isAdmin, userRole, userInfo } = useSelector((state) => state.auth);
  const { profileImage, name } = useSelector((state) => state.auth.userInfo);
  const unApprovedData = useSelector(
    (state) => state.api.queries["getUnApprovedCount(null)"]?.data?.data
  );

  /// Local State
  const [proRoles, setProRoles] = useState([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [themeSelector, setThemeSelector] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { HeaderName } = useSelector((state) => state.ui);

  /// rtk query
  const {
    data: unApprovedcount,
    isLoading: isLoading,
    isError,
    refetch,
  } = useGetUnApprovedCountQuery(null, {
    pollingInterval: 1000 * 300,
  });

  const [logout] = useLogoutMutation();

  /// handler
  const handleDrawer = () => {
    dispatch(toggleShowNav());
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setProfileMenuOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setProfileMenuOpen(false);
  };

  const handleClickThemeSelector = (event) => {
    setAnchorEl(event.currentTarget);
    setThemeSelector(true);
  };
  const handleCloseThemeSelector = () => {
    setAnchorEl(null);
    setThemeSelector(false);
  };

  const handleLogout = async () => {
    try {
      dispatch(dispatchLogout());
      navigate("/login");
      const res = await logout().unwrap();
    } catch (error) {
      console.error("An error occurred during Navbar:", error);
    }
  };

  const handleThemeSelector = (data) => {
    dispatch(setTheme(data));
  };
  ///  userEffects
  useEffect(() => {
    const filteredParents = userRolesData.reduce((acc, parent) => {
      const filteredChildren = parent.childrens.filter((child) => {
        return userRole?.some((item) => item.id === child.id);
      });

      // Check if filteredChildren is not empty, then include the parent
      if (filteredChildren.length > 0) {
        acc.push({ ...parent, childrens: filteredChildren });
      }

      return acc;
    }, []);

    setProRoles(filteredParents);
  }, []);

  /// function
  const sumObjectValues = (obj) => {
    let total = 0;
    const userRoles = userInfo.userRoles;

    if (isAdmin) {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          total += obj[key];
        }
      }
    } else if (userRoles?.length > 0) {
      for (const key in obj) {
        const exist = userRoles.find((item) => item.name === key);

        if (exist) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            total += obj[key];
          }
        }
      }
    }

    return total;
  };

  const renderMenuItems = (data) => {
    const userRoles = userInfo.userRoles;
    if (!data) return;
    return Object.entries(data)
      .filter(([key, value]) => value > 0)
      .map(([key, value]) => {
        const exist = userRoles?.find((item) => item.name === key);
        if (isAdmin) {
          return (
            <MenuItem
              key={key}
              sx={{
                "&:hover": {
                  backgroundColor: "#d1d5db",
                },
              }}
              onClick={() => {
                setAnchorEl(null);
                setNotificationOpen(false);

                if (key === "New Product Approval") {
                  navigate("/NewProductApproval");
                } else if (key === "Product Changes Approval") {
                  navigate("/changeProductApproval");
                } else if (key === "Open Box Approval") {
                  navigate("/boxapprovalstatus?true");
                } else if (key === "Cost Approval") {
                  navigate("Approval/LandingCost");
                } else if (key === "Stock Approval") {
                  navigate("/Approval/Quantity");
                } else if (key === "MRP Approval") {
                  navigate("/Approval/MRP");
                } else if (key === "SalesPrice Approval") {
                  navigate("/Approval/SalesPrice");
                } else if (key === "SellerPrice Approval") {
                  navigate("/Approval/SellerPrice");
                }
              }}
            >
              {`${key}: ${value}`}
            </MenuItem>
          );
        } else if (exist) {
          return (
            <MenuItem
              key={key}
              onClick={() => {
                handleClose();
 
                if (key === "New Product Approval") {
                  navigate("/NewProductApproval");
                } else if (key === "Product Changes Approval") {
                  navigate("/changeProductApproval");
                } else if (key === "Open Box Approval") {
                  navigate("/boxapprovalstatus?true");
                } else if (key === "Cost Approval") {
                  navigate("Approval/LandingCost");
                } else if (key === "Stock Approval") {
                  navigate("/Approval/Quantity");
                } else if (key === "MRP Approval") {
                  navigate("/Approval/MRP");
                } else if (key === "SalesPrice Approval") {
                  navigate("/Approval/SalesPrice");
                } else if (key === "SellerPrice Approval") {
                  navigate("/Approval/SellerPrice");
                }
              }}
            >
              {`${key}: ${value}`}
            </MenuItem>
          );
        }
      });
  };

  const newUnapprovedData = sumObjectValues(unApprovedData);
  const notificationCount = newUnapprovedData;
  /// MUI Breakpoints
  const isSmOrDown = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <AppBarWrapper
        position="fixed"
        sx={{
          background: themeColor.themeColor1,
        }}
      >
        <Toolbar
          sx={{
            marginLeft: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                handleDrawer();
              }}
              edge="start"
              sx={{
                position: "absolute",
                top: 15,
                left: 0,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                marginLeft: "1.5rem",
                width: "2.5rem",
                height: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
              }}
            >
              {" "}
              <img
                src={logo2}
                alt="Arrow"
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                  width: "100%",
                }}
              />
            </Box>
          </Box>
          <Header Name={HeaderName} info={true}  />
          <Box
            sx={{
              display: "flex",
              gap: "50px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <Badge
                badgeContent={notificationCount}
                color={notificationCount > 0 ? "error" : "default"}
                overlap="circular"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                onClick={(event) => {
                  if (notificationCount > 0) {
                    setAnchorEl(event.currentTarget);
                    setNotificationOpen(true);
                  }
                }}
                className={notificationCount ? "notificationBell" : ""}
                sx={{
                  cursor: notificationCount > 0 ? "pointer" : "default",
                }}
              >
                <NotificationsNoneIcon color="#fff" />
              </Badge>
              <Menu
                id="demo-positioned-menu"
                anchorEl={anchorEl}
                open={notificationOpen}
                onClose={() => {
                  setAnchorEl(null);
                  setNotificationOpen(false);
                }}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {renderMenuItems(unApprovedData)}
              </Menu>
            </div>
            <Box>
              <ColorLensIcon
                onClick={handleClickThemeSelector}
                sx={{
                  cursor: "pointer",
                }}
              />
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={themeSelector}
                onClose={handleCloseThemeSelector}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    padding: "2px",
                    gap: "2px",
                    width: "100px",
                  }}
                >
                  {themeColors.map((item) => (
                    <Box
                      key={item.name}
                      onClick={() => {
                        handleThemeSelector(item);
                      }}
                      sx={{
                        flex: "0 0 calc(33.33% - 4px)", // Set the width for each item to be one-third of the container's width
                        height: "30px",
                        background: item.themeColor1,
                        borderRadius: "2px",
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <CheckCircleOutlineTwoToneIcon
                        sx={{
                          color: "white",
                          display: themeColor.name === item.name ? "" : "none",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Menu>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Typography>{name}</Typography>
              <Avatar
                src={profileImage?.url || ""}
                sx={{
                  width: "30px",
                  height: "30px",
                  "& .MuiAvatar-img": {
                    objectFit: "fill",
                    objectPosition: "center",
                  },
                }}
                onClick={handleClick}
              />
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={profileMenuOpen}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={() => navigate("/profile")}>
                  Profile
                </MenuItem>

                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBarWrapper>

      {/* {App Drawer} */}
      <DrawerWrapper
        variant={isSmOrDown ? "temporary" : "permanent"}
        open={toggleShowNav2}
      >
        <DrawerHeader />

        <Box
          sx={{
            overflowY: "auto",
            height: "84vh",
            overflowX: "hidden",
            marginTop: "0.3rem",
          }}
        >
          {isAdmin
            ? toggleNavData.map((item, index) => {
                return <ToggleMenu key={index} {...item}></ToggleMenu>;
              })
            : proRoles.map((item, index) => {
                return <ToggleMenu key={index} {...item}></ToggleMenu>;
              })}
        </Box>
      </DrawerWrapper>
    </Box>
  );
};

export default ToggleNav;
