import "./App.css";
import PrivateRoute from "./middleware/PrivateRoute";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createTheme, Box } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useSelector, useDispatch } from "react-redux";
import Order from "./Pages/Orders/Order";
import OrderDetails from "./Pages/Orders/OrderDetails";
import UpdateSellerPriceBulk from "./Pages/UpdateSellerPrice/UpdateSellerPriceBulk";
import UpdateSellerPrice from "./Pages/UpdateSellerPrice/UpdateSellerPrice";
import NoPageFound from "./Pages/NoPageFound/NoPageFound";
import CreateRestockOrder from "./Pages/CreateRestockOrder/CreateRestockOrder";
import MyAccount from "./Pages/MyAccount/MyAccount";
import Login from "./components/Login/Login";
import Profile from "./Pages/Profile_Page/Profile";
import AllSellers from "./Pages/AllSellers/AllSellers";
import SellerVerification from "./Pages/SellerVerification/SellerVerification";
import AllSellerOrder from "./Pages/AllSellers/AllSellerComponent/AllSellerOrderList";
import ChangePassword from "./components/Profile/ChangePassword";
import ForgetPassword from "./components/Login/ForgetPassword";
import ResetPassword from "./components/Login/ResetPassword";
import Users from "./Pages/Users/Users";
import Home_page from "./Pages/Home_Page/Home_Page";
import Loading from "./components/Common/Loading";
import OneProductDetails from "./Pages/OneProduct/OneProductDetails";
import ProductStatus from "./Pages/ProductStatus/ProductStatus";
import UploadImageCom from "./Pages/UploadImage/UploadImageCom";
import UserRole from "./middleware/UserRole";
import RestockOrderList from "./Pages/RestockOrderList/RestockOrderList";
import OneRestockOrder from "./Pages/RestockOrderList/component/OneRestockOrder";
import OverseasOrder from "./Pages/OverseasOrderList/OverseasOrder";
import OverSeasOrderProductGrid from "./Pages/OverseasOrderList/Components/OverSeasOrderProductGrid";
import Verify from "./Pages/Barcode/Verify";
import BarcodeGenerate from "./Pages/Barcode/BarcodeGenerate";
import BarcodeHistory from "./Pages/Barcode/component/BarcodeHistory";
import Dispatch_Return from "./Pages/Barcode/Dispatch_Return";
import Approval from "./Pages/Approval/Approval";
import PriceHistroyMain from "./Pages/PriceHistory/PriceHistroyMain";
import DiscountQuery from "./Pages/DiscountQuery/DiscountQuery";
import ViewQuery from "./Pages/DiscountQuery/ViewQuery";
import AdminDiscountQuery from "./Pages/DiscountQuery/AdminDiscountQuery";
import Compare from "./Pages/Compare/Compare";
import Calc from "./Pages/Calc/Calc";
import PriceComparisonOrder from "./Pages/CreateRestockOrder/Component/PriceComparisonOrder";
import Logistics from "./Pages/Logistics/Logistics";
import AddRoboProducts from "./Pages/AddProduct/AddProduct";
import SubSerialNumber from "./Pages/Barcode/component/SubSerialNumber";
import { useNavigate } from "react-router-dom";
import OneInwardLogistics from "./Pages/Logistics/Components/OneInwardLogistics";
import LogisticsList from "./Pages/Logistics/Components/LogisticsList";
import LandingPage from "./Pages/LandingPage/Landing";
import irsLogo from "../public/irs.png";
import {
  addOnlineUsers,
  addLiveStatus,
  addLiveWholeSaleStatus,
  addOnlineWholeSaleUsers,
} from "./features/slice/authSlice";
import { useSocket } from "./CustomProvider/useWebSocket";
import { onMessage, getToken } from "firebase/messaging"; // Import necessary functions from Firebase messaging
import { messaging } from "./firebase";
import { logout } from "./features/slice/authSlice";
import { useLogoutMutation } from "./features/api/usersApiSlice";
import AddBoxDetails from "./Pages/Logistics/Components/AddBoxDetails";
import SellerDetails from "./Pages/SellerDetails/SellerDetails";
import AddBrand from "./Pages/AddBrand/AddBrand";
import AddCustomer from "./Pages/Barcode/component/AddCustomer";
import addNotification from "react-push-notification";
import CalcEdit from "./Pages/Calc/CalcEdit";
import OpenBox from "./Pages/OpenBox/OpenBox";
import OpenBoxHistory from "./Pages/OpenBox/OpenBoxHistory";
import OpenBoxList from "./Pages/OpenBox/OpenBoxList";
import CreateTask from "./Pages/UserTask/CreateTask";
import ViewTask from "./Pages/UserTask/ViewTask";
import Testing from "./Pages/Testing Component/Component/Testing";
import ERPHistory from "./Pages/ERPHistory/ERPHistory";
import CreateBoxOpenApproval from "./Pages/OpenBox/CreateBoxOpenApproval";
import OpenBoxApprovalStatus from "./Pages/OpenBox/OpenBoxApprovalStatus";
import Shipment from "./Pages/SellerDetails/components/Shipment";
import ProductShipment from "./Pages/Logistics/Components/ProductShipment";
import ShipmentMain from "./Pages/SellerDetails/ShipmentMain";
import OverseasOrderBoxes from "./Pages/OverseasOrderList/Components/OverseasOrderBoxes";
import OverseasShipment from "./Pages/OverseasOrderList/Components/OverseasShipment";
import OneOverseasShipment from "./Pages/OverseasOrderList/Components/OneOverseasShipment";
import AllOverseasShipment from "./Pages/OverseasOrderList/Components/AllOverseasShipment";
import DynamicInputs from "./Pages/DSC/DynamicInputs";
import OneDynamicInput from "./Pages/DSC/OneDynamicInput";
import RepairForm from "./Pages/DSC/RepairForm";
import NewProductApproval from "./Pages/AddProduct/NewProductApproval";
import ChangeProductApproval from "./Pages/AddProduct/ChangeProductApproval";
import RemoveProductGrid from "./Pages/ProductDelete/RemoveProductGrid";
import ModelInputMain from "./Pages/DSC/ModelInputMain";
import AddCommonRepair from "./Pages/DSC/AddCommonRepair";
import DscFormView from "./Pages/DSC/DscFormView";
import DSCFormList from "./Pages/DSC/DSCFormList";
import RestockBox from "./Pages/RestockOrderList/component/RestockBox";
import SignaturePad from "./Pages/DSC/Components/SignaturePadDialog";
import CustomerForm from "./Pages/DSC/Components/CustomerForm";
import AssetsMain from "./Pages/Assets/AssetsMain";
import AddProforma from "./Pages/Proforma Track/AddProforma";
import ScanAssetsCode from "./Pages/Assets/components/ScanAssetsCode";
import ProformaList from "./Pages/Proforma Track/ProformaList";
import ProformaDetails from "./Pages/Proforma Track/ProformaDetails";
import WhatsappEvent from "./Pages/WhatsApp/WhatsappEvent";
import BulkAddProduct from "./Pages/AddProduct/BulkAddProduct";
import NewCalc from "./Pages/Calc/NewCalc";
import NewCalcRishabh from "./Pages/Calc/NewCalcRishabh";
import RemovedProduct from "./Pages/ProductDelete/RemovedProducts";

function App() {
  /// initialize
  const dispatch = useDispatch();
  const socket = useSocket();
  const navigate = useNavigate();

  /// global state
  const { isAdmin, userInfo } = useSelector((state) => state.auth);
  const Mode = useSelector((state) => state.ui.Mode);

  /// local state
  const [registrationToken, setRegistrationToken] = useState("");
  const [mode, setMode] = useState("light");

  /// Push Notification
  const pushNotification = (title, data, navigateTo) => {
    addNotification({
      title: title,
      subtitle: data.time,
      message: data.message,
      duration: 30000,
      icon: irsLogo,
      native: true,
      onClick: () => {
        navigate(navigateTo);
      },
    });
  };

  /// webSocket Event Handlers

  // OnMessage
  const handleNewMessage = (data) => {
    console.log("Handling new message:", data);
  };

  //onlineUsers

  const handleOnlineUsers = (data) => {
    const userIds = Object.keys(data);

    dispatch(addOnlineUsers([...userIds]));
  };
  // online WholeSalUsers
  const handleOnlineWholeSaleUsers = (data) => {
    const userIds = Object.keys(data);

    dispatch(addOnlineWholeSaleUsers([...userIds]));
  };
  // liveStatusClient
  const handleLiveStatus = (data) => {
    dispatch(addLiveStatus(data));

    pushNotification("LiveStatus", data, "/UpdateSellerPrice");
  };

  // liveWholeSaleStatusClient
  const handleLiveWholeSaleStatus = (data) => {
    dispatch(addLiveWholeSaleStatus(data));
    pushNotification("Live WholeSeller Status", data, "/UpdateSellerPrice");
  };

  /// webSocket Events

  useEffect(() => {
    if (socket) {
      if (isAdmin) {
        // emitting events to get online Wholesale users
        socket.emit("getOnlineWholeSaleUsers", "true");

        // Listen for the 'onMessage' event
        socket.on("onMessage", (data) => {
          // console.log("Received Event onMessage for Admin :", data);
          handleNewMessage(data);
        });

        // Listen for the 'onlineUsers' event
        socket.on("onlineUsers", (data) => {
          // console.log('Received Event onlineUsers for Admin :', data);

          handleOnlineUsers(data);
        });
        // Listen for the 'onlineWholeSaleUsers' event
        socket.on("onlineWholeSaleUsers", (data) => {
          // console.log('Received Event onlineWholeSaleUsers for Admin :', data);

          handleOnlineWholeSaleUsers(data);
        });

        // Listen for the 'liveStatusClient' event
        socket.on("liveStatusClient", (data) => {
          // console.log('Received Event liveStatusClient for Admin :', data);

          handleLiveStatus(data);
        });
        // Listen for the 'liveWholeSaleStatus' event
        socket.on("WholeSaleSeller", (data) => {
          // console.log('Received Event liveWholeSaleStatus for Admin :', data);

          handleLiveWholeSaleStatus(data);
        });
      }

      /// events for all
      // Listen for the 'logout' event
      socket.on("userLogout", (data) => {
        const userId = data.userId;
        const currentUserId = userInfo?.adminId;
        if (userId === currentUserId) {
          console.log("logout");
          handleLogout();
        }
      });
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket]);

  /// rtk query
  // const { data: getAllUserApi } = useGetAllUsersQuery();
  // const { data: getAllWholeSellers } = useGetAllSellerQuery();
  const [logoutApi, { error }] = useLogoutMutation();

  useEffect(() => {
    setMode(Mode === true ? "dark" : "light");
  }, [Mode]);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // console.log("Notification permission granted.");
        // const messaging = getMessaging();
        getToken(messaging, {
          vapidKey:
            "BM3r8o8qHsrmxPGM2sHJUlabsSEs-EONb1wg4mOPrNi0r8JYi86BI85wqtWhduF3fdnsfhr8nu814QdYzCHj3VU",
        })
          .then((currentToken) => {
            // console.log("Current token:", currentToken); // Debug log.
            if (currentToken) {
              setRegistrationToken(currentToken);
            } else {
              console.log("No registration token available.");
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token.", err);
          });
      } else {
        console.log("Unable to get permission to notify.");
      }
    });

    onMessage(messaging, (payload) => {
      console.log("Message received.", payload);
      // Handle the received message here
    });
  }, []);

  ///Functoins
  const handleLogout = async () => {
    try {
      const res = await logoutApi().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("An error occurred during Navbar:", error);
    }
  };
  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(9, 41, 92)",
        light: "rgb(66, 135, 245)",
      },
      secondary: {
        main: "rgb(3, 99, 34)",
        light: "rgb(5, 158, 54)",
      },
      confirm: {
        main: "rgb(255,69,0)",
        light: "rgb(255,165,0)",
      },
      FontDark: {
        main: "#fff",
        dark: "#0000",
      },
      mode: mode,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        xxl: 1900,
      },
    },
  });

  return (
    <Box>
      <ToastContainer closeOnClick autoClose={1000} />

      <Box>
        <ThemeProvider theme={theme}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/testing" element={<Testing />} />
              <Route
                path="/login"
                element={<Login registrationToken={registrationToken} />}
              />
              <Route path="/forgetPassword" element={<ForgetPassword />} />
              <Route path="/createTask" element={<CreateTask />} />
              <Route
                path="/admin/resetPassword/:token"
                element={<ResetPassword />}
              />
              {/* Home Router. */}
              <Route path="*" element={<PrivateRoute nav={true} />}>
                {" "}
                <Route path="*" element={<NoPageFound />} />
              </Route>
              <Route path="/profile" element={<PrivateRoute nav={true} />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin Router */}
              <Route path="" element={<PrivateRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="product-list" element={<Home_page />} />
                <Route
                  path="/Users"
                  element={
                    <UserRole name={"Users"}>
                      <Users />
                    </UserRole>
                  }
                />
                <Route
                  path="/viewQuery/admin"
                  element={
                    <UserRole name={"View Query Admin"}>
                      <ViewQuery />
                    </UserRole>
                  }
                />
                <Route
                  path="/discountquery/:id"
                  element={<AdminDiscountQuery />}
                />
                <Route path="/viewAssets" element={<AssetsMain />} />
                <Route path="/scanAssets" element={<ScanAssetsCode />} />
                <Route path="/WhatsAppEvent" element={<WhatsappEvent />} />
                {/* Products Router */}
                <Route path="/addRoboProduct" element={<AddRoboProducts />} />
                <Route path="/bulkAddProduct" element={<BulkAddProduct />} />
                <Route path="/addBrand" element={<AddBrand />} />
                <Route
                  path="/UpdateSellerPrice"
                  element={
                    <UserRole name={"Update Product"}>
                      <UpdateSellerPrice />
                    </UserRole>
                  }
                />
                <Route
                  path="/UpdateSellerPriceBulk/:query"
                  element={<UpdateSellerPriceBulk />}

                />
                <Route
                  path="/ProductStatus"
                  element={
                    <UserRole name={"Product Status"}>
                      <ProductStatus />
                    </UserRole>
                  }
                />
                <Route
                  path="/PriceHistory"
                  element={
                    <UserRole name={"Price History"}>
                      <PriceHistroyMain />
                    </UserRole>
                  }
                />
                {/* WholeSale Buyer Router */}
                <Route
                  path="/AllSellerList"
                  element={
                    <UserRole name={"Sellers List"}>
                      <AllSellers />
                    </UserRole>
                  }
                />
                <Route
                  path="/sellerOrders/:id"
                  element={
                    <UserRole name={"Seller Orders"}>
                      <AllSellerOrder />
                    </UserRole>
                  }
                />
                <Route
                  path="/myAccount/:id"
                  element={
                    <UserRole name={"Sellers List"}>
                      <MyAccount />
                    </UserRole>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <UserRole name={"Seller Orders"}>
                      <Order />
                    </UserRole>
                  }
                />
                <Route
                  path="/SubSerialNumber"
                  element={
                    <UserRole name={"Sub Serial No"}>
                      <SubSerialNumber />
                    </UserRole>
                  }
                />
                <Route
                  path="/orderDetails/:id"
                  element={
                    <UserRole name={"Seller Orders"}>
                      <OrderDetails />{" "}
                    </UserRole>
                  }
                />
                <Route
                  path="/sellerVerify"
                  element={
                    <UserRole name={"Seller Req"}>
                      <SellerVerification />
                    </UserRole>
                  }
                />
                {/* Account Router */}
                <Route path="/OverseasOrder" element={<OverseasOrder />} />
                <Route
                  path="/OverseasOrderBoxes/:id"
                  element={<OverseasOrderBoxes />}
                />
                <Route
                  path="/OverseasShipment/:id"
                  element={<OverseasShipment />}
                />
                <Route
                  path="/OneOverseasShipment/:id"
                  element={<OneOverseasShipment />}
                />
                <Route
                  path="/allOverseasShipment"
                  element={<AllOverseasShipment />}
                />
                <Route
                  path="/RestockOrderList"
                  element={
                    <UserRole name={"Restock Order"}>
                      <RestockOrderList />
                    </UserRole>
                  }
                />
                <Route
                  path="/RestockOrderView"
                  element={
                    <UserRole name={"Restock Order View"}>
                      <RestockOrderList />
                    </UserRole>
                  }
                />
                <Route
                  path="/OrderSelection/:id"
                  element={<OneRestockOrder />}
                />
                <Route
                  path="/OverseasOrderlist/:id"
                  element={<OverSeasOrderProductGrid />}
                />
                <Route path="/RestockOrder" element={<CreateRestockOrder />} />
                <Route
                  path="/ComparisionOrder"
                  element={
                    <UserRole name={"Comparision Order"}>
                      <PriceComparisonOrder />
                    </UserRole>
                  }
                />
                <Route path="/compare/:id" element={<Compare />} />
                {/* Sales Router */}
                <Route
                  path="/uploadimage"
                  element={
               // We have removed User Role
                      <UploadImageCom />
                 
                  }
                />
                <Route path="/discountquery" element={<DiscountQuery />} />
                <Route
                  path="/viewQuery"
                  element={
                    <UserRole name={"View Query"}>
                      <ViewQuery />
                    </UserRole>
                  }
                />
                <Route
                  path="/OneProductDetails/:id"
                  element={<OneProductDetails />}
                />
                <Route path="/salesDetails" element={<SellerDetails />} />
                {/* Barcode Router */}
                <Route path="/generate" element={<BarcodeGenerate />} />
                <Route path="/verify" element={<Verify />} />
                <Route
                  path="/barcodeHistory"
                  element={
                    <UserRole name={"Barcode History"}>
                      <BarcodeHistory />
                    </UserRole>
                  }
                />
                <Route path="/addCustomer" element={<AddCustomer />} />
                {/* Logistics */}
                <Route path="/inwardLogistic" element={<Logistics />} />
                <Route path="/shipment" element={<ShipmentMain />} />
                <Route
                  path="/OneinwardLogistic/:id"
                  element={<OneInwardLogistics />}
                />
                <Route path="/logisticList" element={<LogisticsList />} />
                <Route path="/addBoxDetails/:id" element={<AddBoxDetails />} />
                <Route path="/calc" element={<Calc />} />
                {/* <Route path="/calc" element={<NewCalcRishabh />} /> */}
                <Route path="/savedCalc" element={<CalcEdit />} />
                <Route path="/calc/:id" element={<Calc />} />
                <Route path="/dispatch_Return" element={<Dispatch_Return />} />
                <Route path="/product-shipment" element={<ProductShipment />} />
                {/* Approval Router */}
                <Route path="/Approval/:query" element={<Approval />} />
                <Route
                  path="/NewProductApproval"
                  element={<NewProductApproval />}
                />
                <Route
                  path="/changeProductApproval"
                  element={<ChangeProductApproval />}
                />
                {/* Others Admin Profile Related Router */}
                <Route
                  path="/changepassword/:id"
                  element={<ChangePassword />}
                />
                {/* /// Box Open Routes */}
                <Route path="/boxopen" element={<OpenBox />} />
                <Route path="/openboxhistory" element={<OpenBoxHistory />} />
                <Route path="/openboxlist" element={<OpenBoxList />} />
                <Route
                  path="/createboxopenapproval"
                  element={<CreateBoxOpenApproval />}
                />
                <Route path="/RestockBox" element={<RestockBox />} />
                <Route
                  path="/boxapprovalstatus"
                  element={<OpenBoxApprovalStatus />}
                />
                {/* /// UserTask Routes */}
                <Route path="/viewTask" element={<ViewTask />} />
                {/* ///  ERP History */}
                <Route path="/erpHistory" element={<ERPHistory />} />
                {/* ///  ProductRemoval */}
                <Route path="/productRemoval" element={<RemoveProductGrid />} />
                {/* ///  Removed Product */}
                <Route path="/removedProduct" element={<RemovedProduct />} />
                {/* ///  DSC */}
                <Route path="/DynamicInputs" element={<ModelInputMain />} />
                <Route
                  path="/oneDynamicInput/:id"
                  element={<OneDynamicInput />}
                />
                <Route path="/droneRepair" element={<RepairForm />} />
                <Route path="/addCommonRepair" element={<AddCommonRepair />} />
                <Route path="/viewDSCForm/:token" element={<DscFormView />} />
                <Route path="/FormViewMain" element={<DSCFormList />} />
                <Route path="/signature" element={<SignaturePad />} />
                <Route path="/CustomerForm" element={<CustomerForm />} />
                /// Proforma
                <Route path="/AddProforma" element={<AddProforma />} />
                <Route path="/ProformaList" element={<ProformaList />} />
                <Route path="/ProformaDetails" element={<ProformaDetails />} />
              </Route>
            </Routes>
          </Suspense>
        </ThemeProvider>
      </Box>
    </Box>
  );
}

export default App;
