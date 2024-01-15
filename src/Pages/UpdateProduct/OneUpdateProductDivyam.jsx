import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Container,
  Paper,
  Typography,
  TextField,
} from "@mui/material";

import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Style } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import {
  useGetOneProductQuery,
  useUpdateOneProductMutation,
} from "../../features/api/productApiSlice";
import Loading from "../../components/Common/Loading";
import { toast } from "react-toastify";

const OneUpdateProductDivyam = ({ open, onClose, SKU, refetchAllProduct }) => {
  /// global state
  const { themeColor } = useSelector((state) => state.ui);

  /// local state
  const [form, setForm] = useState({
    productName: "",
    brand: "",
    category: "",
    subCategory: "",
    gst: "",
    weight: "",
    productDimension: { width: "", height: "", length: "" },
    subItems: [""],
    packageDimensions: [{ width: "", height: "", length: "", weight: "" }],
  });
  const [isEdited, setIsEdited] = useState(false);

  /// RTK query
  const { data, isLoading, refetch, isFetching } = useGetOneProductQuery(SKU, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });

  const [updateProductApi, { isLoading: updateLoading }] =
    useUpdateOneProductMutation();

  /// handlers
  const handleAddSubItems = () => {
    const currentSubitem = [...form.subItems];
    currentSubitem.push("");

    setForm({ ...form, subItems: currentSubitem });
  };

  const handleRemoveSubItems = (index) => {
    const currentSubitem = form.subItems.filter((item, i) => i !== index);

    if (!currentSubitem.length) {
      return;
    }

    setForm({ ...form, subItems: currentSubitem });
  };

  const handleAddPackageDimensions = () => {
    const currentPackageDimensions = [...form.packageDimensions];
    currentPackageDimensions.push({
      width: "",
      height: "",
      length: "",
      weight: "",
    });

    setForm({ ...form, packageDimensions: currentPackageDimensions });
  };

  const handleRemovePackageDimensions = (index) => {
    const currentPackageDimensions = form.packageDimensions.filter(
      (item, i) => i !== index
    );

    if (!currentPackageDimensions.length) {
      return;
    }

    setForm({ ...form, packageDimensions: currentPackageDimensions });
  };

  const handleChange = (type, value, index, name) => {
    if (data?.data?.isChanged) {
      return toast.error("Cant Be Edited Product Changes Approval Pending");
    }
    setIsEdited(true);
    if (type === "subItem") {
      const currentSubitem = [...form.subItems];
      currentSubitem[index] = value;
      setForm({ ...form, subItems: currentSubitem });
    }

    if (type === "packageDimensions") {
      const currentPackageDimensions = [...form.packageDimensions];
      currentPackageDimensions[index][name] = value;
      setForm({ ...form, packageDimensions: currentPackageDimensions });
    }

    if (type === "productDimensions") {
      const currenProductDimension = { ...form.productDimension };
      currenProductDimension[name] = value;
      setForm({ ...form, productDimension: currenProductDimension });
    }

    if (type === "normal") {
      setForm({ ...form, [name]: value });
    }
  };
  const handleSubmit = async () => {
    try {
      const {
        productName,
        brand,
        category,
        subCategory,
        subItems,
        weight,
        productDimension,
        packageDimensions,
        gst,
      } = form;

      if (!productName) {
        throw new Error("Product name cannot be empty");
      }
      if (!brand) {
        throw new Error("brand name cannot be empty");
      }
      if (!category) {
        throw new Error("category name cannot be empty");
      }
      if (!gst) {
        throw new Error("gst  cannot be empty");
      }

      if (
        !form.productDimension.width ||
        !form.productDimension.length ||
        !form.productDimension.height ||
        !weight
      ) {
        throw new Error("All Field In Product Values is Required ");
      }

      const processedSubItems = subItems.filter((item) => {
        if (item) {
          return item;
        }
      });

      const processedPackageDimensions = packageDimensions.filter((item) => {
        if (!item.weight && !item.height && !item.width && !item.length) {
          return false;
        } else {
          return {
            weight: item.weight || 0,
            height: item.height || 0,
            width: item.width || 0,
            length: item.length || 0,
          };
        }
      });

      const params = {
        sku: SKU,
        body: {
          name: form.productName,
          brand: form.brand,
          category: form.category,
          subCategory: form.subCategory,
          weight: form.weight,
          dimensions: form.productDimension,
          subItems: processedSubItems,
          packageDimensions: processedPackageDimensions,
        },
      };

      const res = await updateProductApi(params).unwrap();
      toast.success("Product Changes Saved Successfully");
      refetchAllProduct();
      refetch();
      onClose();
    } catch (e) {
      console.log("error At Add Product");
      console.log(e.message);
      toast.error(e.message);
    }
  };

  /// useEffects

  useEffect(() => {
    if (data?.status === "success") {
      const newForm = {
        productName: data?.data?.Name,
        brand: data?.data?.Brand,
        category: data?.data?.Category,
        subCategory: data?.data?.SubCategory,
        gst: data?.data?.GST,
        weight: data?.data?.Weight,
        productDimension: data?.data?.Dimensions || {
          width: "",
          height: "",
          length: "",
        },
        subItems:
          data?.data?.subItems && data?.data?.subItems.length
            ? [...data?.data?.subItems]
            : [""],
        packageDimensions:
          data?.data?.packageDimensions && data?.data?.packageDimensions.length
            ? [
                ...data?.data?.packageDimensions.map((item) => {
                  return { ...item };
                }),
              ]
            : [{ width: "", height: "", length: "", weight: "" }],
      };

      setForm(newForm);
    }
  }, [data]);
  return (
    <Dialog
      maxWidth="xl"
      open={open}
      onClose={onClose}
      PaperProps={{ style: { minHeight: "80vh" } }}
    >
      <Loading loading={isLoading} />
      <DialogTitle
        sx={{
          backgroundColor: themeColor.sideBarColor1,
          display: "flex",
          justifyContent: "space-between",
          fontSize: "1rem",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <Box>SKU: IRS852345532</Box>
        <CancelIcon
          onClick={onClose}
          sx={{
            color: "#fff",
            borderRadius: "5rem",
            marginRight: "1rem",
            cursor: "pointer",
            "& :hover": {
              color: "red",
            },
          }}
        />
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            boxShadow: 0,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "8.8vh",
              boxShadow: 3,
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-around",
              alignContent: "center",
              padding: "0.5% 0%",
            }}
          >
            {" "}
            <TextField
              id="outlined-basic"
              label="Product Name"
              variant="outlined"
              value={form?.productName}
              onChange={(e) => {
                handleChange("normal", e.target.value, null, "productName");
              }}
              inputProps={{
                style: {
                  height: "1.8vh",
                  width: "24vw",
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="Brand Name"
              variant="outlined"
              value={form?.brand}
              onChange={(e) => {
                handleChange("normal", e.target.value, null, "brand");
              }}
              inputProps={{
                style: {
                  height: "1.8vh",
                  width: "18vw",
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="Category"
              value={form?.category}
              onChange={(e) => {
                handleChange("normal", e.target.value, null, "category");
              }}
              variant="outlined"
              inputProps={{
                style: {
                  height: "1.8vh",
                  width: "12vw",
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="SubCategory"
              value={form?.subCategory}
              onChange={(e) => {
                handleChange("normal", e.target.value, null, "subCategory");
              }}
              variant="outlined"
              inputProps={{
                style: {
                  height: "1.8vh",
                  width: "12vw",
                },
              }}
            />
            <TextField
              id="outlined-basic"
              label="GST(%)"
              variant="outlined"
              type="number"
              value={form?.gst}
              onChange={(e) => {
                handleChange("normal", e.target.value, null, "gst");
              }}
              inputProps={{
                style: {
                  height: "1.8vh",
                  width: "2.7vw",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "70vh",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "start",
              gap: "1%",
            }}
          >
            <Box
              sx={{
                width: "40%",
                height: "98%",
                boxShadow: 3,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  boxShadow: 1,
                  paddingY: "2.4%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "430",
                  }}
                >
                  Product Values
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "auto",
                  height: "70vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <Box
                  sx={{
                    display: "flex",

                    height: "21vh",
                    width: "32vw",
                    // border: '2px solid red',
                    borderBottomRadius: "8px",
                    // marginBottom: '3%',
                    // paddingY: '1%'
                    overflow: "hidden",
                    // boxShadow: 3
                  }}
                >
                  {/* product weight */}
                  <Box
                    sx={{
                      // border: '2px solid black',
                      width: "17vw",
                      height: "20.9vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      // paddingY: '-1%',
                      alignItems: "center",
                      gap: "2px",
                      // boxShadow: 3,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: "600" }}>
                      Product Weight
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "13vw",
                        height: "3vh",
                        // paddingX: '1%',
                        // border: '2px solid black',
                      }}
                    >
                      <Typography sx={{ fontSize: "0.6rem" }}>
                        Weight in (Gram)
                      </Typography>
                    </Box>

                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      placeholder="Weight"
                      type="number"
                      value={form?.weight}
                      onChange={(e) => {
                        handleChange("normal", e.target.value, null, "weight");
                      }}
                      inputProps={{
                        style: {
                          height: "0.2vh",
                          width: "5.5vw",
                          // marginBottom: '-1%'
                        },
                      }}
                    />
                  </Box>

                  {/* dimension */}
                  <Box
                    sx={{
                      // border: '2px solid black',
                      width: "21vw",
                      height: "20.5vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      // gap: '5px',
                      marginTop: "0.6%",
                      // boxShadow: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        // marginTop: '1%',
                      }}
                    >
                      Dimension(L*B*H)
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        // flexDirection: 'column',
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1vw",
                        width: "18vw",
                        height: "11vh",
                        // border: '2px solid red',
                        // marginTop: '1%',
                      }}
                    >
                      {/* lenght */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            // border: '2px solid black',
                            textAlign: "center",
                          }}
                        >
                          Length<sup>(cm)</sup>
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          type="number"
                          placeholder="L"
                          value={form?.productDimension?.length}
                          onChange={(e) => {
                            handleChange(
                              "productDimensions",
                              e.target.value,
                              null,
                              "length"
                            );
                          }}
                          inputProps={{
                            style: {
                              height: "0.3vh",
                              width: "2.5vw",
                            },
                          }}
                        />
                      </div>

                      {/* width */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            // border: '2px solid black',
                            textAlign: "center",
                          }}
                        >
                          Width<sup>(cm)</sup>
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          type="number"
                          placeholder="W"
                          value={form?.productDimension?.width}
                          onChange={(e) => {
                            handleChange(
                              "productDimensions",
                              e.target.value,
                              null,
                              "width"
                            );
                          }}
                          inputProps={{
                            style: {
                              height: "0.3vh",
                              width: "2.6vw",
                            },
                          }}
                        />
                      </div>

                      {/* height */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          // border: '2px solid black',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            // border: '2px solid black',
                            textAlign: "center",
                          }}
                        >
                          Height<sup>(cm)</sup>
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          variant="outlined"
                          type="number"
                          placeholder="H"
                          value={form?.productDimension?.height}
                          onChange={(e) => {
                            handleChange(
                              "productDimensions",
                              e.target.value,
                              null,
                              "height"
                            );
                          }}
                          inputProps={{
                            style: {
                              height: "0.3vh",
                              width: "2.6vw",
                            },
                          }}
                        />
                      </div>
                    </Box>
                  </Box>
                </Box>

                {/* add/submit button */}
                <Box
                  sx={{
                    width: "100%",
                    height: "38.5vh",
                    boxShadow: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    // border: '2px solid yellow',
                    borderRadius: "8px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: "#b5e6f5",
                        marginTop: "1%",
                      }}
                      onClick={handleAddSubItems}
                    >
                      Add Sub items
                      <AddIcon sx={{ fontSize: "large" }} />
                    </Button>
                  </Box>

                  {/* Box of add subtitle1/2/3 */}
                  <Box
                    sx={{
                      width: "30vw",
                      height: "60%",

                      // border: '2px solid red',
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: "1%",
                      overflowY: "auto",
                      paddingY: "1.5%",
                      marginBottom: "1.5%",
                      boxShadow: 3,
                      borderRadius: "8px",
                    }}
                  >
                    {form?.subItems.map((subtitle, index) => (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignContent: "center",
                          // border: '2px solid black',

                          // gap: '2%',
                          marginBottom: "2%",
                        }}
                        key={index}
                      >
                        <TextField
                          label={`Subitem-${index + 1}`}
                          variant="outlined"
                          value={form?.subItems[index]}
                          onChange={(e) => {
                            handleChange("subItem", e.target.value, index);
                          }}
                          inputProps={{
                            style: {
                              height: "1.9vh",
                              width: "6vw",

                              // marginY: '15%',
                              // paddingY: '5%',
                            },
                          }}
                        />

                        {/* Delete button */}
                        <Box
                          sx={{
                            boxShadow: 0,
                            width: "15%",
                            height: "5.8vh",
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            borderRadius: "8px",
                            // border: '2px solid black',
                          }}
                        >
                          <DeleteIcon
                            sx={{
                              backgroundColor: "#42a5f5",
                              color: "white",
                              borderRadius: "4px",
                              boxShadow: 3,
                              cursor: "pointer",
                              fontSize: "1.1rem",
                            }}
                            onClick={() => {
                              handleRemoveSubItems(index);
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* submit */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: "#b5e6f5",
                        marginTop: "1%",
                        paddingX: "8%",
                      }}
                      disabled={!isEdited}
                      onClick={handleSubmit}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* right packeging values */}
            <Box
              sx={{
                width: "50vw",
                height: "68.5vh",
                boxShadow: 3,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                // border: '2px solid black',

                // paddingX: '1%',
              }}
            >
              {/* product value header */}
              <Box
                sx={{
                  width: "100%",
                  height: "10%",
                  // border: '1px solid grey',
                  borderRadius: "8px",
                  display: "flex",
                  // flexDirection: 'column',
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "4%",
                  boxShadow: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "430",
                  }}
                >
                  Packaging Values
                </Typography>

                <AddIcon
                  sx={{
                    // border: '2px solid black',
                    backgroundColor: "#42a5f5",
                    color: "white",
                    borderRadius: "4px",
                    boxShadow: 3,
                    cursor: "pointer",
                    fontSize: "1.1rem",
                  }}
                  onClick={handleAddPackageDimensions}
                />
              </Box>

              {/* product weight/height */}
              <Box
                sx={{
                  width: "100%",
                  height: "93%",
                  // border: '2px solid black',
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    paddingX: "8%",
                    alignItems: "center",
                    boxShadow: 1,
                    height: "10%",
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: "430",
                      marginLeft: "-18%",
                    }}
                  >
                    Product Weight
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: "430",
                    }}
                  >
                    Dimension(L*B*H)
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    // boxShadow: 3,
                    height: "70%",
                    borderRadius: "8px",
                    // border: '2px solid red',
                    marginTop: "2%",
                    paddingTop: "1%",
                    overflowY: "auto",
                  }}
                >
                  {/* unit values */}
                  {form?.packageDimensions?.map((data, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "start",
                        width: "100%",
                        marginBottom: "2%",
                      }}
                    >
                      {/* Weight */}
                      <TextField
                        id="outlined-basic"
                        label="Weight in (Gram)"
                        type="number"
                        variant="outlined"
                        value={form?.packageDimensions[index]?.weight}
                        onChange={(e) => {
                          handleChange(
                            "packageDimensions",
                            e.target.value,
                            index,
                            "weight"
                          );
                        }}
                        inputProps={{
                          style: {
                            width: "9vw",
                            height: "1vh",
                          },
                        }}
                      />

                      {/* L*B*H */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "1%",
                          width: "25vw",
                          marginLeft: "15%",
                        }}
                      >
                        <TextField
                          id="outlined-basic"
                          label="Length(cm)"
                          variant="outlined"
                          type="number"
                          value={form?.packageDimensions[index]?.length}
                          onChange={(e) => {
                            handleChange(
                              "packageDimensions",
                              e.target.value,
                              index,
                              "length"
                            );
                          }}
                          inputProps={{
                            style: {
                              width: "10vw",
                              height: "1vh",
                            },
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Width(cm)"
                          variant="outlined"
                          type="number"
                          value={form?.packageDimensions[index]?.width}
                          onChange={(e) => {
                            handleChange(
                              "packageDimensions",
                              e.target.value,
                              index,
                              "width"
                            );
                          }}
                          inputProps={{
                            style: {
                              width: "9vw",
                              height: "1vh",
                            },
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Height(cm)"
                          variant="outlined"
                          type="number"
                          value={form?.packageDimensions[index]?.height}
                          onChange={(e) => {
                            handleChange(
                              "packageDimensions",
                              e.target.value,
                              index,
                              "height"
                            );
                          }}
                          inputProps={{
                            style: {
                              width: "9vw",
                              height: "1vh",
                            },
                          }}
                        />

                        {/* delete icon */}
                        <DeleteIcon
                          sx={{
                            backgroundColor: "#42a5f5",
                            color: "white",
                            borderRadius: "4px",
                            boxShadow: 3,
                            cursor: "pointer",
                            fontSize: "1.1rem",
                          }}
                          onClick={() => {
                            handleRemovePackageDimensions(index);
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OneUpdateProductDivyam;
