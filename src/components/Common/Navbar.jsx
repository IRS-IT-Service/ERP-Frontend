import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  styled,
  Avatar,
  InputBase,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Collapse,
  Link as MuiLink,
  InputAdornment,
  CircularProgress,
  Switch,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toggleMode } from "../../features/slice/uiSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as dispatchLogout } from "../../features/slice/authSlice";
import { useLogoutMutation } from "../../features/api/usersApiSlice";
import { useAutoCompleteProductMutation } from "../../features/api/productApiSlice";
import { setSearchTerm } from "../../features/slice/productSlice";
import logo2 from "../../assets/IRS2.png";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background:
    theme.palette.mode === "dark"
      ? "Black"
      : "linear-gradient(0deg, #01127D, #04012F)",
  position: "sticky",
}));

const StyledInputbase = styled(InputBase)(({ theme }) => ({
  borderRadius: "10px",
  input: {
    "&:hover": {
      color: "rgb(15, 126, 252)",
    },
  },
  width: "100%",
  background: theme.palette.mode === "dark" ? "grey" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "black",
}));
const Icon = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "20px",
  alignItems: "center",
}));

const Navbar = () => {
  /// initialization
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const autoCompleteRef = useRef(null);
  const location = useLocation();

  /// global state
  const { profileImage, name } = useSelector((state) => state.auth.userInfo);
  const unApprovedData = useSelector(
    (state) => state.api.queries["getUnApprovedCount(null)"]?.data?.data
  );
  const { userInfo, isAdmin } = useSelector((state) => state.auth);

  /// local state
  const [log_open, setLog_open] = useState(false);
  const [testSearch, setTestSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isChecked, setChecked] = useState(false);

  /// rtk query
  const [logout] = useLogoutMutation();
  const [
    autoCompleteApi,
    { isLoading: autoCompleteLoading, refetch: refetchAutocomplete },
  ] = useAutoCompleteProductMutation();

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

  const newUnapprovedData = sumObjectValues(unApprovedData);
  const notificationCount = newUnapprovedData;

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

  /// handlers
  const handle_log_open = () => {
    setLog_open(!log_open);
  };

  // Notification bell icon handler menu open and close
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  //MUi Switch
  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: theme.palette.mode === "dark" ? "black" : "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            theme.palette.mode === "dark" ? "black" : "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  }));

  const handleSwitchChange = (event) => {
    setChecked(event.target.checked);
    dispatch(toggleMode());
  };

  const autocompleteHandler = async (searchTerm) => {
    try {
      if (!testSearch) {
        dispatch(setSearchTerm(null));
      } else {
        dispatch(setSearchTerm(testSearch));
      }
    } catch (e) {
      console.log("error in AutoSearch: ", e);
    }
  };

  /// useEffect
  useEffect(() => {
    clearTimeout(autoCompleteRef.current);

    autoCompleteRef.current = setTimeout(async () => {
      autocompleteHandler(testSearch);
    }, 1000);
  }, [testSearch]);

  useEffect(() => {
    const allowedRoutes = [
      "/PriceHistory",
      "/RestockOrder",
      "/discountquery",
      "/generate",
      "/createboxopenapproval",
      "/productRemoval",
    ];

    if (allowedRoutes.includes(location.pathname)) {
      setIsSearchVisible(true);
    } else {
      setIsSearchVisible(false);
    }
  }, [location]);

  return (
    <StyledAppBar sx={{}}>
      <StyledToolbar>
        <Icon alignItems={"center"}>
          <Link to="/">
            <Box
              sx={{
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
          </Link>
        </Icon>

        {isSearchVisible ? (
          <Box
            sx={{
              width: "40rem",
              position: "relative",
            }}
          >
            <StyledAppBar>
              <StyledInputbase
                placeholder="Product Search"
                value={testSearch}
                onChange={(e) => {
                  setTestSearch(e.target.value);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => {
                        setSearchResults([]);
                        if (testSearch.length) {
                          dispatch(setSearchTerm(testSearch));
                        }
                      }}
                    >
                      <SearchOutlinedIcon sx={{ color: "black" }} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </StyledAppBar>
            <Collapse
              in={searchResults.length > 0 || autoCompleteLoading} // Show search results only if there are results
              sx={{
                position: "absolute",
                backgroundColor: "#eeee",
                color: "#000",
                top: "",
                width: " 100%",
                paddingX: "1rem",
                paddingTop: ".5rem",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                maxHeight: "25rem",
                overflow: "auto",
                borderRadius: "20px",
              }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => {
                  return (
                    <div key={index}>
                      <Link
                        onClick={() => setOpenSearchBox(false)}
                        to={`/OneProductDetails/${item.SKU}`}
                        style={{
                          color: "black",
                          listStyle: "none",
                        }}
                      >
                        <Box
                          sx={{
                            padding: ".5rem",
                            "&:hover": { backgroundColor: "#3377FF" },
                            transition: ".3s",
                          }}
                        >
                          {item.Name}
                        </Box>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </Collapse>
          </Box>
        ) : (
          ""
        )}

        <Icon>
          <Box>
            <FormControlLabel
              control={
                <MaterialUISwitch
                  // defaultChecked={!isChecked}
                  checked={isChecked}
                  onChange={handleSwitchChange}
                  name="muiSwitch"
                  color="primary"
                />
              }
            />
          </Box>
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
                  handleClick(event);
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
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              style={{ marginTop: "40px" }}
            >
              {renderMenuItems(unApprovedData)}
            </Menu>
          </div>
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
            onClick={handle_log_open}
          />
        </Icon>
      </StyledToolbar>

      <Menu
        id="demo-positioned-menu"
        anchorEl={anchorEl}
        open={log_open}
        onClose={handle_log_open}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ marginTop: "40px" }}
      >
        <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>

        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </StyledAppBar>
  );
};

export default Navbar;
