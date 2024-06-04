import { React, useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Collapse,
  InputAdornment,
  CircularProgress,
  InputBase,
  IconButton,
  Box,
  Button,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WeightTable from './Component/WeightTable';
import PriceTable from './Component/PriceTable';
import CommonInput from './Component/CommonInput';
import ShippingTable from './Component/ShippingTable';
import FinalCalcTable from './Component/FinalCalcTable';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SubtotalCalc from './Component/SubtotalCalc';
import OtherCharges from './Component/OtherChargesTable';
import { formatIndianPrice } from '../../commonFunctions/commonFunctions';
import { useUpdateProductsColumnMutation } from '../../features/api/productApiSlice';
import {
  useGetProductBySearchQuery,
  useAddCalcMutation,
  useGetCalcByIdQuery,
  useUpdateCalcMutation,
} from '../../features/api/productApiSlice';
import { useSocket } from '../../CustomProvider/useWebSocket';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Common/Loading';
import Header from '../../components/Common/Header';
import InfoDialogBox from '../../components/Common/InfoDialogBox'; 
import { setHeader, setInfo } from '../../features/slice/uiSlice';
import { useAddPriceHistoryMutation } from '../../features/api/PriceHistoryApiSlice';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// infoDialog box data
const infoDetail = [
  {
    name: 'Save',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/save_costCalculator.png?updatedAt=1703223683718'
        height={'50%'}
        width={'50%'}
      />
    ),   
    instruction:
      "If you click 'View,' you can save the price for that particular price list",
  },
  {
    name: 'Search',
    screenshot: (
      <img
        src='https://ik.imagekit.io/z7h0zeety/Admin-Portal/Info%20SS%20images/calcSearch.png?updatedAt=1717389087947'
        height={'50%'}
        width={'50%'}
      />
    ),
    instruction: '',
  },
];

const StyleButton = styled('button')(({ theme }) => ({
  background: '#85A6ff',
  color: '#fff',
  height: '2rem',
  marginTop: '1.2rem',
  borderRadius: '10px',
  padding: '0 12px',
  border: 'none',

  '&:hover': {
    // corrected the selector
    background: '#B3CBFF',
    boxShadow:
      'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
  },
  cursor: 'pointer',
}));

const StyledInputbase = styled(InputBase)(({ theme }) => ({
  borderRadius: '10px',
  input: {
    '&:hover': {
      color: 'rgb(15, 126, 252)',
    },
  },
  width: '100%',
  background: theme.palette.mode === 'dark' ? 'grey' : '#fff',
  color: theme.palette.mode === 'dark' ? '#fff' : 'black',
}));

const StyleCollapse = styled(Collapse)(({ theme }) => ({
  position: 'absolute',
  width: ' 60%',
  paddingX: '1rem',
  paddingTop: '.5rem',
  boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  maxHeight: '25rem',
  overflow: 'auto',
  zIndex: '100',

  background: theme.palette.mode === 'dark' ? 'grey' : '#eee',
  color: theme.palette.mode === 'dark' ? '#fff' : 'black',
}));

const Calc = () => {
  // infodialog state
  const description1 =
    'This is a Price Calculator where you can calculate the price ';

  const dispatch = useDispatch();
  const [addpriceHistory, { isLoading: addpriceHistoryLoading }] =
    useAddPriceHistoryMutation();

  const { isInfoOpen } = useSelector((state) => state.ui);
  const handleClose1 = () => {
    dispatch(setInfo(false));
  };

  useEffect(() => {
    dispatch(setHeader(`Price Calculator`));
  }, []);

  /// intialize
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const isInitialCheck = useRef();

  /// rtk query
  const { data, isLoading, isError, refetch } = useGetProductBySearchQuery();
  const [updateCalcApi, { isLoading: updateLoading }] = useUpdateCalcMutation();
  const { data: oneCalcData, isLoading: oneCalcLoading } = useGetCalcByIdQuery(
    id,
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );
  const [addCalcApi, { isLoading: addCalcLoading }] = useAddCalcMutation();
  const [updateProductsApi, { isLoading: updateProductLoading }] =
    useUpdateProductsColumnMutation();

  /// global state
  const {
    isAdmin,
    productColumns,
    userInfo,
    hiddenColumns: latestHiddenColumns,
  } = useSelector((state) => state.auth);

  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [searchValue, setSearchvalue] = useState([]);
  const [rows, setRows] = useState([]);

  const handleToggle = () => {
    setOpenSearchBox(!openSearchBox);
    // setSearchHeight(!searchHeight);
  };

  //Search function

  const handleItemClick = (item) => {
    isInitialCheck.current = true;
    const isExist = rows.find((row) => row.SKU === item.SKU);
    if (isExist) {
      return;
    }
    setIsEdited(true);
    setRows([...rows, item]);

    setGstPer({ ...gstPer, [item.SKU]: item.GST });
  };
  const handleDeleteTextField = (rowIndex) => {
    const updatedRows = [...rows];
    updatedRows.splice(rowIndex, 1);
    setRows(updatedRows);
  };

  // search functionality
  const [testSearch, setTestSearch] = useState('');
  const filteredData = data?.data.filter(
    (item) =>
      item.Name?.toLowerCase().includes(testSearch?.toLowerCase()) ||
      item.SKU?.toLowerCase().includes(testSearch?.toLowerCase())
  );

  /// local state

  const [step, setStep] = useState(0);
  const [openSave, setOpenSave] = useState(false);
  const [calcId, setCalcId] = useState('');
  const [description, setDescription] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [open, setOpen] = useState(false);

  // weight state
  const [qty, setQty] = useState({});
  const [dimensions, setDimensions] = useState({});
  const [unit, setUnit] = useState('cm');
  const [WeightUnit, setWeightUnit] = useState('gm');
  const [Courier, setCourier] = useState('cargo');
  const [volumeWeight, setVolumeWeight] = useState({});
  const [actualWeight, setActualWeight] = useState({});
  const [weightCompare, setWeightCompare] = useState({});
  const [totalWeight, setTotalWeight] = useState({});
  const [subTotalWeight, setSubTotalWeight] = useState(null);
  const [totalVolumeWeight, setTotalVolumeWeight] = useState(null);
  const [totalActualWeight, setTotalActualWeight] = useState(null);
  const [volumeWeightRatio, setVolumeWeightRatio] = useState({});
  const [extraWeight, setExtraWeight] = useState('');
  const [extraWeightIntoRatio, setExtraWeightIntoRatio] = useState({});
  const [finalWeight, setFinalWeight] = useState({});
  const [subTotalFinalWeight, setSubTotalFinalWeight] = useState(null);

  // price state
  const [usdPrice, setUsdPrice] = useState({});
  const [rmbPrice, setRMBPrice] = useState({});
  const [totalUsdPrice, setTotalUsdPrice] = useState({});
  const [subTotalUsdPrice, setSubTotalUsdPrice] = useState(null);
  const [usdPriceRatio, setUsdPriceRatio] = useState({});
  const [conversionRateBOE, setConversionRateBOE] = useState('');
  const [conversionRatePayment, setConversionRatePayment] = useState('');
  const [indianRateBoe, setIndianRateBoe] = useState({});
  const [subTotalIndianRateBoe, setSubTotalIndianRateBoe] = useState(null);
  const [indianRatePayment, setIndianRatePayment] = useState({});
  const [subTotalIndianRatePayment, setSubTotalIndianRatePayment] =
    useState(null);
  const [paymentTermCommon, setPaymentTermCommon] = useState('fob');
  const [frieghtCommon, setFrieghtCommon] = useState('');
  const [frieghtValueCommon, setFrieghtValueCommon] = useState('');
  const [frieght, setFrieght] = useState({});
  const [subTotalFrieght, setSubTotalFrieght] = useState(null);
  const [insurance, setInsurance] = useState({});
  const [insuranceCommon, setInsuranceCommon] = useState('');
  const [subTotalInsurance, setSubTotalInsurance] = useState(null);
  const [basicDutyPer, setBasicDutyPer] = useState({});
  const [basicDutyValue, setBasicDutyValue] = useState({});
  const [subTotalBasicDuty, setSubTotalBasicDuty] = useState(null);
  const [swChargeCommon, setSwChargeCommon] = useState('');
  const [swCharge, setSwCharge] = useState({});
  const [landingForOtherValueCommon, setLandingForOtherValueCommon] =
    useState('');
  const [landingForOtherValue, setLandingForOtherValue] = useState({});
  const [lateFee, setLateFee] = useState('');
  const [lateFeeValue, setLateFeeValue] = useState({});
  const [assesableValue, setAssesableValue] = useState({});
  const [subTotalAssesable, setSubTotalAssesable] = useState(null);
  const [gstPer, setGstPer] = useState({});
  const [gstRate, setGstRate] = useState({});
  const [subTotalGstRate, setSubTotalGstRate] = useState(null);
  const [cdTotal, setCdTotal] = useState({});
  const [subCdTotal, setSubCdTotal] = useState(null);

  // shipping state
  const [ShippingFee, setShippingFee] = useState('');
  const [gstOnShipping, setGstOnShipping] = useState('');
  const [shippingValue, setShippingValue] = useState({});
  const [shippingGstValue, setShippingGstValue] = useState({});
  const [totalShipping, setTotalShipping] = useState({});
  const [subTotalShipping, setSubtotalShipping] = useState(null);

  // other Charges
  const [regularBillentry, setRegularBillentry] = useState('');
  const [warehouseCharge, setWarehouseCharge] = useState('');
  const [bankCharge, setBankCharge] = useState('');
  const [otherCharge, setOtherCharge] = useState('');
  const [regularBillentryValue, setRegularBillentryValue] = useState({});
  const [warehouseChargeValue, setWarehouseChargeValue] = useState({});
  const [bankChargeValue, setBankChargeValue] = useState({});
  const [otherChargeValue, setOtherChargeValue] = useState({});
  const [totalOtherCharge, setTotalOtherCharge] = useState({});
  const [subTotalOtherCharge, setSubTotalOtherCharge] = useState(null);

  // finalClac state

  const [finalTotal, setFinalTotal] = useState({});
  const [subFinalTotal, setSubFinalTotal] = useState(null);
  const [finalTotalExcludeGst, setFinalTotalExcludeGst] = useState({});
  const [subFinalTotalExcludeGst, setSubFinalTotalExcludeGst] = useState(null);
  const [finalGst, setFinalGst] = useState({});
  const [subFinalGst, setSubFinalGst] = useState(null);
  const [finalLandingCostExGst, setFinalLandingCostExGst] = useState({});
  const [subFinalLandingCostExGst, setSubFinalLandingCostExGst] =
    useState(null);
  const [finalLandingCost, setFinalLandingCost] = useState({});
  const [landingCost, setLandingCost] = useState({});
  const [subLandingCost, setSubLandingCost] = useState(null);
  const [landingCostExGst, setLandingCostExGst] = useState({});
  const [subLandingCostExGst, setSubLandingCostExGst] = useState(null);

  /// handlers

  // handles to open view sub total dialogue and close

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValueChange = (type, sku, value, dimensionType) => {
    setIsEdited(true);
    isInitialCheck.current = true;
    if (type === 'qty') {
      setQty({ ...qty, [sku]: value });
    }
    if (type === 'dimensions') {
      setDimensions({
        ...dimensions,
        [sku]: { ...dimensions[sku], [dimensionType]: value },
      });
    }
    if (type === 'unit') {
      setUnit(value);
    }
    if (type === 'paymentTermCommon') {
      setPaymentTermCommon(value);
      if (value === 'cif') {
        setInsuranceCommon(0);
        setFrieghtCommon(0);
      }
    }
    if (type === 'WeightUnit') {
      setWeightUnit(value);
    }
    if (type === 'Courier') {
      setCourier(value);
    }
    if (type === 'extraWeight') {
      setExtraWeight(value);
    }
    if (type === 'actualWeight') {
      setActualWeight({ ...actualWeight, [sku]: value });
    }
    if (type === 'usdPrice') {
      setUsdPrice({ ...usdPrice, [sku]: value });
    }
    if (type === 'rmbPrice') {
      setRMBPrice({ ...rmbPrice, [sku]: value });
    }
    if (type === 'ratePayment') {
      setConversionRatePayment(value);
    }
    if (type === 'rateBoe') {
      setConversionRateBOE(value);
    }
    if (type === 'frieghtCommon') {
      setFrieghtCommon(value);
    }
    if (type === 'frieghtValueCommon') {
      setFrieghtValueCommon(value);
    }
    if (type === 'landingOtherValueCommon') {
      setLandingForOtherValueCommon(value);
    }
    if (type === 'lateFee') {
      setLateFee(value);
    }
    if (type === 'swCharge') {
      setSwChargeCommon(value);
    }
    if (type === 'basicDutyPer') {
      setBasicDutyPer({
        ...basicDutyPer,
        [sku]: value,
      });
    }
    if (type === 'gstPer') {
      setGstPer({
        ...gstPer,
        [sku]: value,
      });
    }
    if (type === 'ShippingFee') {
      setShippingFee(value);
    }
    if (type === 'gstOnShipping') {
      setGstOnShipping(value);
    }
    if (type === 'regularBillentry') {
      setRegularBillentry(value);
    }
    if (type === 'warehouseCharge') {
      setWarehouseCharge(value);
    }
    if (type === 'bankCharge') {
      setBankCharge(value);
    }
    if (type === 'otherCharge') {
      setOtherCharge(value);
    }
    if (type === 'insuranceCommon') {
      setInsuranceCommon(value);
    }
  };

  // handlers to save data

  const handleSaveCalcData = async (isToast) => {
    try {
      const params = {
        CalcId: calcId,
        description: description,
        Product: rows,
        weightState: {
          qty,
          dimensions,
          unit,
          WeightUnit,
          Courier,
          volumeWeight,
          actualWeight,
          weightCompare,
          totalWeight,
          subTotalWeight,
          totalVolumeWeight,
          totalActualWeight,
          volumeWeightRatio,
          extraWeight,
          extraWeightIntoRatio,
          finalWeight,
          subTotalFinalWeight,
        },
        priceState: {
          usdPrice,
          rmbPrice,
          totalUsdPrice,
          subTotalUsdPrice,
          usdPriceRatio,
          conversionRateBOE,
          conversionRatePayment,
          indianRateBoe,
          subTotalIndianRateBoe,
          indianRatePayment,
          subTotalIndianRatePayment,
          frieghtCommon,
          frieghtValueCommon,
          frieght,
          subTotalFrieght,
          insurance,
          basicDutyPer,
          basicDutyValue,
          subTotalBasicDuty,
          swChargeCommon,
          swCharge,
          insuranceCommon,
          subTotalInsurance,
          paymentTermCommon,
          landingForOtherValueCommon,
          landingForOtherValue,
          lateFee,
          lateFeeValue,
          assesableValue,
          subTotalAssesable,
          gstPer,
          gstRate,
          subTotalGstRate,
          cdTotal,
          subCdTotal,
        },
        shippingState: {
          ShippingFee,
          gstOnShipping,
          shippingValue,
          shippingGstValue,
          totalShipping,
          subTotalShipping,
        },
        otherChargeState: {
          regularBillentry,
          warehouseCharge,
          bankCharge,
          otherCharge,
          regularBillentryValue,
          warehouseChargeValue,
          bankChargeValue,
          otherChargeValue,
          totalOtherCharge,
          subTotalOtherCharge,
        },
        finalCalcTotal: {
          finalTotal,
          subFinalTotal,
          finalTotalExcludeGst,
          subFinalTotalExcludeGst,
          finalGst,
          subFinalGst,
          finalLandingCostExGst,
          subFinalLandingCostExGst,
          finalLandingCost,
          landingCost,
          subLandingCost,
          landingCostExGst,
          subLandingCostExGst,
        },
      };

      if (id) {
        if (!isEdited) {
          if (isToast) {
            return;
          }
          toast.success('no Changes detected');
          return;
        }
        const res = await updateCalcApi({ id: id, data: { data: params } });

        if (isToast) {
          toast.success('Upated Successfully');
        }
      } else {
        if (!calcId) {
          toast.error('Please enter a unique id for identification');
          return;
        }
        if (!description) {
          toast.error('Please enter a description');
          return;
        }

        const res = await addCalcApi({ data: params }).unwrap();

        toast.success(' Data Saved Successfully');
        setOpenSave(false);
        console.log(res);
        navigate(`/calc/${res.data['_id']}?replace=true`);
      }

      setIsEdited(false);
    } catch (err) {
      console.log('Error at add Calc');
      console.log(err);
    }
  };
  //function for Price History
  const matchSKUs = (usdPrice, rmbPrice, qty) => {
    let skus = [];

    if (!usdPrice) {
      skus = Object.keys(rmbPrice);
    } else {
      skus = Object.keys(usdPrice);
    }

    const matchedProducts = [];

    skus.forEach((sku) => {
      if (rmbPrice[sku] !== undefined && qty[sku] !== undefined) {
        matchedProducts.push({
          SKU: sku,
          priceHistory: [
            {
              RMB: rmbPrice[sku],
              USD: usdPrice[sku],
              Quantity: qty[sku],
              conversionRate:
                rmbPrice[sku] > usdPrice[sku]
                  ? rmbPrice[sku] / usdPrice[sku]
                  : usdPrice[sku] / rmbPrice[sku],
            },
          ],
        });
      }
    });

    return matchedProducts;
  };

  const handleSyncLandingCost = async () => {
    try {
      const result = [];

      for (const sku in landingCostExGst) {
        if (landingCostExGst.hasOwnProperty(sku)) {
          result.push({
            SKU: sku,
            value: Math.ceil(landingCostExGst[sku] || 0),
          });
        }
      }
      const filteredArray = result.filter((item) => {
        const matchingItem = rows.find(
          (secondItem) => secondItem.SKU === item.SKU
        );
        return (
          item.value !== 0 &&
          (!matchingItem || item.value !== matchingItem.LandingCost)
        );
      });

      if (!filteredArray.length) {
        return;
      }

      const matchedProducts = matchSKUs(usdPrice, rmbPrice, qty);

      const params = {
        type: 'LandingCost',
        body: { products: filteredArray },
      };
      const res = await updateProductsApi(params).unwrap();
      const res1 = await addpriceHistory(matchedProducts).unwrap();
      handleSaveCalcData(true);
      toast.success('Landing Cost Synced Successfully');
      const liveStatusData = {
        message: `${userInfo.name} updated LandingCost of ${filteredArray
          .map((product) => `${product.SKU} to ${product.value}`)
          .join(', ')} `,
        time: new Date(),
      };
      setTimeout(() => {
        socket.emit('liveStatusServer', liveStatusData);
      }, [2000]);
    } catch (err) {
      console.log('Error at sync Landing Cost in Calc');
      console.log(err);
    }
  };

  const handleSyncOneLandingCost = async (
    SKU,
    currentLandingCost,
    NewLandingCost,
    RMB,
    USD,
    QTY
  ) => {
    try {
      if (!NewLandingCost) {
        toast.error('Landing Cost is not available');
        return;
      }
      if (currentLandingCost === Math.ceil(NewLandingCost)) {
        toast.success('Landing Cost already Synced');
        return;
      }

      const params = {
        type: 'LandingCost',
        body: { products: [{ SKU: SKU, value: Math.ceil(NewLandingCost) }] },
      };
      const value = [
        {
          SKU: SKU,
          priceHistory: [
            {
              conversionRate: RMB > USD ? +RMB / +USD : +USD / +RMB,
              Quantity: +QTY,
              RMB: +RMB,
              USD: +USD,
            },
          ],
        },
      ];
      const res = await updateProductsApi(params).unwrap();
      const res1 = await addpriceHistory(value).unwrap();
      handleSaveCalcData(true);
      toast.success(`${SKU} Landing Cost updated successfully`);
      const liveStatusData = {
        message: `${userInfo.name} updated LandingCost of ${SKU} to ${Math.ceil(
          NewLandingCost
        )}`,
        time: new Date(),
      };
      setTimeout(() => {
        socket.emit('liveStatusServer', liveStatusData);
      }, [2000]);
    } catch (err) {
      console.log('Error at sync One Landing Cost');
    }
  };
  /// useEffect

  useEffect(() => {
    if (!id) {
      resetToDefault();
    }
    return () => {
      setRows([]);
    };
  }, [id]);

  // useEffect to set inital state of existing Calc data
  useEffect(() => {
    if (id && oneCalcData?.success) {
      setRows(oneCalcData.data.Product);
      // weight
      setQty(oneCalcData.data.weightState.qty || {});
      setDimensions(oneCalcData.data.weightState.dimensions || {});
      setUnit(oneCalcData.data.weightState.unit || 'cf');
      setWeightUnit(oneCalcData.data.weightState.WeightUnit || 'gm');
      setCourier(oneCalcData.data.weightState.Courier || 'cargo');
      setVolumeWeight(oneCalcData.data.weightState.volumeWeight || {});
      setActualWeight(oneCalcData.data.weightState.actualWeight || {});
      setWeightCompare(oneCalcData.data.weightState.weightCompare || {});
      setTotalWeight(oneCalcData.data.weightState.totalWeight || {});
      setSubTotalWeight(oneCalcData.data.weightState.subTotalWeight || null);
      setTotalVolumeWeight(
        oneCalcData.data.weightState.totalVolumeWeight || null
      );
      setTotalActualWeight(
        oneCalcData.data.weightState.totalActualWeight || null
      );
      setVolumeWeightRatio(
        oneCalcData.data.weightState.volumeWeightRatio || {}
      );
      setExtraWeight(oneCalcData.data.weightState.extraWeight || '');
      setExtraWeightIntoRatio(
        oneCalcData.data.weightState.extraWeightIntoRatio || {}
      );
      setFinalWeight(oneCalcData.data.weightState.finalWeight || {});
      setSubTotalFinalWeight(
        oneCalcData.data.weightState.subTotalFinalWeight || null
      );

      // price
      setUsdPrice(oneCalcData.data.priceState.usdPrice || {});
      setRMBPrice(oneCalcData.data.priceState.rmbPrice || {});
      setTotalUsdPrice(oneCalcData.data.priceState.totalUsdPrice || {});
      setSubTotalUsdPrice(oneCalcData.data.priceState.subTotalUsdPrice || null);
      setUsdPriceRatio(oneCalcData.data.priceState.usdPriceRatio || {});
      setConversionRateBOE(oneCalcData.data.priceState.conversionRateBOE || '');
      setConversionRatePayment(
        oneCalcData.data.priceState.conversionRatePayment || ''
      );
      setIndianRateBoe(oneCalcData.data.priceState.indianRateBoe || {});

      setSubTotalIndianRateBoe(
        oneCalcData.data.priceState.subTotalIndianRateBoe || null
      );
      setIndianRatePayment(oneCalcData.data.priceState.indianRatePayment || {});
      setSubTotalIndianRatePayment(
        oneCalcData.data.priceState.subTotalIndianRatePayment || null
      );
      setPaymentTermCommon(
        oneCalcData.data.priceState.paymentTermCommon || 'fob'
      );
      setInsuranceCommon(oneCalcData.data.priceState.insuranceCommon || '');
      setFrieghtCommon(oneCalcData.data.priceState.frieghtCommon || '');
      setFrieghtValueCommon(
        oneCalcData.data.priceState.frieghtValueCommon || ''
      );
      setFrieght(oneCalcData.data.priceState.frieght || {});
      setSubTotalFrieght(oneCalcData.data.priceState.subTotalFrieght || null);
      setInsurance(oneCalcData.data.priceState.insurance || {});
      setSubTotalInsurance(
        oneCalcData.data.priceState.subTotalInsurance || null
      );
      setBasicDutyPer(oneCalcData.data.priceState.basicDutyPer || {});
      setBasicDutyValue(oneCalcData.data.priceState.basicDutyValue || {});
      setSubTotalBasicDuty(
        oneCalcData.data.priceState.subTotalBasicDuty || null
      );
      setSwChargeCommon(oneCalcData.data.priceState.swChargeCommon || '');
      setSwCharge(oneCalcData.data.priceState.swCharge || {});
      setLandingForOtherValueCommon(
        oneCalcData.data.priceState.landingForOtherValueCommon || ''
      );
      setLandingForOtherValue(
        oneCalcData.data.priceState.landingForOtherValue || {}
      );
      setLateFee(oneCalcData.data.priceState.lateFee || '');
      setLateFeeValue(oneCalcData.data.priceState.lateFeeValue || {});
      setSubTotalAssesable(
        oneCalcData.data.priceState.subTotalAssesable || null
      );
      setGstPer(oneCalcData.data.priceState.gstPer || {});
      setGstRate(oneCalcData.data.priceState.gstRate || {});
      setSubTotalGstRate(oneCalcData.data.priceState.subTotalGstRate || null);
      setCdTotal(oneCalcData.data.priceState.cdTotal || {});
      setSubCdTotal(oneCalcData.data.priceState.subCdTotal || null);

      // Shipping
      setShippingFee(oneCalcData.data.shippingState.ShippingFee || '');
      setGstOnShipping(oneCalcData.data.shippingState.gstOnShipping || '');
      setShippingValue(oneCalcData.data.shippingState.shippingValue || {});
      setShippingGstValue(
        oneCalcData.data.shippingState.shippingGstValue || {}
      );
      setTotalShipping(oneCalcData.data.shippingState.totalShipping || {});
      setSubtotalShipping(
        oneCalcData.data.shippingState.subTotalShipping || null
      );

      // other charges
      setRegularBillentry(
        oneCalcData.data.otherChargeState.regularBillentry || ''
      );
      setWarehouseCharge(
        oneCalcData.data.otherChargeState.warehouseCharge || ''
      );
      setBankCharge(oneCalcData.data.otherChargeState.bankCharge || '');
      setOtherCharge(oneCalcData.data.otherChargeState.otherCharge || '');
      setRegularBillentryValue(
        oneCalcData.data.otherChargeState.regularBillentryValue || {}
      );
      setWarehouseChargeValue(
        oneCalcData.data.otherChargeState.warehouseChargeValue || {}
      );
      setBankChargeValue(
        oneCalcData.data.otherChargeState.bankChargeValue || {}
      );
      setOtherChargeValue(
        oneCalcData.data.otherChargeState.otherChargeValue || {}
      );
      setTotalOtherCharge(
        oneCalcData.data.otherChargeState.totalOtherCharge || {}
      );
      setSubTotalOtherCharge(
        oneCalcData.data.otherChargeState.subTotalOtherCharge || null
      );

      // finalCalc
      setFinalTotal(oneCalcData.data.finalCalcTotal.finalTotal || {});
      setSubFinalTotal(oneCalcData.data.finalCalcTotal.subFinalTotal || null);
      setFinalTotalExcludeGst(
        oneCalcData.data.finalCalcTotal.finalTotalExcludeGst || {}
      );
      setSubFinalTotalExcludeGst(
        oneCalcData.data.finalCalcTotal.subFinalTotalExcludeGst || null
      );
      setFinalGst(oneCalcData.data.finalCalcTotal.finalGst || {});
      setSubFinalGst(oneCalcData.data.finalCalcTotal.subFinalGst || null);
      setFinalLandingCostExGst(
        oneCalcData.data.finalCalcTotal.finalLandingCostExGst || {}
      );
      setSubFinalLandingCostExGst(
        oneCalcData.data.finalCalcTotal.subFinalLandingCostExGst || null
      );
      setFinalLandingCost(
        oneCalcData.data.finalCalcTotal.finalLandingCost || {}
      );
      setLandingCost(oneCalcData.data.finalCalcTotal.landingCost || {});
      setSubLandingCost(oneCalcData.data.finalCalcTotal.subLandingCost || null);
      setLandingCostExGst(
        oneCalcData.data.finalCalcTotal.landingCostExGst || {}
      );
      setSubLandingCostExGst(
        oneCalcData.data.finalCalcTotal.subLandingCostExGst || null
      );
    }
  }, [oneCalcData]);

  // weight useEffect

  useEffect(() => {
    if (!id || isInitialCheck.current) {
      actualWeightCalcWithUnit();
    }
  }, [WeightUnit]);
  useEffect(() => {
    volumeWeightCalculator();
  }, [dimensions, unit, rows, WeightUnit, Courier]);

  useEffect(() => {
    totalVolumeWeightCalc();
  }, [volumeWeight, rows, WeightUnit, qty]);

  useEffect(() => {
    totalActualWeightCalc();
  }, [actualWeight, rows, qty]);

  useEffect(() => {
    weightCompareCalc();
  }, [actualWeight, volumeWeight, rows]);

  useEffect(() => {
    totalWeightCalc();
  }, [qty, weightCompare, rows]);

  useEffect(() => {
    subTotalWeightCalc();
  }, [totalWeight, rows]);

  useEffect(() => {
    weightRatioCalc();
  }, [totalWeight, subTotalWeight, rows]);

  useEffect(() => {
    addingExtraVolumetricWeight();
  }, [volumeWeightRatio, extraWeight, rows, unit]);

  useEffect(() => {
    finalWeightCalc();
  }, [extraWeightIntoRatio, rows]);

  useEffect(() => {
    subTotalFinalWeightCalc();
  }, [finalWeight, rows]);

  // price useEffect

  useEffect(() => {
    totalUsdPriceCalc();
  }, [qty, usdPrice, rows]);

  useEffect(() => {
    subTotalUsdPriceCalc();
  }, [totalUsdPrice, rows]);

  useEffect(() => {
    usdPriceRatioCalc();
  }, [subTotalUsdPrice, rows]);

  useEffect(() => {
    indianRateBoeCalc();
  }, [conversionRateBOE, totalUsdPrice, rows]);
  useEffect(() => {
    subTotalIndianRateBoeCalc();
  }, [indianRateBoe, rows]);

  useEffect(() => {
    indianRatePaymentCalc();
  }, [conversionRatePayment, totalUsdPrice, rows]);

  useEffect(() => {
    subTotalIndianRatePaymentCalc();
  }, [indianRatePayment, rows]);
  useEffect(() => {
    frieghtCalc();
  }, [indianRateBoe, frieghtCommon, rows]);

  useEffect(() => {
    frieghtCalcByValue();
  }, [indianRateBoe, frieghtValueCommon, rows, usdPriceRatio]);

  useEffect(() => {
    subTotalFrieghtCalc();
  }, [frieght, rows]);

  useEffect(() => {
    subTotalInsuranceCalc();
  }, [insurance, rows]);

  useEffect(() => {
    insuranceCalc();
  }, [frieght, rows, insuranceCommon, frieghtValueCommon]);

  useEffect(() => {
    landingForOtherCalc();
  }, [landingForOtherValueCommon, indianRateBoe, rows]);

  useEffect(() => {
    assesableValueCalc();
  }, [indianRateBoe, insurance, frieght, landingForOtherValue, rows]);

  useEffect(() => {
    subTotalAssesableCalc();
  }, [assesableValue, rows]);

  useEffect(() => {
    basicDutyValueCalc();
  }, [basicDutyPer, assesableValue, rows]);

  useEffect(() => {
    subTotalBasicDutyCalc();
  }, [basicDutyValue, rows]);

  useEffect(() => {
    swChargeCalc();
  }, [basicDutyValue, swChargeCommon, rows]);

  useEffect(() => {
    gstRateCalc();
  }, [swCharge, gstPer, rows]);
  useEffect(() => {
    subTotalGstRateCalc();
  }, [gstRate]);

  useEffect(() => {
    lateFeesValueCalc();
  }, [lateFee, usdPriceRatio, rows]);

  useEffect(() => {
    cdTotalCalc();
  }, [lateFeeValue, gstRate, rows]);

  useEffect(() => {
    subCdTotalCalc();
  }, [cdTotal, rows]);

  // shipping useEffect

  useEffect(() => {
    shippingValueCalc();
  }, [finalWeight, ShippingFee, rows]);

  useEffect(() => {
    shippingGstValueCalc();
  }, [gstOnShipping, shippingValue, rows]);

  useEffect(() => {
    totalShippingCalc();
  }, [shippingValue, shippingGstValue, rows]);

  useEffect(() => {
    subTotalShippingCalc();
  }, [totalShipping, rows]);

  // other charge useEffect

  useEffect(() => {
    regularBillentryValueCalc();
  }, [usdPriceRatio, regularBillentry, rows]);
  useEffect(() => {
    warehouseChargeValueCalc();
  }, [usdPriceRatio, warehouseCharge, rows]);
  useEffect(() => {
    bankChargeValueCalc();
  }, [usdPriceRatio, bankCharge, rows]);
  useEffect(() => {
    otherChargeValueCalc();
  }, [usdPriceRatio, otherCharge, rows]);
  useEffect(() => {
    totalOtherChargeCalc();
  }, [
    regularBillentryValue,
    warehouseChargeValue,
    bankChargeValue,
    otherChargeValue,
    rows,
  ]);
  useEffect(() => {
    subTotalOtherChargeCalc();
  }, [totalOtherCharge, rows]);

  // finalCalc useEffect
  useEffect(() => {
    finalTotalCalc();
  }, [cdTotal, totalShipping, totalOtherCharge, rows]);
  useEffect(() => {
    finalGstCalc();
  }, [gstRate, shippingGstValue, rows]);
  useEffect(() => {
    finalTotalExcludeGstCalc();
  }, [finalTotal, finalGst, rows]);

  useEffect(() => {
    finalLandingCostExGstCalc();
  }, [finalTotalExcludeGst, indianRatePayment, rows]);

  useEffect(() => {
    finalLandingCostCalc();
  }, [finalTotal, indianRatePayment, rows]);

  useEffect(() => {
    landingCostExGstCalc();
  }, [finalLandingCostExGst, qty, rows]);

  useEffect(() => {
    landingCostCalc();
  }, [landingCostExGst, gstPer, rows]);

  useEffect(() => {
    subFinalTotalCalc();
  }, [finalTotal, rows]);
  useEffect(() => {
    subFinalTotalExcludeGstCalc();
  }, [finalTotalExcludeGst, rows]);
  useEffect(() => {
    subFinalGstCalc();
  }, [finalGst, rows]);
  useEffect(() => {
    subFinalLandingCostExGstCalc();
  }, [finalLandingCostExGst, rows]);
  useEffect(() => {
    subLandingCostCalc();
  }, [landingCost, rows]);
  useEffect(() => {
    subLandingCostExGstCalc();
  }, [landingCostExGst, rows]);

  /// functions

  // function to reset all values

  const resetToDefault = () => {
    setRows([]);
    setCalcId('');
    setDescription('');
    setIsEdited(false);

    /// weight
    setQty({});
    setDimensions({});
    setUnit('cm');
    setWeightUnit('gm');
    setCourier('cargo');
    setVolumeWeight({});
    setActualWeight({});
    setWeightCompare({});
    setTotalWeight({});
    setSubTotalWeight(null);
    setTotalVolumeWeight(null);
    setTotalActualWeight(null);
    setVolumeWeightRatio({});
    setExtraWeight('');
    setExtraWeightIntoRatio({});
    setFinalWeight({});
    setSubTotalFinalWeight(null);

    /// price
    setUsdPrice({});
    setRMBPrice({});
    setTotalUsdPrice({});
    setSubTotalUsdPrice(null);
    setUsdPriceRatio({});
    setConversionRateBOE('');
    setConversionRatePayment('');
    setIndianRateBoe({});
    setSubTotalIndianRateBoe(null);
    setIndianRatePayment({});
    setSubTotalIndianRatePayment(null);
    setPaymentTermCommon('fob');
    setInsuranceCommon('');
    setSubTotalInsurance(null);
    setFrieghtCommon('');
    setFrieghtValueCommon('');
    setFrieght({});
    setSubTotalFrieght(null);
    setInsurance({});
    setBasicDutyPer({});
    setBasicDutyValue({});
    setSubTotalBasicDuty(null);
    setSwChargeCommon('');
    setSwCharge({});
    setLandingForOtherValueCommon('');
    setLandingForOtherValue({});
    setLateFee('');
    setLateFeeValue({});
    setSubTotalAssesable(null);
    setGstPer({});
    setGstRate({});
    setSubTotalGstRate(null);
    setCdTotal({});
    setSubCdTotal(null);

    /// Shipping
    setShippingFee('');
    setGstOnShipping('');
    setShippingValue({});
    setShippingGstValue({});
    setTotalShipping({});
    setSubtotalShipping(null);

    // other charges
    setRegularBillentry('');
    setWarehouseCharge('');
    setBankCharge('');
    setOtherCharge('');
    setRegularBillentryValue({});
    setWarehouseChargeValue({});
    setBankChargeValue({});
    setOtherChargeValue({});
    setTotalOtherCharge({});
    setSubTotalOtherCharge(null);

    // finalCalc
    setFinalTotal({});
    setSubFinalTotal(null);
    setFinalTotalExcludeGst({});
    setSubFinalTotalExcludeGst(null);
    setFinalGst({});
    setSubFinalGst(null);
    setFinalLandingCostExGst({});
    setSubFinalLandingCostExGst(null);
    setFinalLandingCost({});
    setLandingCost({});
    setSubLandingCost(null);
    setLandingCostExGst({});
    setSubLandingCostExGst(null);
  };

  // weight functions

  const actualWeightCalcWithUnit = () => {
    const newActualWeight = {};
    rows.forEach((row) => {
      newActualWeight[row.SKU] =
        WeightUnit === 'kg'
          ? (actualWeight[row.SKU] / 1000).toFixed(3)
          : actualWeight[row.SKU] * 1000;
    });

    setActualWeight(newActualWeight);
  };

  const volumeWeightCalculator = () => {
    const newVolumeWeight = {};

    let volumetricFactor;

    if (Courier === 'cargo') {
      volumetricFactor = unit === 'cm' ? 6000 : 6000000;
    } else {
      volumetricFactor = unit === 'cm' ? 5000 : 5000000;
    }

    rows.forEach((row) => {
      const { L = 0, W = 0, H = 0 } = dimensions[row.SKU] || {}; // Use an empty object as default if dimensions[row.SKU] is undefined
      const weight = (L * W * H) / volumetricFactor;

      newVolumeWeight[row.SKU] = WeightUnit === 'kg' ? weight : weight * 1000;
    });
    setVolumeWeight(newVolumeWeight);
  };

  const totalVolumeWeightCalc = () => {
    const newTotalVolumeWeight = rows.reduce((accumulator, currentValue) => {
      const volumeWeight2 =
        volumeWeight[currentValue.SKU] * (qty[currentValue.SKU] || 0);

      if (volumeWeight2 !== undefined && volumeWeight2 !== null) {
        return accumulator + volumeWeight2;
      }
      return accumulator;
    }, 0);

    setTotalVolumeWeight(newTotalVolumeWeight);
  };

  const totalActualWeightCalc = () => {
    const newTotalActualWeight = rows.reduce((accumulator, currentValue) => {
      const actualWeight2 =
        actualWeight[currentValue.SKU] * (qty[currentValue.SKU] || 0);
      if (actualWeight2 !== undefined && actualWeight2 !== null) {
        return accumulator + +actualWeight2;
      }
      return accumulator;
    }, 0);

    setTotalActualWeight(+newTotalActualWeight);
  };

  const weightCompareCalc = () => {
    const newWeightCompare = {};

    rows.forEach((row) => {
      const compareValue =
        (+actualWeight[row.SKU] || 0) > (+volumeWeight[row.SKU] || 0)
          ? +actualWeight[row.SKU] || 0
          : +volumeWeight[row.SKU] || 0;

      newWeightCompare[row.SKU] = compareValue;
    });

    setWeightCompare(newWeightCompare);
  };

  const totalWeightCalc = () => {
    const newTotalWeight = {};
    rows.forEach((row) => {
      if (weightCompare[row.SKU] && qty[row.SKU]) {
        newTotalWeight[row.SKU] = +weightCompare[row.SKU] * +qty[row.SKU];
      } else {
        newTotalWeight[row.SKU] = 0;
      }
    });

    setTotalWeight(newTotalWeight);
  };

  const subTotalWeightCalc = () => {
    const newSubtotalWeight = rows.reduce((accumulator, currentValue) => {
      const volumeWeight = totalWeight[currentValue.SKU];
      if (volumeWeight !== undefined && volumeWeight !== null) {
        return accumulator + volumeWeight;
      }
      return accumulator;
    }, 0);

    setSubTotalWeight(newSubtotalWeight);
  };

  const weightRatioCalc = () => {
    const newWeightRatio = {};

    const isValueExist = rows.every((item) => totalWeight[item.SKU]);
    if (isValueExist) {
      rows.forEach((row) => {
        newWeightRatio[row.SKU] = (totalWeight[row.SKU] / subTotalWeight) * 100;
      });
    }
    setVolumeWeightRatio(newWeightRatio);
  };

  const addingExtraVolumetricWeight = () => {
    let newExtraVolumetricWeight = {};

    rows.forEach((row) => {
      newExtraVolumetricWeight[row.SKU] =
        ((volumeWeightRatio[row.SKU] || 0) * (extraWeight || 0)) / 100;
    });

    setExtraWeightIntoRatio(newExtraVolumetricWeight);
  };

  const finalWeightCalc = () => {
    let newFinalWeight = {};
    rows.forEach((row) => {
      newFinalWeight[row.SKU] =
        (extraWeightIntoRatio[row.SKU] || 0) + totalWeight[row.SKU];
    });

    setFinalWeight(newFinalWeight);
  };

  const subTotalFinalWeightCalc = () => {
    const newSubtotalWeight = rows.reduce((accumulator, currentValue) => {
      const volumeWeight =
        (totalWeight[currentValue.SKU] || 0) +
        (extraWeightIntoRatio[currentValue.SKU] || 0);

      if (volumeWeight !== undefined && volumeWeight !== null) {
        return accumulator + volumeWeight;
      }
      return accumulator;
    }, 0);

    setSubTotalFinalWeight(newSubtotalWeight);
  };

  // price functions
  const totalUsdPriceCalc = () => {
    const newTotalUsdPrice = {};
    rows.forEach((row) => {
      newTotalUsdPrice[row.SKU] =
        (qty[row.SKU] || 0) * (usdPrice[row.SKU] || 0);
    });

    setTotalUsdPrice(newTotalUsdPrice);
  };

  const subTotalUsdPriceCalc = () => {
    const newSubTotalUsdPrice = rows.reduce((accumulator, currentValue) => {
      if (totalUsdPrice[currentValue.SKU]) {
        return accumulator + totalUsdPrice[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubTotalUsdPrice(newSubTotalUsdPrice);
  };

  const usdPriceRatioCalc = () => {
    let newUsdPriceRatio = {};
    if (subTotalUsdPrice) {
      rows.forEach((row) => {
        newUsdPriceRatio[row.SKU] =
          (totalUsdPrice[row.SKU] / subTotalUsdPrice) * 100;
      });

      setUsdPriceRatio(newUsdPriceRatio);
    } else {
      setUsdPriceRatio({});
    }
  };

  const indianRateBoeCalc = () => {
    let newIndianRateBoe = {};

    rows.forEach((row) => {
      newIndianRateBoe[row.SKU] =
        (conversionRateBOE || 0) * (totalUsdPrice[row.SKU] || 0);
    });
    setIndianRateBoe(newIndianRateBoe);
  };

  const subTotalIndianRateBoeCalc = () => {
    const newSubTotalIndianRateBoe = rows.reduce(
      (accumulator, currentValue) => {
        if (indianRateBoe[currentValue.SKU]) {
          return accumulator + indianRateBoe[currentValue.SKU];
        }
        return accumulator;
      },
      0
    );

    setSubTotalIndianRateBoe(newSubTotalIndianRateBoe);
  };

  const indianRatePaymentCalc = () => {
    let newIndianRatePayment = {};

    rows.forEach((row) => {
      newIndianRatePayment[row.SKU] =
        (conversionRatePayment || 0) * (totalUsdPrice[row.SKU] || 0);
    });
    setIndianRatePayment(newIndianRatePayment);
  };
  const subTotalIndianRatePaymentCalc = () => {
    const newSubTotalIndianRatePayment = rows.reduce(
      (accumulator, currentValue) => {
        if (indianRatePayment[currentValue.SKU]) {
          return accumulator + indianRatePayment[currentValue.SKU];
        }
        return accumulator;
      },
      0
    );

    setSubTotalIndianRatePayment(newSubTotalIndianRatePayment);
  };
  const frieghtCalc = () => {
    const newFrieght = {};

    if (frieghtCommon) {
      rows.forEach((row) => {
        newFrieght[row.SKU] =
          ((indianRateBoe[row.SKU] || 0) * (frieghtCommon || 0)) / 100;
      });
      setFrieght(newFrieght);
    }

    if (!frieghtCommon && !frieghtValueCommon) {
      setFrieght({});
    }
  };

  const frieghtCalcByValue = () => {
    const newFrieght = {};
    if (frieghtValueCommon) {
      rows.forEach((row) => {
        newFrieght[row.SKU] =
          ((usdPriceRatio[row.SKU] || 0) / 100) * frieghtValueCommon;
      });

      setFrieght(newFrieght);
    }

    if (!frieghtCommon && !frieghtValueCommon) {
      setFrieght({});
    }
  };

  const subTotalFrieghtCalc = () => {
    const newsubTotalFrieght = rows.reduce((accumulator, currentValue) => {
      if (frieght[currentValue.SKU]) {
        return accumulator + frieght[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubTotalFrieght(newsubTotalFrieght);
  };

  const subTotalInsuranceCalc = () => {
    const newsubTotalInsurance = rows.reduce((accumulator, currentValue) => {
      if (insurance[currentValue.SKU]) {
        return accumulator + insurance[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubTotalInsurance(newsubTotalInsurance);
  };
  const subTotalBasicDutyCalc = () => {
    const newSubTotalBasicDuty = rows.reduce((accumulator, currentValue) => {
      if (basicDutyValue[currentValue.SKU]) {
        return accumulator + basicDutyValue[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubTotalBasicDuty(newSubTotalBasicDuty);
  };
  const subTotalAssesableCalc = () => {
    const newSubTotalAssesable = rows.reduce((accumulator, currentValue) => {
      if (assesableValue[currentValue.SKU]) {
        return accumulator + assesableValue[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubTotalAssesable(newSubTotalAssesable);
  };
  const subTotalGstRateCalc = () => {
    const newSubTotalGstRate = rows.reduce((accumulator, currentValue) => {
      if (gstRate[currentValue.SKU]) {
        return accumulator + gstRate[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubTotalGstRate(newSubTotalGstRate);
  };
  const insuranceCalc = () => {
    const newInsurance = {};

    if (frieghtCommon) {
      rows.forEach((row) => {
        newInsurance[row.SKU] =
          ((frieght[row.SKU] || 0) * (insuranceCommon || 0)) / 100;
      });
    } else {
      rows.forEach((row) => {
        const usdIntoBoe =
          (totalUsdPrice[row.SKU] || 0) * (conversionRateBOE || 0);
        newInsurance[row.SKU] =
          ((usdIntoBoe || 0) * (insuranceCommon || 0)) / 100;
      });
    }

    setInsurance(newInsurance);
  };
  const landingForOtherCalc = () => {
    const newLandingForOtherValues = {};

    rows.forEach((row) => {
      newLandingForOtherValues[row.SKU] =
        ((indianRateBoe[row.SKU] || 0) * (landingForOtherValueCommon || 0)) /
        100;
    });

    setLandingForOtherValue(newLandingForOtherValues);
  };
  const assesableValueCalc = () => {
    const newAssesableValue = {};

    rows.forEach((row) => {
      newAssesableValue[row.SKU] =
        (indianRateBoe[row.SKU] || 0) +
        (frieght[row.SKU] || 0) +
        (insurance[row.SKU] || 0) +
        (landingForOtherValue[row.SKU] || 0);
    });

    setAssesableValue(newAssesableValue);
  };

  const basicDutyValueCalc = () => {
    const newBasicDutyValueCalc = {};

    rows.forEach((row) => {
      newBasicDutyValueCalc[row.SKU] =
        ((assesableValue[row.SKU] || 0) * basicDutyPer[row.SKU] || 0) / 100;
    });

    setBasicDutyValue(newBasicDutyValueCalc);
  };
  const swChargeCalc = () => {
    const newSwCharge = {};

    rows.forEach((row) => {
      newSwCharge[row.SKU] =
        ((basicDutyValue[row.SKU] || 0) * (swChargeCommon || 0)) / 100;
    });
    setSwCharge(newSwCharge);
  };

  const gstRateCalc = () => {
    const newGstRate = {};

    rows.forEach((row) => {
      newGstRate[row.SKU] =
        (((assesableValue[row.SKU] || 0) +
          (basicDutyValue[row.SKU] || 0) +
          (swCharge[row.SKU] || 0)) *
          (gstPer[row.SKU] || 0)) /
        100;
    });

    setGstRate(newGstRate);
  };

  const lateFeesValueCalc = () => {
    const newLateFees = {};

    rows.forEach((row) => {
      newLateFees[row.SKU] =
        ((usdPriceRatio[row.SKU] || 0) * (lateFee || 0)) / 100;
    });

    setLateFeeValue(newLateFees);
  };

  const cdTotalCalc = () => {
    const newCdTotal = {};
    rows.forEach((row) => {
      newCdTotal[row.SKU] =
        (basicDutyValue[row.SKU] || 0) +
        (swCharge[row.SKU] || 0) +
        (gstRate[row.SKU] || 0) +
        (lateFeeValue[row.SKU] || 0);
    });

    setCdTotal(newCdTotal);
  };

  const subCdTotalCalc = () => {
    const newsubCdTotal = rows.reduce((accumulator, currentValue) => {
      if (cdTotal[currentValue.SKU]) {
        return accumulator + cdTotal[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubCdTotal(newsubCdTotal);
  };
  // shipping functions

  const shippingValueCalc = () => {
    const newShippingValue = {};

    rows.forEach((row) => {
      let finalWeightWithUnit =
        WeightUnit === 'gm'
          ? finalWeight[row.SKU] / 1000
          : finalWeight[row.SKU];

      newShippingValue[row.SKU] =
        (ShippingFee || 0) * (finalWeightWithUnit || 0);
    });

    setShippingValue(newShippingValue);
  };

  const shippingGstValueCalc = () => {
    const newshippingGstValue = {};

    rows.forEach((row) => {
      newshippingGstValue[row.SKU] =
        ((shippingValue[row.SKU] || 0) * (gstOnShipping || 0)) / 100;
    });

    setShippingGstValue(newshippingGstValue);
  };

  const totalShippingCalc = () => {
    const newTotalShipping = {};
    rows.forEach((row) => {
      newTotalShipping[row.SKU] =
        (shippingValue[row.SKU] || 0) + (shippingGstValue[row.SKU] || 0);
    });

    setTotalShipping(newTotalShipping);
  };

  const subTotalShippingCalc = () => {
    const newSubtotalShipping = rows.reduce((accumulator, currentValue) => {
      if (totalShipping[currentValue.SKU]) {
        return accumulator + totalShipping[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubtotalShipping(newSubtotalShipping);
  };

  // other charge functions

  const regularBillentryValueCalc = () => {
    const newRegularBillentryValue = {};

    rows.forEach((row) => {
      newRegularBillentryValue[row.SKU] =
        ((usdPriceRatio[row.SKU] || 0) * (regularBillentry || 0)) / 100;
    });

    setRegularBillentryValue(newRegularBillentryValue);
  };

  const warehouseChargeValueCalc = () => {
    const newWarehouseChargeValue = {};

    rows.forEach((row) => {
      newWarehouseChargeValue[row.SKU] =
        ((usdPriceRatio[row.SKU] || 0) * (warehouseCharge || 0)) / 100;
    });

    setWarehouseChargeValue(newWarehouseChargeValue);
  };

  const bankChargeValueCalc = () => {
    const newBankChargeValue = {};

    rows.forEach((row) => {
      newBankChargeValue[row.SKU] =
        ((usdPriceRatio[row.SKU] || 0) * (bankCharge || 0)) / 100;
    });

    setBankChargeValue(newBankChargeValue);
  };
  const otherChargeValueCalc = () => {
    const newOtherChargeValue = {};

    rows.forEach((row) => {
      newOtherChargeValue[row.SKU] =
        ((usdPriceRatio[row.SKU] || 0) * (otherCharge || 0)) / 100;
    });

    setOtherChargeValue(newOtherChargeValue);
  };

  const totalOtherChargeCalc = () => {
    const newTotalOtherCharge = {};
    rows.forEach((row) => {
      newTotalOtherCharge[row.SKU] =
        (regularBillentryValue[row.SKU] || 0) +
        (warehouseChargeValue[row.SKU] || 0) +
        (bankChargeValue[row.SKU] || 0) +
        (otherChargeValue[row.SKU] || 0);
    });

    setTotalOtherCharge(newTotalOtherCharge);
  };

  const subTotalOtherChargeCalc = () => {
    const newSubtotalOtherCharge = rows.reduce((accumulator, currentValue) => {
      if (totalOtherCharge[currentValue.SKU]) {
        return accumulator + totalOtherCharge[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubTotalOtherCharge(newSubtotalOtherCharge);
  };

  // final charge functions

  const finalTotalCalc = () => {
    const newFinalTotal = {};
    rows.forEach((row) => {
      newFinalTotal[row.SKU] =
        (cdTotal[row.SKU] || 0) +
        (totalShipping[row.SKU] || 0) +
        (totalOtherCharge[row.SKU] || 0);
    });

    setFinalTotal(newFinalTotal);
  };

  const finalGstCalc = () => {
    const newfinalGst = {};
    rows.forEach((row) => {
      newfinalGst[row.SKU] =
        (gstRate[row.SKU] || 0) + (shippingGstValue[row.SKU] || 0);
    });

    setFinalGst(newfinalGst);
  };

  const finalTotalExcludeGstCalc = () => {
    const newfinalTotalExcludeGst = {};
    rows.forEach((row) => {
      newfinalTotalExcludeGst[row.SKU] =
        (finalTotal[row.SKU] || 0) - (finalGst[row.SKU] || 0);
    });

    setFinalTotalExcludeGst(newfinalTotalExcludeGst);
  };

  const finalLandingCostExGstCalc = () => {
    const newfinalLandingCostExGst = {};
    rows.forEach((row) => {
      newfinalLandingCostExGst[row.SKU] =
        (finalTotalExcludeGst[row.SKU] || 0) +
        (indianRatePayment[row.SKU] || 0);
    });

    setFinalLandingCostExGst(newfinalLandingCostExGst);
  };

  const finalLandingCostCalc = () => {
    const newfinalLandingCost = {};
    rows.forEach((row) => {
      newfinalLandingCost[row.SKU] =
        (finalTotal[row.SKU] || 0) + (indianRatePayment[row.SKU] || 0);
    });

    setFinalLandingCost(newfinalLandingCost);
  };
  const landingCostExGstCalc = () => {
    const newlandingCostExGst = {};
    rows.forEach((row) => {
      newlandingCostExGst[row.SKU] =
        (finalLandingCostExGst[row.SKU] || 0) / (qty[row.SKU] || 0);
    });

    setLandingCostExGst(newlandingCostExGst);
  };

  const landingCostCalc = () => {
    const newLandingCost = {};
    rows.forEach((row) => {
      newLandingCost[row.SKU] =
        (landingCostExGst[row.SKU] || 0) * ((gstPer[row.SKU] || 0) / 100) +
        (landingCostExGst[row.SKU] || 0);
    });

    setLandingCost(newLandingCost);
  };
  //
  const subFinalTotalCalc = () => {
    const newSubFinalTotal = rows.reduce((accumulator, currentValue) => {
      if (finalTotal[currentValue.SKU]) {
        return accumulator + finalTotal[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubFinalTotal(newSubFinalTotal);
  };
  const subFinalTotalExcludeGstCalc = () => {
    const newSubFinalTotalExcludeGst = rows.reduce(
      (accumulator, currentValue) => {
        if (finalTotalExcludeGst[currentValue.SKU]) {
          return accumulator + finalTotalExcludeGst[currentValue.SKU];
        }
        return accumulator;
      },
      0
    );

    setSubFinalTotalExcludeGst(newSubFinalTotalExcludeGst);
  };
  const subFinalGstCalc = () => {
    const newSubFinalGst = rows.reduce((accumulator, currentValue) => {
      if (finalGst[currentValue.SKU]) {
        return accumulator + finalGst[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubFinalGst(newSubFinalGst);
  };
  const subFinalLandingCostExGstCalc = () => {
    const newSubFinalLandingCostExGst = rows.reduce(
      (accumulator, currentValue) => {
        if (finalLandingCostExGst[currentValue.SKU]) {
          return accumulator + finalLandingCostExGst[currentValue.SKU];
        }
        return accumulator;
      },
      0
    );

    setSubFinalLandingCostExGst(newSubFinalLandingCostExGst);
  };

  const subLandingCostCalc = () => {
    const newSubLandingCost = rows.reduce((accumulator, currentValue) => {
      if (landingCost[currentValue.SKU]) {
        return accumulator + landingCost[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubLandingCost(newSubLandingCost);
  };

  const subLandingCostExGstCalc = () => {
    const newSubLandingCostExGst = rows.reduce((accumulator, currentValue) => {
      if (landingCostExGst[currentValue.SKU]) {
        return accumulator + landingCostExGst[currentValue.SKU];
      }
      return accumulator;
    }, 0);

    setSubLandingCostExGst(newSubLandingCostExGst);
  };

  //Calculate GST
  function calculateValueWithGST(value, gstPercentage) {
    if (typeof value !== 'number' || typeof gstPercentage !== 'number') {
      throw new Error('Both value and gstPercentage should be numbers');
    }

    const gstAmount = (value * gstPercentage) / 100;

    return value + gstAmount;
  }

  return (
    <Box component='main' sx={{ flexGrow: 1, p: 0, width: '100%' }}>
      <DrawerHeader />
      {/* <Header
        Name={"Price Calculator"}
        info={true}
        customOnClick={handleOpen1}
      /> */}

      <Loading loading={oneCalcLoading} />

      <Grid container display='flex' spacing={1}>
        <Box
          sx={{
            width: '100%',
            // marginTop: "1rem",
            display: 'flex',
            justifyContent: 'center',
            // border: '2px solid aqua',
          }}
        >
          {/* save buttons  */}
          {id ? (
            <Button
              sx={{ height: '3rem', marginTop: '1rem', marginRight: '.5rem' }}
              variant='contained'
              onClick={handleSaveCalcData}
              color='primary'
            >
              {updateLoading ? (
                <CircularProgress size={24} color='inherit' /> // Show loading indicator
              ) : (
                'Save Changes'
              )}
            </Button>
          ) : (
            <StyleButton
              onClick={() => {
                if (!rows.length) {
                  return;
                }
                setOpenSave(true);
              }}
            >
              Save
            </StyleButton>
          )}

          {id ? (
            <Button
              sx={{ height: '3rem', marginTop: '1rem' }}
              variant='contained'
              onClick={handleSyncLandingCost}
            >
              {updateProductLoading ? (
                <CircularProgress size={24} color='inherit' /> // Show loading indicator
              ) : (
                'Sync Landing Cost'
              )}
            </Button>
          ) : (
            ''
          )}
          <Box
            sx={{
              width: '60%',
              borderRadius: '10px',
              // border: '2px solid black',
              margin: '20px',
              boxShadow: '0px 8px 11px 3px #00000024',
            }}
          >
            <StyledInputbase
              onClick={handleToggle}
              placeholder='Search'
              value={testSearch}
              onChange={(e) => {
                setTestSearch(e.target.value);
                if (e.target.value) {
                  setOpenSearchBox(true);
                }
              }}
              startAdornment={
                <InputAdornment position='start'>
                  <IconButton>
                    <SearchOutlinedIcon sx={{ color: 'black' }} />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
          {/* <Button
            sx={{ height: "35px", marginTop: "20px" }}
            variant="contained"
            onClick={()=>handleOpen()}
          >
            View Sub-Total
          </Button> */}
        </Box>

        <Box sx={{ height: '72vh', overflowX: 'auto' }}>
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
            }}
            onClick={handleToggle}
          >
            <StyleCollapse in={openSearchBox}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'end',
                  // position: "relative",
                }}
              >
                <Button sx={{ position: 'fixed' }} variant='contained'>
                  Close
                </Button>
              </Box>

              {filteredData?.length > 0 ? (
                filteredData?.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        padding: '.5rem',
                        '&:hover': { backgroundColor: '#3377FF' },
                        transition: '.3s',
                        // marginTop: "25px",
                      }}
                      onClick={() => handleItemClick(item)}
                    >
                      {item.Name} ({`${item.GST}`}) %
                    </Box>
                  );
                })
              ) : (
                <div>
                  <li style={{ listStyle: 'none', padding: '.5rem' }}>
                    Item not found
                  </li>
                </div>
              )}
            </StyleCollapse>
          </Box>
          <Loading loading={updateProductLoading || addCalcLoading} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <Box sx={{ flexBasis: '90%' }}>
              <Box
                sx={{
                  height: '70vh',
                  overflowY: 'auto',
                  // border: '2px solid aqua',
                  width: '100%',
                  // padding:"1rem"
                }}
              >
                {rows.map((row, index) => (
                  <Accordion
                    key={row.SKU}
                    sx={{
                      border: '2px solid #3385ff',
                      backgroundImage:
                        'linear-gradient(to right top, #dae5ff , #e8f0ff)',
                      // marginBottom: "4px",
                      '& .MuiAccordionSummary-content': {
                        margin: '3px 0px',
                      },
                    }}
                    // expanded={true}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon style={{ color: 'black' }} />}
                      sx={{
                        padding: '0',
                        margin: '0px',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          // marginBottom: "4px",
                          paddingLeft: '5px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            // border: '2px solid purple',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '.666rem',
                              color: '#fff',
                              backgroundColor: ' #000',
                              paddingX: '1rem',
                              border: '2px solid #3385ff',
                              borderRadius: '.4rem',
                              boxShadow: '-3px 3px 4px 0px #404040',
                            }}
                          >
                            {row.SKU}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '.666rem',
                              color: '#fff',
                              backgroundColor: ' #000',
                              paddingX: '1rem',
                              border: '2px solid #3385ff',
                              borderRadius: '.4rem',
                              boxShadow: '-3px 3px 4px 0px #404040',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row.Name}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: '.666rem',
                              color: '#fff',
                              backgroundColor: ' #000',
                              paddingX: '1rem',
                              border: '2px solid #3385ff',
                              borderRadius: '.4rem',
                              boxShadow: '-3px 3px 4px 0px #404040',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Old LC without GST :{' '}
                            {formatIndianPrice(row.LandingCost)}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: '.666rem',
                              color: '#fff',
                              backgroundColor: ' #000',
                              paddingX: '1rem',
                              border: '2px solid #3385ff',
                              borderRadius: '.4rem',
                              boxShadow: '-3px 3px 4px 0px #404040',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            New LC without GST :{' '}
                            {formatIndianPrice(landingCostExGst[row.SKU])}
                          </Typography>

                          {id ? (
                            <Button
                              sx={{
                                textTransform: 'uppercase',
                                border: '2px solid #3385ff',
                                borderRadius: '.4rem',
                                boxShadow: '-3px 3px 4px 0px #404040',
                                fontSize: '.666rem',
                                padding: '0',
                                marginLeft: '5px',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSyncOneLandingCost(
                                  row.SKU,
                                  row.LandingCost,
                                  landingCostExGst[row.SKU],
                                  rmbPrice[row.SKU],
                                  usdPrice[row.SKU],
                                  qty[row.SKU]
                                );
                              }}
                            >
                              Sync
                            </Button>
                          ) : (
                            ''
                          )}
                          <Button
                            onClick={() => {
                              handleDeleteTextField(index);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: '',
                            marginTop: '.4rem',
                            // marginBottom: ".4rem",
                            // border: '2px solid yellow',
                            padding: '.2rem',
                            border: '2px solid #3385ff',
                            justifyContent: 'space-between',
                            borderRadius: '.4rem',
                            boxShadow: '-3px 3px 4px 0px #404040',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Box display={'flex'}>
                            <Typography
                              sx={{
                                fontSize: '.6rem',
                                fontWeight: '600',
                                marginTop: '3px',
                                marginRight: '3px',
                              }}
                            >
                              QTY
                            </Typography>
                            <input
                              type='number'
                              style={{
                                border: '1px solid #9999ff',
                                borderRadius: '.2rem',
                                boxShadow: '0px 8px 4px -4px #00000024',
                                width: '4rem',
                                height: '20px',
                              }}
                              value={qty[row.SKU] ? qty[row.SKU] : ''}
                              onChange={(e) => {
                                handleValueChange(
                                  'qty',
                                  row.SKU,
                                  +e.target.value
                                );
                              }}
                            />
                          </Box>

                          <Box display={'flex'}>
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '.7rem',
                                marginTop: '3px',
                                marginRight: '3px',
                              }}
                            >
                              USD $
                            </Typography>
                            <input
                              type='number'
                              style={{
                                border: '1px solid #9999ff',
                                borderRadius: '.2rem',
                                boxShadow: '0px 8px 4px -4px #00000024',
                                width: '4rem',
                                height: '20px',
                              }}
                              value={usdPrice[row.SKU] ? usdPrice[row.SKU] : ''}
                              onChange={(e) => {
                                handleValueChange(
                                  'usdPrice',
                                  row.SKU,
                                  +e.target.value
                                );
                              }}
                            />
                          </Box>
                          <Box display={'flex'}>
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '.7rem',
                                marginTop: '3px',
                                marginRight: '3px',
                              }}
                            >
                              RMB ¥
                            </Typography>
                            <input
                              type='number'
                              style={{
                                border: '1px solid #9999ff',
                                borderRadius: '.2rem',
                                boxShadow: '0px 8px 4px -4px #00000024',
                                width: '4rem',
                                height: '20px',
                              }}
                              value={rmbPrice[row.SKU] ? rmbPrice[row.SKU] : ''}
                              onChange={(e) => {
                                handleValueChange(
                                  'rmbPrice',
                                  row.SKU,
                                  +e.target.value
                                );
                              }}
                            />
                          </Box>

                          <Box display={'flex'}>
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '.7rem',
                                marginTop: '3px',
                                marginRight: '3px',
                              }}
                            >
                              Basic Duty %
                            </Typography>
                            <input
                              type='number'
                              style={{
                                border: '1px solid #9999ff',
                                borderRadius: '.2rem',
                                boxShadow: '0px 8px 4px -4px #00000024',
                                width: '4rem',
                                height: '20px',
                              }}
                              value={
                                basicDutyPer[row.SKU]
                                  ? basicDutyPer[row.SKU]
                                  : ''
                              }
                              onChange={(e) => {
                                handleValueChange(
                                  'basicDutyPer',
                                  row.SKU,
                                  +e.target.value
                                );
                              }}
                            />
                          </Box>
                          <Box display={'flex'}>
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '.7rem',
                                marginTop: '3px',
                                marginRight: '3px',
                              }}
                            >
                              GST %
                            </Typography>
                            <input
                              type='number'
                              style={{
                                border: '1px solid #9999ff',
                                borderRadius: '.2rem',
                                boxShadow: '0px 8px 4px -4px #00000024',
                                width: '4rem',
                                height: '20px',
                              }}
                              value={gstPer[row.SKU] ? gstPer[row.SKU] : ''}
                              onChange={(e) => {
                                handleValueChange(
                                  'gstPer',
                                  row.SKU,
                                  +e.target.value
                                );
                              }}
                            />
                          </Box>
                          <Box display={'flex'}>
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '.7rem',
                                marginTop: '3px',
                                marginRight: '3px',
                              }}
                            >
                              Old LC with({' '}
                              {gstPer[row.SKU] ? gstPer[row.SKU] : ''} % GST)
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '.666rem',
                                color: 'black',
                                backgroundColor: '#fff',
                                paddingX: '1rem',
                                border: '1px solid black',
                                borderRadius: '.2rem',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {' '}
                              {row.LandingCost || gstPer[row.SKU]
                                ? formatIndianPrice(
                                    calculateValueWithGST(
                                      row.LandingCost,
                                      gstPer[row.SKU]
                                    )
                                  )
                                : ''}
                            </Typography>
                          </Box>
                          <Box display={'flex'}>
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '.7rem',
                                marginTop: '3px',
                                marginRight: '3px',
                              }}
                            >
                              New LC with({' '}
                              {gstPer[row.SKU] ? gstPer[row.SKU] : ''} % GST)
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '.666rem',
                                color: 'black',
                                backgroundColor: '#fff',
                                paddingX: '1rem',
                                border: '1px solid black',
                                borderRadius: '.2rem',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {' '}
                              {formatIndianPrice(landingCost[row.SKU])}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* make this seperate for flexible design */}
                      <Box
                        sx={{
                          // border: '2px solid green',
                          display: 'flex',
                          width: '100%',
                          gap: '.2rem',
                          // paddingBottom:"1rem"
                        }}
                      >
                        {/* first flex parent */}
                        <Box
                          sx={{
                            flexBasis: '10%',
                            // border: '2px solid brown',
                          }}
                        >
                          <Box>
                            <WeightTable
                              product={row}
                              qty={qty}
                              unit={unit}
                              volumeWeight={volumeWeight}
                              handleValueChange={handleValueChange}
                              dimensions={dimensions}
                              volumeWeightRatio={volumeWeightRatio}
                              extraWeightIntoRatio={extraWeightIntoRatio}
                              finalWeight={finalWeight}
                              actualWeight={actualWeight}
                              weightCompare={weightCompare}
                              totalWeight={totalWeight}
                              index={index}
                              setDimensions={setDimensions}
                              setActualWeight={setActualWeight}
                              WeightUnit={WeightUnit}
                              id={id}
                              isInitialCheck={isInitialCheck}
                            />
                          </Box>
                        </Box>
                        {/* second flex parent */}
                        <Box sx={{ flexBasis: '90%' }}>
                          <Box>
                            <PriceTable
                              product={row}
                              handleValueChange={handleValueChange}
                              usdPrice={usdPrice}
                              totalUsdPrice={totalUsdPrice}
                              usdPriceRatio={usdPriceRatio}
                              indianRateBoe={indianRateBoe}
                              indianRatePayment={indianRatePayment}
                              frieght={frieght}
                              insurance={insurance}
                              landingForOtherValue={landingForOtherValue}
                              assesableValue={assesableValue}
                              basicDutyPer={basicDutyPer}
                              basicDutyValue={basicDutyValue}
                              swCharge={swCharge}
                              gstPer={gstPer}
                              gstRate={gstRate}
                              lateFeeValue={lateFeeValue}
                              cdTotal={cdTotal}
                              setGstPer={setGstPer}
                            />
                          </Box>
                          <Box>
                            <ShippingTable
                              product={row}
                              shippingValue={shippingValue}
                              shippingGstValue={shippingGstValue}
                              totalShipping={totalShipping}
                            />
                          </Box>
                          <Box>
                            <OtherCharges
                              product={row}
                              regularBillentryValue={regularBillentryValue}
                              warehouseChargeValue={warehouseChargeValue}
                              bankChargeValue={bankChargeValue}
                              otherChargeValue={otherChargeValue}
                              totalOtherCharge={totalOtherCharge}
                            />
                          </Box>
                        </Box>
                      </Box>
                      {/* the other component */}
                      <Box sx={{}}>
                        <FinalCalcTable
                          product={row}
                          finalTotal={finalTotal}
                          finalTotalExcludeGst={finalTotalExcludeGst}
                          finalGst={finalGst}
                          landingCost={landingCost}
                          finalLandingCostExGst={finalLandingCostExGst}
                          landingCostExGst={landingCostExGst}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
            <Box sx={{ flexBasis: '25%' }}>
              <Box
                sx={{
                  boxShadow: '0px 10px 10px -2px #00000024',
                  borderRadius: '.7rem',
                }}
              >
                <CommonInput
                  unit={unit}
                  paymentTermCommon={paymentTermCommon}
                  WeightUnit={WeightUnit}
                  Courier={Courier}
                  extraWeight={extraWeight}
                  handleValueChange={handleValueChange}
                  conversionRateBOE={conversionRateBOE}
                  conversionRatePayment={conversionRatePayment}
                  frieghtCommon={frieghtCommon}
                  frieghtValueCommon={frieghtValueCommon}
                  insuranceCommon={insuranceCommon}
                  landingForOtherValueCommon={landingForOtherValueCommon}
                  lateFee={lateFee}
                  swChargeCommon={swChargeCommon}
                  step={step}
                  ShippingFee={ShippingFee}
                  gstOnShipping={gstOnShipping}
                  regularBillentry={regularBillentry}
                  warehouseCharge={warehouseCharge}
                  bankCharge={bankCharge}
                  otherCharge={otherCharge}
                />
              </Box>

              {/* second Box  */}
              <Box
                sx={{
                  boxShadow: '0px 10px 10px 2px #00000024',
                  marginTop: '1rem',
                  borderRadius: '.7rem',
                  // border:"2px solid blue"
                }}
              >
                <SubtotalCalc
                  totalVolumeWeight={totalVolumeWeight}
                  totalActualWeight={totalActualWeight}
                  subTotalFinalWeight={subTotalFinalWeight}
                  subTotalWeight={subTotalWeight}
                  subTotalUsdPrice={subTotalUsdPrice}
                  subTotalIndianRateBoe={subTotalIndianRateBoe}
                  subTotalIndianRatePayment={subTotalIndianRatePayment}
                  subTotalFrieght={subTotalFrieght}
                  subTotalInsurance={subTotalInsurance}
                  subTotalAssesable={subTotalAssesable}
                  subTotalBasicDuty={subTotalBasicDuty}
                  subTotalGstRate={subTotalGstRate}
                  subCdTotal={subCdTotal}
                  subTotalShipping={subTotalShipping}
                  subTotalOtherCharge={subTotalOtherCharge}
                  subFinalTotal={subFinalTotal}
                  subFinalTotalExcludeGst={subFinalTotalExcludeGst}
                  subFinalLandingCostExGst={subFinalLandingCostExGst}
                  subFinalGst={subFinalGst}
                  subLandingCostExGst={subLandingCostExGst}
                  subLandingCost={subLandingCost}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Dialog
        open={openSave}
        onClose={() => {
          setOpenSave(false);
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#3f51b5',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Saving Calc Data
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Enter Reference Id'
            type='text'
            fullWidth
            value={calcId}
            onChange={(e) => setCalcId(e.target.value)}
          />
          <TextField
            margin='dense'
            label='Enter Description'
            type='text'
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenSave(false);
            }}
            color='primary'
          >
            Cancel
          </Button>
          <Button onClick={handleSaveCalcData} color='primary'>
            {addCalcLoading ? (
              <CircularProgress size={24} color='inherit' />
            ) : (
              'Save'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open}>
        <DialogTitle sx={{ textAlign: 'center' }}>Sub-Total</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            <SubtotalCalc
              open={open}
              close={handleClose}
              totalVolumeWeight={totalVolumeWeight}
              totalActualWeight={totalActualWeight}
              subTotalFinalWeight={subTotalFinalWeight}
              subTotalWeight={subTotalWeight}
              subTotalUsdPrice={subTotalUsdPrice}
              subTotalIndianRateBoe={subTotalIndianRateBoe}
              subTotalIndianRatePayment={subTotalIndianRatePayment}
              subTotalFrieght={subTotalFrieght}
              subTotalInsurance={subTotalInsurance}
              subTotalAssesable={subTotalAssesable}
              subTotalBasicDuty={subTotalBasicDuty}
              subTotalGstRate={subTotalGstRate}
              subCdTotal={subCdTotal}
              subTotalShipping={subTotalShipping}
              subTotalOtherCharge={subTotalOtherCharge}
              subFinalTotal={subFinalTotal}
              subFinalTotalExcludeGst={subFinalTotalExcludeGst}
              subFinalLandingCostExGst={subFinalLandingCostExGst}
              subFinalGst={subFinalGst}
              subLandingCostExGst={subLandingCostExGst}
              subLandingCost={subLandingCost}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Disagree</Button> */}
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* infoDialog table */}
      <InfoDialogBox
        infoDetails={infoDetail}
        description={description1}
        open={isInfoOpen}
        close={handleClose1}
      />
    </Box>
  );
};

export default Calc;
