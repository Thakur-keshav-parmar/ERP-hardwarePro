# Graph Report - G:/desktop/keshav project/inventory management/frontend  (2026-05-18)

## Corpus Check
- 1 files · ~26,888 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 226 nodes · 249 edges · 89 communities (38 shown, 51 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e1f9c8c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Location & Delivery APIs|Location & Delivery APIs]]
- [[_COMMUNITY_Auth & User Management|Auth & User Management]]
- [[_COMMUNITY_Supplier & Redelivery|Supplier & Redelivery]]
- [[_COMMUNITY_Inventory & Stock|Inventory & Stock]]
- [[_COMMUNITY_Themes & Cart UI|Themes & Cart UI]]
- [[_COMMUNITY_Billing & AWS Config|Billing & AWS Config]]
- [[_COMMUNITY_Customer & Vehicle Management|Customer & Vehicle Management]]
- [[_COMMUNITY_WhatsApp & Purchase Orders|WhatsApp & Purchase Orders]]
- [[_COMMUNITY_AI Admin Chat|AI Admin Chat]]
- [[_COMMUNITY_Analytics & Downloads|Analytics & Downloads]]
- [[_COMMUNITY_Opencameramodal|Opencameramodal]]
- [[_COMMUNITY_Currentmode|Currentmode]]
- [[_COMMUNITY_Heldbilldata|Heldbilldata]]
- [[_COMMUNITY_Activebillid|Activebillid]]
- [[_COMMUNITY_Deliverymap|Deliverymap]]
- [[_COMMUNITY_Selectedvehicle|Selectedvehicle]]
- [[_COMMUNITY_Allsuppliers|Allsuppliers]]
- [[_COMMUNITY_Allpurchaseorders|Allpurchaseorders]]
- [[_COMMUNITY_Allstocklogs|Allstocklogs]]
- [[_COMMUNITY_Pin State Map|Pin State Map]]
- [[_COMMUNITY_Is Ebill View|Is Ebill View]]
- [[_COMMUNITY_Lib Inter Font|Lib Inter Font]]
- [[_COMMUNITY_Endpoint Products|Endpoint Products]]
- [[_COMMUNITY_Endpoint Users|Endpoint Users]]
- [[_COMMUNITY_Endpoint Create Order|Endpoint Create Order]]
- [[_COMMUNITY_Endpoint Confirm Payment|Endpoint Confirm Payment]]
- [[_COMMUNITY_Ui Login Screen|Ui Login Screen]]
- [[_COMMUNITY_Ui Retailer Mode|Ui Retailer Mode]]
- [[_COMMUNITY_Ui Return Mode|Ui Return Mode]]
- [[_COMMUNITY_Ui Admin Panel|Ui Admin Panel]]
- [[_COMMUNITY_Ui Delivery Dashboard|Ui Delivery Dashboard]]
- [[_COMMUNITY_Ui Tab Inventory|Ui Tab Inventory]]
- [[_COMMUNITY_Ui Tab Analytics|Ui Tab Analytics]]
- [[_COMMUNITY_Ui Tab Logs|Ui Tab Logs]]
- [[_COMMUNITY_Ui Tab Staff|Ui Tab Staff]]
- [[_COMMUNITY_Ui Tab Settings|Ui Tab Settings]]
- [[_COMMUNITY_Ui Tab Delivery Admin|Ui Tab Delivery Admin]]
- [[_COMMUNITY_Ui Tab Suppliers|Ui Tab Suppliers]]
- [[_COMMUNITY_Ui Tab Purchase Orders|Ui Tab Purchase Orders]]
- [[_COMMUNITY_Ui Tab Ai Chat|Ui Tab Ai Chat]]
- [[_COMMUNITY_Ui Tab Stock Movement|Ui Tab Stock Movement]]
- [[_COMMUNITY_Ui Receipt Modal|Ui Receipt Modal]]
- [[_COMMUNITY_Ui Delivery Modal|Ui Delivery Modal]]
- [[_COMMUNITY_Ui Camera Modal|Ui Camera Modal]]
- [[_COMMUNITY_Ui Floating Ai Chat|Ui Floating Ai Chat]]
- [[_COMMUNITY_Ui Cart Sidebar|Ui Cart Sidebar]]
- [[_COMMUNITY_Ui Topnav|Ui Topnav]]
- [[_COMMUNITY_Ui Product Grid|Ui Product Grid]]
- [[_COMMUNITY_Css Theme System|Css Theme System]]
- [[_COMMUNITY_Concept Login Ratelimit|Concept Login Ratelimit]]
- [[_COMMUNITY_Concept Session Timeout|Concept Session Timeout]]
- [[_COMMUNITY_Concept Sha256 Auth|Concept Sha256 Auth]]
- [[_COMMUNITY_Concept Checkout Flow|Concept Checkout Flow]]
- [[_COMMUNITY_Concept Delivery Fee Calc|Concept Delivery Fee Calc]]
- [[_COMMUNITY_Concept Ebill Url|Concept Ebill Url]]
- [[_COMMUNITY_Concept Whatsapp Receipt|Concept Whatsapp Receipt]]
- [[_COMMUNITY_Concept Otp Delivery Confirm|Concept Otp Delivery Confirm]]
- [[_COMMUNITY_Concept Role Based Access|Concept Role Based Access]]
- [[_COMMUNITY_Concept Image Compression|Concept Image Compression]]
- [[_COMMUNITY_Concept Gst Calculation|Concept Gst Calculation]]
- [[_COMMUNITY_Concept Offline Mode|Concept Offline Mode]]

## God Nodes (most connected - your core abstractions)
1. `apiPost()` - 17 edges
2. `finalizeTransaction()` - 16 edges
3. `window.onload (App Initialization)` - 13 edges
4. `products (Global Array)` - 11 edges
5. `handleLogin()` - 11 edges
6. `storeSettings (Global Object)` - 9 edges
7. `renderCartSide()` - 9 edges
8. `switchMode()` - 9 edges
9. `transactions (Global Array)` - 8 edges
10. `renderGrid()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `API Base URL Variable` --references--> `AWS Configuration Object`  [EXTRACTED]
  index.html → index.html  _Bridges community 5 → community 3_
- `openReceiptModal()` --references--> `products (Global Array)`  [EXTRACTED]
  index.html → index.html  _Bridges community 4 → community 2_
- `finalizeTransaction()` --references--> `products (Global Array)`  [EXTRACTED]
  index.html → index.html  _Bridges community 4 → community 5_
- `renderAdmin()` --references--> `products (Global Array)`  [EXTRACTED]
  index.html → index.html  _Bridges community 4 → community 3_
- `renderChart()` --references--> `products (Global Array)`  [EXTRACTED]
  index.html → index.html  _Bridges community 4 → community 6_

## Hyperedges (group relationships)
- **Checkout Workflow** — index_updateCart, index_renderCartSide, index_openReceiptModal, index_startPaymentFlow, index_openRazorpayCheckout, index_payByCash, index_finalizeTransaction, index_sendWhatsAppReceipt [INFERRED 0.95]
- **Authentication Workflow** — index_handleLogin, index_hashPassword, index_checkLoginRateLimit, index_recordFailedLogin, index_resetSessionTimer, index_setupUIForRole, index_requestOTP, index_verifyOTP, index_saveNewPassword [EXTRACTED 1.00]
- **Delivery Workflow** — index_openDeliveryModal, index_searchDeliveryLocation, index_validateAndRoute, index_updateDeliveryUI, index_selectVehicle, index_confirmDelivery, index_updateDeliveryStatus, index_confirmDeliveryOtp, index_sendWhatsAppDeliveryUpdate [INFERRED 0.95]
- **Inventory Management Module** — index_renderAdmin, index_addItem, index_editProduct, index_delItem, index_quickRestock, index_applyBulkMarkup, index_applyStockOutSale, index_toggleExpirySortPanel, index_toggleExpiringPanel, index_loadStockLogs [INFERRED 0.95]
- **Supplier & Purchase Order Module** — index_loadSuppliers, index_saveSupplier, index_editSupplier, index_deleteSupplier, index_loadPurchaseOrders, index_createPurchaseOrder, index_markPOReceived, index_sendPOWhatsApp, index_confirmPO, index_cancelPO, index_printPO [INFERRED 0.95]
- **Analytics & Reporting Module** — index_renderChart, index_renderMonthlyCollectionChart, index_handleExport, index_getSalesData, index_getStockLeftData, index_getStockSoldData, index_getNetProfitData, index_exportLogsCSV, index_renderAdminStatCards [INFERRED 0.95]
- **AI Admin Assistant Module** — index_aiTabQuery, index_aiTabAppend, index_fcQuery, index_fcAppend, index_fcToggle, index_hasProductList, index_generateDownload, index_appendDownloadButtons, endpoint_admin_chat [INFERRED 0.95]
- **External API Dependencies** — ext_nominatim, ext_osrm, ext_whatsapp, endpoint_whatsapp, endpoint_products, endpoint_bills, endpoint_users, endpoint_settings, endpoint_stock_logs, endpoint_suppliers, endpoint_purchase_orders, endpoint_create_order, endpoint_confirm_payment, endpoint_admin_chat [INFERRED 0.85]
- **CDN External Libraries** — lib_chartjs, lib_razorpay, lib_html5qrcode, lib_jspdf, lib_jspdf_autotable, lib_leaflet, lib_inter_font [EXTRACTED 1.00]
- **Global Application State** — index_products, index_cart, index_transactions, index_storeSettings, index_users, index_currentUser, index_currentMode, index_vehicles, index_deliveryFee, index_activeBillId, index_heldBillData, index_allSuppliers, index_allPurchaseOrders, index_allStockLogs [EXTRACTED 1.00]

## Communities (89 total, 51 thin omitted)

### Community 0 - "Location & Delivery APIs"
Cohesion: 0.12
Nodes (20): API /settings Endpoint, Nominatim (OpenStreetMap Geocoding API), OSRM Routing API, applyStoreLogo(), buildDeliveryAddress(), deliveryFee (Computed Delivery Fee), dvAddVehicle(), dvSaveDelivery() (+12 more)

### Community 1 - "Auth & User Management"
Cohesion: 0.13
Nodes (15): addUser(), changeUserPassword(), currentUser (Global Variable), delUser(), generateSecureOTP(), handleLogin(), hashPassword(), renderStaff() (+7 more)

### Community 2 - "Supplier & Redelivery"
Cohesion: 0.14
Nodes (13): API /suppliers Endpoint, _finalizeRedelivery(), confirmDelivery(), deleteSupplier(), generateSecureId(), loadSuppliers(), openReceiptModal(), renderDeliveryDashboard() (+5 more)

### Community 3 - "Inventory & Stock"
Cohesion: 0.18
Nodes (14): API /stock-logs Endpoint, API Base URL Variable, addItem(), apiDelete(), apiGet(), apiPost(), applyBulkMarkup(), changeCatInline() (+6 more)

### Community 4 - "Themes & Cart UI"
Cohesion: 0.22
Nodes (14): cart (Global Array), closeCameraModal(), goToProduct(), onScanSuccess(), products (Global Array), renderAdminStatCards(), renderCartSide(), renderCategories() (+6 more)

### Community 5 - "Billing & AWS Config"
Cohesion: 0.16
Nodes (10): API /bills Endpoint, AWS Configuration Object, closeAll(), closeDeliveryModal(), closeModal(), createOrderInBackend(), finalizeTransaction(), openRazorpayCheckout() (+2 more)

### Community 6 - "Customer & Vehicle Management"
Cohesion: 0.16
Nodes (12): deleteCustomer(), dvDeleteVehicle(), dvRenderVehicles(), profitChartInstance (Chart.js Instance), renderChart(), renderDeliveryTab(), renderLogsAndCustomers(), renderMonthlyCollectionChart() (+4 more)

### Community 7 - "WhatsApp & Purchase Orders"
Cohesion: 0.32
Nodes (7): API /purchase-orders Endpoint, API /whatsapp Endpoint, WhatsApp wa.me Link, createPurchaseOrder(), loadPurchaseOrders(), sendPOWhatsApp(), sendWhatsAppReceipt()

### Community 8 - "AI Admin Chat"
Cohesion: 0.32
Nodes (7): API /admin-chat Endpoint (Groq AI), aiTabAppend(), aiTabQuery(), appendDownloadButtons(), fcAppend(), fcQuery() - Floating Chat Query, hasProductList()

### Community 9 - "Analytics & Downloads"
Cohesion: 0.25
Nodes (3): handleExport(), jsPDF 4.2.1, jsPDF AutoTable 5.0.7

## Knowledge Gaps
- **59 isolated node(s):** `currentUser (Global Variable)`, `currentMode (Global Variable)`, `heldBillData (Hold Bill State)`, `activeBillId (Current Bill ID)`, `salesChartInstance (Chart.js Instance)` (+54 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `apiPost()` connect `Inventory & Stock` to `Location & Delivery APIs`, `Auth & User Management`, `Supplier & Redelivery`, `Billing & AWS Config`, `Customer & Vehicle Management`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `switchAdminTab()` connect `Customer & Vehicle Management` to `Auth & User Management`, `Supplier & Redelivery`, `Themes & Cart UI`, `WhatsApp & Purchase Orders`, `AI Admin Chat`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `finalizeTransaction()` connect `Billing & AWS Config` to `Inventory & Stock`, `Themes & Cart UI`, `Customer & Vehicle Management`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `currentUser (Global Variable)`, `currentMode (Global Variable)`, `heldBillData (Hold Bill State)` to the rest of the system?**
  _59 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Location & Delivery APIs` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Auth & User Management` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Supplier & Redelivery` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._