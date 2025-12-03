"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Navdata = () => {
  const router = useRouter();
  //state data
  const [isDashboard, setIsDashboard] = useState<boolean>(false);
  const [isApps, setIsApps] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isPages, setIsPages] = useState<boolean>(false);
  const [isBaseUi, setIsBaseUi] = useState<boolean>(false);
  const [isCharts, setIsCharts] = useState<boolean>(false);
  const [isIcons, setIsIcons] = useState<boolean>(false);
  const [isUsers, setIsUsers] = useState<boolean>(false);

  // Apps
  const [isCalendar, setCalendar] = useState<boolean>(false);
  const [isEmail, setEmail] = useState<boolean>(false);
  const [isSubEmail, setSubEmail] = useState<boolean>(false);
  const [isEcommerce, setIsEcommerce] = useState<boolean>(false);
  const [isProjects, setIsProjects] = useState<boolean>(false);
  const [isTasks, setIsTasks] = useState<boolean>(false);
  const [isCRM, setIsCRM] = useState<boolean>(false);
  const [isCrypto, setIsCrypto] = useState<boolean>(false);
  const [isInvoices, setIsInvoices] = useState<boolean>(false);
  const [isSupportTickets, setIsSupportTickets] = useState<boolean>(false);
  const [isJobs, setIsJobs] = useState<boolean>(false);
  const [isJobList, setIsJobList] = useState<boolean>(false);
  const [isCandidateList, setIsCandidateList] = useState<boolean>(false);

  // Authentication
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
  const [isPasswordCreate, setIsPasswordCreate] = useState<boolean>(false);
  const [isVerification, setIsVerification] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Pages
  const [isProfile, setIsProfile] = useState<boolean>(false);
  const [isLanding, setIsLanding] = useState<boolean>(false);
  const [isBlog, setIsBlog] = useState<boolean>(false);

  // Charts
  const [isApex, setIsApex] = useState<boolean>(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("sub-items")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach(item => {
        item.classList.remove("active");
        var id = item.getAttribute("sub-items");
        const getID = document.getElementById(id) as HTMLElement;
        if (getID) getID.classList.remove("show");
      });
    }
  }

  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/#",
      stateVariables: isDashboard,
      click: function (e: any) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "analytics",
          label: "Analytics",
          link: "/dashboard-analytics",
          parentId: "dashboard",
        },
        {
          id: "crm",
          label: "CRM",
          link: "/dashboard-crm",
          parentId: "dashboard",
        },
        {
          id: "ecommerce",
          label: "Ecommerce",
          link: "/dashboard",
          parentId: "dashboard",
        },
        {
          id: "crypto",
          label: "Crypto",
          link: "/dashboard-crypto",
          parentId: "dashboard",
        },
        {
          id: "projects",
          label: "Projects",
          link: "/dashboard-projects",
          parentId: "dashboard",
        },
        {
          id: "nft",
          label: "NFT",
          link: "/dashboard-nft",
          parentId: "dashboard",
        },
        {
          id: "job",
          label: "Job",
          link: "/dashboard-job",
          parentId: "dashboard",
          // badgeColor: "success",
          // badgeName: "New",
        },
        {
          id: "blog",
          label: "Blog",
          link: "/dashboard-blog",
          parentId: "dashboard",
          badgeColor: "success",
          badgeName: "New",
        },
      ],
    },
    {
      id: "apps",
      label: "Apps",
      icon: "ri-apps-2-line",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
      subItems: [
        {
          id: "calendar",
          label: "Calendar",
          link: "/#",
          parentId: "apps",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setCalendar(!isCalendar);
          },
          stateVariables: isCalendar,
          childItems: [
            {
              id: 1,
              label: "Main Calendar",
              link: "/apps-calendar",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Month Grid",
              link: "/apps-calendar-month-grid",
              parentId: "apps",
            },
          ],
        },
        {
          id: "chat",
          label: "Chat",
          link: "/apps-chat",
          parentId: "apps",
        },
        {
          id: "mailbox",
          label: "Email",
          link: "/#",
          parentId: "apps",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setEmail(!isEmail);
          },
          stateVariables: isEmail,
          childItems: [
            {
              id: 1,
              label: "Mailbox",
              link: "/apps-mailbox",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Email Templates",
              link: "/#",
              parentId: "apps",
              isChildItem: true,
              stateVariables: isSubEmail,
              click: function (e: any) {
                e.preventDefault();
                setSubEmail(!isSubEmail);
              },
              childItems: [
                {
                  id: 2,
                  label: "Basic Action",
                  link: "/apps-email-basic",
                  parentId: "apps",
                },
                {
                  id: 3,
                  label: "Ecommerce Action",
                  link: "/apps-email-ecommerce",
                  parentId: "apps",
                },
              ],
            },
          ],
        },
        {
          id: "appsecommerce",
          label: "Ecommerce",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsEcommerce(!isEcommerce);
          },
          parentId: "apps",
          stateVariables: isEcommerce,
          childItems: [
            {
              id: 1,
              label: "Products",
              link: "/apps-ecommerce-products",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Product Details",
              link: "/apps-ecommerce-product-details",
              parentId: "apps",
            },
            {
              id: 3,
              label: "Create Product",
              link: "/apps-ecommerce-add-product",
              parentId: "apps",
            },
            {
              id: 4,
              label: "Orders",
              link: "/apps-ecommerce-orders",
              parentId: "apps",
            },
            {
              id: 5,
              label: "Order Details",
              link: "/apps-ecommerce-order-details",
              parentId: "apps",
            },
            {
              id: 6,
              label: "Customers",
              link: "/apps-ecommerce-customers",
              parentId: "apps",
            },
            {
              id: 7,
              label: "Shopping Cart",
              link: "/apps-ecommerce-cart",
              parentId: "apps",
            },
            {
              id: 8,
              label: "Checkout",
              link: "/apps-ecommerce-checkout",
              parentId: "apps",
            },
            {
              id: 9,
              label: "Sellers",
              link: "/apps-ecommerce-sellers",
              parentId: "apps",
            },
            {
              id: 10,
              label: "Seller Details",
              link: "/apps-ecommerce-seller-details",
              parentId: "apps",
            },
          ],
        },
        {
          id: "appsprojects",
          label: "Projects",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsProjects(!isProjects);
          },
          parentId: "apps",
          stateVariables: isProjects,
          childItems: [
            {
              id: 1,
              label: "List",
              link: "/apps-projects-list",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Overview",
              link: "/apps-projects-overview",
              parentId: "apps",
            },
            {
              id: 3,
              label: "Create Project",
              link: "/apps-projects-create",
              parentId: "apps",
            },
          ],
        },
        {
          id: "tasks",
          label: "Tasks",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsTasks(!isTasks);
          },
          parentId: "apps",
          stateVariables: isTasks,
          childItems: [
            {
              id: 1,
              label: "Kanban Board",
              link: "/apps-tasks-kanban",
              parentId: "apps",
            },
            {
              id: 2,
              label: "List View",
              link: "/apps-tasks-list-view",
              parentId: "apps",
            },
            {
              id: 3,
              label: "Task Details",
              link: "/apps-tasks-details",
              parentId: "apps",
            },
          ],
        },
        {
          id: "appscrm",
          label: "CRM",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsCRM(!isCRM);
          },
          parentId: "apps",
          stateVariables: isCRM,
          childItems: [
            { id: 1, label: "Contacts", link: "/apps-crm-contacts" },
            { id: 2, label: "Companies", link: "/apps-crm-companies" },
            { id: 3, label: "Deals", link: "/apps-crm-deals" },
            { id: 4, label: "Leads", link: "/apps-crm-leads" },
          ],
        },
        {
          id: "appscrypto",
          label: "Crypto",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsCrypto(!isCrypto);
          },
          parentId: "apps",
          stateVariables: isCrypto,
          childItems: [
            { id: 1, label: "Transactions", link: "/apps-crypto-transactions" },
            { id: 2, label: "Buy & Sell", link: "/apps-crypto-buy-sell" },
            { id: 3, label: "Orders", link: "/apps-crypto-orders" },
            { id: 4, label: "My Wallet", link: "/apps-crypto-wallet" },
            { id: 5, label: "ICO List", link: "/apps-crypto-ico" },
            { id: 6, label: "KYC Application", link: "/apps-crypto-kyc" },
          ],
        },
        {
          id: "invoices",
          label: "Invoices",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsInvoices(!isInvoices);
          },
          parentId: "apps",
          stateVariables: isInvoices,
          childItems: [
            { id: 1, label: "List View", link: "/apps-invoices-list" },
            { id: 2, label: "Details", link: "/apps-invoices-details" },
            { id: 3, label: "Create Invoice", link: "/apps-invoices-create" },
          ],
        },
        {
          id: "supportTickets",
          label: "Support Tickets",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsSupportTickets(!isSupportTickets);
          },
          parentId: "apps",
          stateVariables: isSupportTickets,
          childItems: [
            { id: 1, label: "List View", link: "/apps-tickets-list" },
            { id: 2, label: "Ticket Details", link: "/apps-tickets-details" },
          ],
        },
        {
          id: "todo",
          label: "To Do",
          link: "/apps-todo",
          parentId: "apps",
        },
        {
          id: "job",
          label: "Jobs",
          link: "/#",
          parentId: "apps",
          // badgeName: "New",
          // badgeColor: "success",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsJobs(!isJobs);
          },
          stateVariables: isJobs,
          childItems: [
            {
              id: 1,
              label: "Statistics",
              link: "/apps-job-statistics",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Job Lists",
              link: "/#",
              parentId: "apps",
              isChildItem: true,
              stateVariables: isJobList,
              click: function (e: any) {
                e.preventDefault();
                setIsJobList(!isJobList);
              },
              childItems: [
                {
                  id: 1,
                  label: "List",
                  link: "/apps-job-lists",
                  parentId: "apps",
                },
                {
                  id: 2,
                  label: "Grid",
                  link: "/apps-job-grid-lists",
                  parentId: "apps",
                },
                {
                  id: 3,
                  label: "Overview",
                  link: "/apps-job-details",
                  parentId: "apps",
                },
              ],
            },
            {
              id: 3,
              label: "Candidate Lists",
              link: "/#",
              parentId: "apps",
              isChildItem: true,
              stateVariables: isCandidateList,
              click: function (e: any) {
                e.preventDefault();
                setIsCandidateList(!isCandidateList);
              },
              childItems: [
                {
                  id: 1,
                  label: "List View",
                  link: "/apps-job-candidate-lists",
                  parentId: "apps",
                },
                {
                  id: 2,
                  label: "Grid View",
                  link: "/apps-job-candidate-grid",
                  parentId: "apps",
                },
              ],
            },
            {
              id: 4,
              label: "Application",
              link: "/apps-job-application",
              parentId: "apps",
            },
            {
              id: 5,
              label: "New Job",
              link: "/apps-job-new",
              parentId: "apps",
            },
            {
              id: 6,
              label: "Companies List",
              link: "/apps-job-companies-lists",
              parentId: "apps",
            },
            {
              id: 7,
              label: "Job Categories",
              link: "/apps-job-categories",
              parentId: "apps",
            },
          ],
        },
        {
          id: "apikey",
          label: "API Key",
          link: "/apps-api-key",
          parentId: "apps",
          // badgeName: "New",
          // badgeColor: "success"
        },
      ],
    },
    {
      label: "pages",
      isHeader: true,
    },
    {
      id: "authentication",
      label: "Authentication",
      icon: "ri-account-circle-line",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsAuth(!isAuth);
        setIscurrentState("Auth");
        updateIconSidebar(e);
      },
      stateVariables: isAuth,
      subItems: [
        {
          id: "signIn",
          label: "Sign In",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsSignIn(!isSignIn);
          },
          parentId: "authentication",
          stateVariables: isSignIn,
          childItems: [
            { id: 1, label: "Basic", link: "/authinner/signin/basic" },
            { id: 2, label: "Cover", link: "/authinner/signin/cover" },
          ],
        },
        {
          id: "signUp",
          label: "Sign Up",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsSignUp(!isSignUp);
          },
          parentId: "authentication",
          stateVariables: isSignUp,
          childItems: [
            { id: 1, label: "Basic", link: "/authinner/signup/basic" },
            { id: 2, label: "Cover", link: "/authinner/signup/cover" },
          ],
        },
        {
          id: "passwordReset",
          label: "Password Reset",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsPasswordReset(!isPasswordReset);
          },
          parentId: "authentication",
          stateVariables: isPasswordReset,
          childItems: [
            { id: 1, label: "Basic", link: "/authinner/pass/reset/basic" },
            { id: 2, label: "Cover", link: "/authinner/pass/reset/cover" },
          ],
        },
        {
          id: "passwordCreate",
          label: "Password Create",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsPasswordCreate(!isPasswordCreate);
          },
          parentId: "authentication",
          stateVariables: isPasswordCreate,
          childItems: [
            { id: 1, label: "Basic", link: "/authinner/pass/change/basic" },
            { id: 2, label: "Cover", link: "/authinner/pass/change/cover" },
          ],
        },

        {
          id: "twoStepVerification",
          label: "Two Step Verification",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsVerification(!isVerification);
          },
          parentId: "authentication",
          stateVariables: isVerification,
          childItems: [
            { id: 1, label: "Basic", link: "/authinner/twostep/basic" },
            { id: 2, label: "Cover", link: "/authinner/twostep/cover" },
          ],
        },
        {
          id: "errors",
          label: "Errors",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsError(!isError);
          },
          parentId: "authentication",
          stateVariables: isError,
          childItems: [
            { id: 1, label: "404 Basic", link: "/authinner/404/basic" },
            { id: 2, label: "404 Cover", link: "/authinner/404/cover" },
            { id: 3, label: "404 Alt", link: "/authinner/404/alt" },
            { id: 4, label: "500", link: "/authinner/500" },
            { id: 5, label: "Offline Page", link: "/authinner/offline" },
          ],
        },
      ],
    },
    {
      id: "pages",
      label: "Pages",
      icon: "ri-pages-line",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsPages(!isPages);
        setIscurrentState("Pages");
        updateIconSidebar(e);
      },
      stateVariables: isPages,
      subItems: [
        {
          id: "starter",
          label: "Starter",
          link: "/pages/starter",
          parentId: "pages",
        },
        {
          id: "profile",
          label: "Profile",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsProfile(!isProfile);
          },
          parentId: "pages",
          stateVariables: isProfile,
          childItems: [
            {
              id: 1,
              label: "Simple Page",
              link: "/pages/profile",
              parentId: "pages",
            },
            {
              id: 2,
              label: "Settings",
              link: "/pages/profile-settings",
              parentId: "pages",
            },
          ],
        },
        { id: "team", label: "Team", link: "/pages/team", parentId: "pages" },
        {
          id: "timeline",
          label: "Timeline",
          link: "/pages/timeline",
          parentId: "pages",
        },
        { id: "faqs", label: "FAQs", link: "/pages/faqs", parentId: "pages" },
        {
          id: "pricing",
          label: "Pricing",
          link: "/pages/pricing",
          parentId: "pages",
        },
        {
          id: "gallery",
          label: "Gallery",
          link: "/pages/gallery",
          parentId: "pages",
        },

        {
          id: "blogs",
          label: "Blogs",
          link: "/#",
          isChildItem: true,
          badgeColor: "success",
          badgeName: "New",
          click: function (e: any) {
            e.preventDefault();
            setIsBlog(!isBlog);
          },
          parentId: "pages",
          stateVariables: isBlog,
          childItems: [
            {
              id: 1,
              label: "List View",
              link: "/pages/blog-list",
              parentId: "pages",
            },
            {
              id: 2,
              label: "Grid View",
              link: "/pages/blog-grid",
              parentId: "pages",
            },
            {
              id: 3,
              label: "Overview",
              link: "/pages/blog-overview",
              parentId: "pages",
            },
          ],
        },
      ],
    },

    {
      label: "Components",
      isHeader: true,
    },
    {
      id: "baseUi",
      label: "Base UI",
      icon: "ri-pencil-ruler-2-line",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsBaseUi(!isBaseUi);
        setIscurrentState("BaseUi");
        updateIconSidebar(e);
      },
      stateVariables: isBaseUi,
      subItems: [
        {
          id: "alerts",
          label: "Alerts",
          link: "/ui/alerts",
          parentId: "baseUi",
        },
        {
          id: "badges",
          label: "Badges",
          link: "/ui/badges",
          parentId: "baseUi",
        },
        {
          id: "buttons",
          label: "Buttons",
          link: "/ui/buttons",
          parentId: "baseUi",
        },
        {
          id: "colors",
          label: "Colors",
          link: "/ui/colors",
          parentId: "baseUi",
        },
        { id: "cards", label: "Cards", link: "/ui/cards", parentId: "baseUi" },
        {
          id: "carousel",
          label: "Carousel",
          link: "/ui/carousel",
          parentId: "baseUi",
        },
        {
          id: "dropdowns",
          label: "Dropdowns",
          link: "/ui/dropdowns",
          parentId: "baseUi",
        },
        { id: "grid", label: "Grid", link: "/ui/grid", parentId: "baseUi" },
        {
          id: "images",
          label: "Images",
          link: "/ui/images",
          parentId: "baseUi",
        },
        { id: "tabs", label: "Tabs", link: "/ui/tabs", parentId: "baseUi" },
        {
          id: "accordions",
          label: "Accordion & Collapse",
          link: "/ui/accordions",
          parentId: "baseUi",
        },
        {
          id: "modals",
          label: "Modals",
          link: "/ui/modals",
          parentId: "baseUi",
        },
        {
          id: "offcanvas",
          label: "Offcanvas",
          link: "/ui/offcanvas",
          parentId: "baseUi",
        },
        {
          id: "placeholders",
          label: "Placeholders",
          link: "/ui/placeholders",
          parentId: "baseUi",
        },
        {
          id: "progress",
          label: "Progress",
          link: "/ui/progress",
          parentId: "baseUi",
        },
        {
          id: "notifications",
          label: "Notifications",
          link: "/ui/notifications",
          parentId: "baseUi",
        },
        {
          id: "media",
          label: "Media object",
          link: "/ui/media",
          parentId: "baseUi",
        },
        {
          id: "embedvideo",
          label: "Embed Video",
          link: "/ui/embed-video",
          parentId: "baseUi",
        },
        {
          id: "typography",
          label: "Typography",
          link: "/ui/typography",
          parentId: "baseUi",
        },
        { id: "lists", label: "Lists", link: "/ui/lists", parentId: "baseUi" },
        {
          id: "links",
          label: "Links",
          link: "/ui/links",
          parentId: "baseUi",
          badgeColor: "success",
          badgeName: "New",
        },
        {
          id: "general",
          label: "General",
          link: "/ui/general",
          parentId: "baseUi",
        },
        {
          id: "ribbons",
          label: "Ribbons",
          link: "/ui/ribbons",
          parentId: "baseUi",
        },
        {
          id: "utilities",
          label: "Utilities",
          link: "/ui/utilities",
          parentId: "baseUi",
        },
      ],
    },

    {
      id: "widgets",
      label: "Widgets",
      icon: "ri-honour-line",
      link: "/widgets",
      click: function (e: any) {
        e.preventDefault();
        setIscurrentState("Widgets");
      },
    },

    {
      id: "charts",
      label: "Charts",
      icon: "ri-pie-chart-line",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsCharts(!isCharts);
        setIscurrentState("Charts");
        updateIconSidebar(e);
      },
      stateVariables: isCharts,
      subItems: [
        {
          id: "apexcharts",
          label: "Apexcharts",
          link: "/#",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsApex(!isApex);
          },
          stateVariables: isApex,
          childItems: [
            { id: 1, label: "Line", link: "/charts/apex-line" },
            { id: 2, label: "Area", link: "/charts/apex-area" },
            { id: 3, label: "Column", link: "/charts/apex-column" },
            { id: 4, label: "Bar", link: "/charts/apex-bar" },
            { id: 5, label: "Mixed", link: "/charts/apex-mixed" },
            { id: 6, label: "Timeline", link: "/charts/apex-timeline" },
            {
              id: 7,
              label: "Range Area",
              link: "/charts/apex-range-area",
              parentId: "apexcharts",
              badgeColor: "success",
              badgeName: "New",
            },
            {
              id: 8,
              label: "Funnel",
              link: "/charts/apex-funnel",
              parentId: "apexcharts",
              badgeColor: "success",
              badgeName: "New",
            },
            { id: 9, label: "Candlstick", link: "/charts/apex-candlestick" },
            { id: 10, label: "Boxplot", link: "/charts/apex-boxplot" },
            { id: 11, label: "Bubble", link: "/charts/apex-bubble" },
            { id: 12, label: "Scatter", link: "/charts/apex-scatter" },
            { id: 13, label: "Heatmap", link: "/charts/apex-heatmap" },
            { id: 14, label: "Treemap", link: "/charts/apex-treemap" },
            { id: 15, label: "Pie", link: "/charts/apex-pie" },
            { id: 16, label: "Radialbar", link: "/charts/apex-radialbar" },
            { id: 17, label: "Radar", link: "/charts/apex-radar" },
            { id: 18, label: "Polar Area", link: "/charts/apex-polar" },
            {
              id: 19,
              label: "Slope",
              link: "/charts/apex-slope",
              parentId: "charts",
              badgeColor: "success",
              badgeName: "New",
            },
          ],
        },
        {
          id: "chartjs",
          label: "Chartjs",
          link: "/charts/chartjs",
          parentId: "charts",
        },
        {
          id: "echarts",
          label: "Echarts",
          link: "/charts/echarts",
          parentId: "charts",
        },
      ],
    },
    {
      id: "icons",
      label: "Icons",
      icon: "ri-compasses-2-line",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsIcons(!isIcons);
        setIscurrentState("Icons");
        updateIconSidebar(e);
      },
      stateVariables: isIcons,
      subItems: [
        {
          id: "remix",
          label: "Remix",
          link: "/icons/remix",
          parentId: "icons",
        },
        {
          id: "boxicons",
          label: "Boxicons",
          link: "/icons/boxicons",
          parentId: "icons",
        },
        {
          id: "materialdesign",
          label: "Material Design",
          link: "/icons/materialdesign",
          parentId: "icons",
        },
        {
          id: "lineawesome",
          label: "Line Awesome",
          link: "/icons/lineawesome",
          parentId: "icons",
        },
        {
          id: "feather",
          label: "Feather",
          link: "/icons/feather",
          parentId: "icons",
        },
        {
          id: "crypto",
          label: "Crypto SVG",
          link: "/icons/crypto",
          parentId: "icons",
        },
      ],
    },
    {
      id: "users",
      label: "User Management",
      icon: "ri-group-line",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsUsers(!isUsers);
        setIscurrentState("Users");
        updateIconSidebar(e);
      },
      stateVariables: isUsers,
      subItems: [
        {
          id: "staff",
          label: "Staff Roles",
          link: "/admin/users/staff",
          parentId: "users",
        },
        {
          id: "registered",
          label: "Registered Users",
          link: "/admin/users/registered",
          parentId: "users",
        },
      ],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
