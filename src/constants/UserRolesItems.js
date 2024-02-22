const userRolesData = [
  {
    title: "Admin",
    icon: "fas fa-user-circle",
    childrens: [
      { id: 1, name: "Users", path: "/Users", icon: "fa-solid fa-user-plus" },
      {
        id: 38,
        name: "Employee Tasks",
        path: "/viewTask",
        icon: "fa fa-tasks",
        notification: true,
      },
      {
        id: 39,
        name: "Portal History",
        path: "/erpHistory",
        icon: "fa fa-history",
        notification: true,
      },
      {
        id: 21,
        name: "Sales Query Admin",
        path: "/viewQuery/admin",
        icon: "fa-solid fa-thumbs-up",
        notification: true,
      },
      {
        id: 64,
        name: "Company Assets",
        path: "/viewAssets",
        icon: "fa-solid fa-thumbs-up",
        notification: true,
      },
      {
        id: 55,
        name: "Scan Assets",
        path: "/scanAssets",
        icon: "fa fa-barcode",
        notification: true,
      },
      {
        id: 59,
        name: "WhatsApp Event",
        path: "/whatsappEvent",
        icon: "fa fa-comment",
        notification: true,
      },
    ],
  },
  {
    title: "Products",
    icon: "fa-brands fa-product-hunt",
    childrens: [
      {
        id: 25,
        name: "Add Product",
        path: "/addRoboProduct",
        icon: "fas fa-plus",
      },
      {
        id: 11,
        name: "Upload Image / Edit",
        path: "/uploadimage",
        icon: "fa-solid fa-image",
      },
      {
        id: 31,
        name: "Product List",
        path: "/product-list",
        icon: "fas fa-list",
      },

      {
        id: 2,
        name: "Update Product",
        path: "/UpdateSellerPrice",
        icon: "fa-solid fa-pen-to-square",
      },
      {
        id: 3,
        name: "Product Status",
        path: "/ProductStatus",
        icon: "fa-solid fa-list",
      },
      {
        id: 61,
        name: "Competitor Comparsion",
        path: "/CompetitorComparsion",
        icon: "fa-solid fa-list",
      },
      {
        id: 51,
        name: "Delete Product",
        path: "/productRemoval",
        icon: "fa-solid fa-skull",
      },
      {
        id: 60,
        name: "Removed Products",
        path: "/removedProduct",
        icon: "fa-solid fa-skull",
      },
      {
        id: 62,
        name: "Add Brand/Category",
        path: "/AddRoboProductsValue",
        icon: "fas fa-plus",
        notification: true,
      },
    ],
  },
  {
    title: "Wholesale Buyer",
    icon: "fas fa-shopping-cart",
    childrens: [
      {
        id: 5,
        name: "WholeSale buyer List",
        path: "/AllSellerList",
        icon: "fa-solid fa-list",
      },
      {
        id: 6,
        name: "Wholesale Orders",
        path: "/orders",
        icon: "fa-solid fa-list",
      },
      {
        id: 7,
        name: "Wholesale Req",
        path: "/sellerVerify",
        icon: "fa-solid fa-user-plus",
      },
    ],
  },

  {
    title: "Account",
    icon: "fas fa-user",
    childrens: [
      {
        id: 30,
        name: "Cost Calculator",
        path: "/calc",
        icon: "fa-solid fa-calculator",
      },
      {
        id: 44,
        name: "Saved Cost Calc",
        path: "/savedCalc",
        icon: "fa-solid fa-calculator",
      },
      {
        id: 4,
        name: "Price History",
        path: "/PriceHistory",
        icon: "fa-solid fa-hand-holding-dollar",
      },
      {
        id: 56,
        name: "Add Proforma",
        path: "/AddProforma",
        icon: "fa fa-file-text",
      },
      {
        id: 57,
        name: "Proforma List",
        path: "/ProformaList",
        icon: "fa fa-list",
      },
      {
        id: 58,
        name: "Proforma Details",
        path: "/ProformaDetails",
        icon: "fa fa-list",
      },
    ],
  },
  {
    title: "Overseas",
    icon: "fas fa-user-circle",
    childrens: [
      {
        id: 8,
        name: "Overseas Vendors",
        path: "/OverseasOrder",
        icon: "fa fa-list",
      },
      {
        id: 24,
        name: "Incoming Shipment",
        path: "/allOverseasShipment",
        icon: "fa fa-truck",
      },
      {
        id: 10,
        name: "Create Restock Order",
        path: "/RestockOrder",
        icon: "fa fa-list",
      },
      {
        id: 9,
        name: "Restock Order Assign",
        path: "/RestockOrderList",
        icon: "fa fa-registered",
      },
      {
        id: 33,
        name: "Restock Order View",
        path: "/RestockOrderView",
        icon: "fa fa-registered",
      },
      {
        id: 46,
        name: "Price Comparison",
        path: "/ComparisionOrder",
        icon: "fa fa-usd",
      },
    ],
  },
  {
    title: "Sales",
    icon: "fas fa-chart-line",
    childrens: [
      {
        id: 22,
        name: "Create Sales Query",
        path: "/discountquery",
        icon: "fa-solid fa-tag",
      },
      {
        id: 23,
        name: "View Query",
        path: "/viewQuery",
        icon: "fa-solid fa-tag",
      },
      {
        id: 29,
        name: "Sales Details",
        path: "/salesDetails",
        icon: "fa fa-list",
      },
    ],
  },
  {
    title: "Barcode",
    icon: "fas fa-barcode",
    childrens: [
      {
        id: 12,
        name: "Generate",
        path: "/generate",
        icon: "fas fa-plus",
      },
      {
        id: 13,
        name: "Barcode Stick",
        path: "/verify",
        icon: "fa fa-barcode",
      },
      {
        id: 14,
        name: "Barcode History",
        path: "/barcodeHistory",
        icon: "fa fa-barcode",
      },
      {
        id: 15,
        name: "Dispatch_Return",
        path: "/dispatch_Return",
        icon: "fa fa-truck",
      },
      {
        id: 46,
        name: "Add Customer",
        path: "/addCustomer",
        icon: "fa-solid fa-user-large",
      },

      {
        id: 26,
        name: "Sub Serial No",
        path: "/SubSerialNumber",
        icon: "fa-solid fa-diagram-next",
      },
      {
        id: 40,
        name: "Create Box Approval",
        path: "/createboxopenapproval",
        icon: "fa fa-archive",
      },
      {
        id: 34,
        name: "Open Box",
        path: "/boxopen",
        icon: "fa fa-archive",
      },
      {
        id: 35,
        name: "Opened Boxes",
        path: "/openboxlist",
        icon: "fa fa-archive",
      },
      {
        id: 36,
        name: "Boxes History",
        path: "/openboxhistory",
        icon: "fa fa-archive",
      },

      {
        id: 42,
        name: "Box Approval Status",
        path: "/boxapprovalstatus",
        icon: "fa fa-archive",
      },
    ],
  },
  {
    title: "Approval",
    icon: "fa fa-check-square",
    childrens: [
      {
        id: 16,
        name: "Stock Approval",
        path: "/Approval/Quantity",
        icon: "fa-solid fa-thumbs-up",
        notification: true,
      },
      {
        id: 17,
        name: "MRP Approval",
        path: "/Approval/MRP",
        icon: "fa-solid fa-thumbs-up",
        notification: true,
      },
      {
        id: 18,
        name: "SalesPrice Approval",
        path: "/Approval/SalesPrice",
        icon: "fa-solid fa-thumbs-up",
        notification: true,
      },
      {
        id: 19,
        name: "SellerPrice Approval",
        path: "/Approval/SellerPrice",
        icon: "fa-solid fa-thumbs-up",
        notification: true,
      },
      {
        id: 20,
        name: "Cost Approval",
        path: "/Approval/LandingCost",
        icon: "fa-solid fa-thumbs-up",
        notification: true,
      },
      {
        id: 41,
        name: "Open Box Approval",
        path: "/boxapprovalstatus?true",
        icon: "fa-solid fa-box",
        notification: true,
      },
      {
        id: 49,
        name: "New Product Approval",
        path: "/NewProductApproval",
        icon: "fa-solid fa-thumbs-up",
        notification: true,
      },
      {
        id: 50,
        name: "Product Changes Approval",
        path: "/changeProductApproval",
        icon: "fa-solid fa-thumbs-up",
        notification: true,
      },
    ],
  },
  {
    title: "Logistics",
    icon: "fa-solid fa-truck-fast",
    childrens: [
      {
        id: 27,
        name: "Inward Logistics",
        path: "/inwardLogistic",
        icon: "fa-solid fa-truck",
        notification: true,
      },

      {
        id: 28,
        name: "Logistics Box Entry",
        path: "/logisticList",
        icon: "fa-solid fa-cart-flatbed",
        notification: true,
      },
      {
        id: 43,
        name: "Customer Shipment",
        path: "/product-shipment",
        icon: "fa-solid fa-cart-flatbed",
        notification: true,
      },
    ],
  },
  {
    title: "DSC",
    icon: "fa fa-wrench",
    childrens: [
      {
        id: 47,
        name: "Entry Form For Repairing",
        path: "/droneRepair",
        icon: "fa fa-wrench",
        notification: true,
      },
      {
        id: 48,
        name: "Drone Models",
        path: "/DynamicInputs",
        icon: "fa fa-wrench",
        notification: true,
      },
      {
        id: 52,
        name: "Add Common Issues",
        path: "/addCommonRepair",
        icon: "fa fa-wrench",
        notification: true,
      },
      {
        id: 53,
        name: "Dsc Form View",
        path: "/FormViewMain",
        icon: "fa-solid fa-truck",
        notification: true,
      },
    ],
  },
  {
    title: "R&D",
    icon: "fa fa-wrench",
    childrens: [
      {
        id: 54,
        name: "All Inventory Data",
        path: "/AllInventoryData",
        icon: "fa fa-wrench",
        notification: true,
      },
      {
        id: 55,
        name: "R&D Projects",
        path: "/ResearchNewProject",
        icon: "fa fa-wrench",
        notification: true,
      },
    ],
  },
  {
    title: "Marketing Tools",
    icon: "fa-solid fa-rectangle-ad",
    childrens: [
      {
        id: 63,
        name: "BulkMessage",
        path: "/BulkMessage",
        icon: "fa fa-comment",
        notification: true,
      },
    ],
  },
];

// last routes is 64

export default userRolesData;
