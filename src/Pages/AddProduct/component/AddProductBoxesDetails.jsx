import React, { useState } from "react";
import { Button, Typography, Autocomplete } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useAddProductMutation } from "../../../features/api/productApiSlice";
import { useCreateUserHistoryMutation } from "../../../features/api/usersApiSlice";
import Loading from "../../../components/Common/Loading";
import { useSendMessageToAdminMutation } from "../../../features/api/whatsAppApiSlice";
import { useSelector } from "react-redux";
import { useGetDynamicValueQuery } from "../../../features/api/productApiSlice";

const AddProductBoxesDetails = () => {
  /// local state
  const [form, setForm] = useState({
    productName: "",
    alternativeName: "",
    brand: "",
    category: "",
    subCategory: "",
    gst: "",
    weight: "",
    productDimension: { width: "", height: "", length: "" },
    subItems: [""],
    packageDimensions: [{ width: "", height: "", length: "", weight: "" }],
  });

  /// RTK query
  const [addProductApi, { isLoading }] = useAddProductMutation();
  const [createUserHistoryApi] = useCreateUserHistoryMutation();
  const [sendMessageToAdmin] = useSendMessageToAdminMutation();
  const { data: getDynaicValue } = useGetDynamicValueQuery();

  /// handlers
  const handleAddSubItems = () => {
    const currentSubitem = [...form.subItems];
    currentSubitem.push("");

    setForm({ ...form, subItems: currentSubitem });
  };

  const { name } = useSelector((state) => state.auth.userInfo);

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

  // const handle option value change
  const handleSelectedChange = (value, field) => {
    setForm({
      ...form,
      [field]: value,
    });
  };
  const handleSubmit = async () => {
    try {
      const {
        productName,
        alternativeName,
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

      const params = [
        {
          name: productName,
          alternativeName: alternativeName,
          brand: brand,
          category: category,
          subCategory: subCategory,
          weight: +weight,
          gst: +gst,
          dimensions: productDimension,
          subItems: processedSubItems,
          packageDimensions: processedPackageDimensions,
        },
      ];

      const payload = {
        products: params,
      };
      const res = await addProductApi(payload).unwrap();
      const whatsappMessage = {
        message: `${name} added new product name: ${productName} with gst: ${gst}`,
        contact: import.meta.env.VITE_ADMIN_CONTACT,
      };
      toast.success("Product added successfully");
      await sendMessageToAdmin(whatsappMessage).unwrap();
      setForm({
        productName: "",
        alternativeName: "",
        brand: "",
        category: "",
        subCategory: "",
        gst: "",
        weight: "",
        productDimension: { width: "", height: "", length: "" },
        subItems: [""],
        packageDimensions: [{ width: "", height: "", length: "", weight: "" }],
      });
      window.location.reload();
    } catch (e) {
      console.log("error At Add Product");
      console.log(e.message);
      toast.error(e.message);
    }
  };
  return (
    <Container
      maxWidth="xl"
      sx={{
        overflow: "hidden",
        height: "80vh",
      }}
    >
      <Loading loading={isLoading} />
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
          
          }}
        >
          {/* header2 */}
          <Box
            sx={{
              width: "100%",
              boxShadow: 3,
              borderRadius: "4px",
              display: "flex",
              justifyContent: "space-around",
              alignContent: "center",
              padding: "1% 1%",
              gap: "1%",
              margin: "12px 4px 4px 4px",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Product Name"
              variant="outlined"
              value={form?.productName}
              onChange={(e) => {
                handleChange("normal", e.target.value, null, "productName");
              }}
              size="small"
              inputProps={{
                style: {
                  width: "24vw",
                },
              }}
            />

            <Autocomplete
              style={{
                width: "20%",
                backgroundColor: "rgba(255, 255, 255)",
              }}
              size="small"
              options={getDynaicValue?.data?.[0]?.Brand || []}
              getOptionLabel={(option) => option}
              onChange={(event, value) => handleSelectedChange(value, "brand")}
              renderInput={(params) => (
                <TextField {...params} label="Brand" value={form.value} />
              )}
            />
            <Autocomplete
              style={{
                width: "20%",
                backgroundColor: "rgba(255, 255, 255)",
              }}
              size="small"
              options={getDynaicValue?.data?.[0]?.Category || []}
              getOptionLabel={(option) => option}
              onChange={(event, value) =>
                handleSelectedChange(value, "category")
              }
              renderInput={(params) => (
                <TextField
                  name="Category"
                  {...params}
                  label="Category"
                  value={form.category}
                />
              )}
            />
            <Autocomplete
              style={{
                width: "20%",
                backgroundColor: "rgba(255, 255, 255)",
              }}
              size="small"
              options={getDynaicValue?.data?.[0]?.SubCategory || []}
              getOptionLabel={(option) => option}
              onChange={(event, value) =>
                handleSelectedChange(value, "subCategory")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sub Category"
                  value={form.subCategory}
                />
              )}
            />
            <Autocomplete
              style={{
                width: "8%",
                backgroundColor: "rgba(255, 255, 255)",
              }}
              size="small"
              options={getDynaicValue?.data?.[0]?.GST || []}
              getOptionLabel={(option) => option}
              onChange={(event, value) => handleSelectedChange(value, "gst")}
              renderInput={(params) => (
                <TextField {...params} label="GST" value={form.gst} />
              )}
            />
            <TextField
              id="outlined-basic"
              label="Alternative Name"
              variant="outlined"
              size="small"
              value={form?.alternativeName}
              onChange={(e) => {
                handleChange("normal", e.target.value, null, "alternativeName");
              }}
              inputProps={{
                style: {
                  width: "24vw",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "80vh",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "start",
              gap: "1%",
            }}
          >
            {/* left */}
            <Box
              sx={{
                width: "40%",
                height: "68.5vh",
                boxShadow: 3,
                borderRadius: "8px",
              }}
            >
              {/* product value header */}

              <Box
                sx={{
                  width: "100%",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  border: "1px solid #D3D3D3",
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
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* value1 */}
                <Box
                  sx={{
                    display: "flex",
                    height: "25%",
                  }}
                >
                  {/* product weight */}
                  <Box
                    sx={{
                      width: "40%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid #D3D3D3",
                    }}
                  >
                   <Box
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                        width: "14vw",
                      }}
                    >

                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      Product Weight
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1vw",
                        height: "10vh",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          sx={{ fontSize: "0.6rem", marginLeft: "4px" }}
                        >
                          Weight<sup>(gm)</sup>
                        </Typography>
                        <TextField
                          id="outlined-basic"
                          placeholder="Weight"
                          type="number"
                          value={form?.weight}
                          onChange={(e) => {
                            handleChange(
                              "normal",
                              e.target.value,
                              null,
                              "weight"
                            );
                          }}
                          variant="outlined"
                          inputProps={{
                            style: {
                              height: "0.2vh",
                              width: "5.5vw",
                            },
                          }}
                        />{" "}
                      </div>
                    </Box>
                  </Box>

                  {/* dimension */}
                  <Box
                    sx={{
                      width: "60%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                        width: "14vw",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                        }}
                      >
                        Dimension(L*B*H)
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1vw",
                        width: "18vw",
                        height: "10vh",
                      }}
                    >
                      {/* lenght */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            marginLeft: "4px",
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
                            marginLeft: "4px",
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
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.6rem",
                            marginLeft: "4px",
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
                    height: "65%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    borderRadius: "8px",
                    borderTop: "1px solid #D3D3D3",
                    gap: "1%",
                    padding: "2%",
                    border: "1px solid #D3D3D3",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "right",
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: "#b5e6f5",
                      }}
                      onClick={handleAddSubItems}
                    >
                      Add Sub Items
                      <AddIcon sx={{ fontSize: "large" }} />
                    </Button>
                  </Box>

                  {/* Box of add subtitle1/2/3 */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "60%",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1%",
                      overflowY: "auto",
                      padding: "4%",
                      boxShadow: 3,
                      borderRadius: "8px",
                    }}
                  >
                    {form?.subItems?.map((subtitle, index) => (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignContent: "center",
                          marginBottom: "2%",
                        }}
                        key={index}
                      >
                        <TextField
                          label={`Subitem-${index + 1}`}
                          variant="outlined"
                          value={form?.subItems[index]}
                          size="small"
                          onChange={(e) => {
                            handleChange("subItem", e.target.value, index);
                          }}
                          inputProps={{
                            style: {
                              width: "6.5vw",
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

                  {/* Submit Button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: "#b5e6f5",
                        marginTop: "1%",
                        paddingX: "8%",
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* right packeging values */}
            <Box
              sx={{
                width: "60%",
                height: "68.5vh",
                boxShadow: 3,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
              }}
            >
              {/* product value header */}
              <Box
                sx={{
                  width: "100%",
                  height: "10%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "4%",
                  border: "1px solid #D3D3D3",
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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    paddingX: "8%",
                    alignItems: "center",
                    borderBottom: "1px solid #D3D3D3",
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
                    height: "70%",
                    borderRadius: "8px",
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
                        label="Weight in (Gm)"
                        type="number"
                        size="small"
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
                            width: "10vw",
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
                          size="small"
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
                            },
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Width(cm)"
                          variant="outlined"
                          type="number"
                          size="small"
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
                              width: "10vw",
                            },
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Height(cm)"
                          variant="outlined"
                          type="number"
                          size="small"
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
                            },
                          }}
                        />

                        {/* Delete Function */}
                        <DeleteIcon
                          sx={{
                            backgroundColor: "#42a5f5",
                            color: "white",
                            height: "24px",
                            width: "24px",
                            borderRadius: "4px",
                            boxShadow: 3,
                            cursor: "pointer",
                            padding: "2px",
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
      </Box>
    </Container>
  );
};

export default AddProductBoxesDetails;
