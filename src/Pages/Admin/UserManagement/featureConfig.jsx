export const FEATURE_CONFIG = {
  MAIN: {
    title: "Main",
    features: {
      portfolio_insights_enabled: "Portfolio Voice",
      email_drafting_enabled: "Email Drafting",
      gemini_chat_enabled: "Gemini Chat",
      notes_enabled: "Notes",
      forum_enabled: "Portfolio Forum",
      ai_lease_abstract_enabled: "AI Lease Abstract",
      information_collaboration_enabled: "Information Collaboration",
      det_enabled: "DET",
      dct_enabled: "DCT",
      calculator_enabled: "Calculator",
      yardi_enabled: "Yardi",
      Conversation: "Message",
      project_management_enabled: "Project Management",
      space_up_enabled: "Space Up",
    },
  },

  DATA_CATEGORY: {
    title: "Data Category",
    features: {
      third_party_enabled: "Third Party",
      employee_contact_enabled: "Employee Contact",

      building_info_enabled: {
        label: "Building Info",
        buildingCategory: "building_info",
      },

      fire_safety_enabled: {
        label: "Fire Safety & Mechanicals",
        buildingCategory: "fire_safety",
      },

      leases_agreement_data_enabled: {
        label: "Lease Agreement Data",
        buildingCategory: "leases_agreement_data",
      },

      comparative_building_data_enabled: {
        label: "Comparative Building Data",
        buildingCategory: "comparative_building_data",
      },

      maintenance_updates_enabled: {
        label: "Maintenance Updates",
        buildingCategory: "maintenance_updates",
      },

      tenant_information_enabled: {
        label: "Tenant Information",
        backendKey: "tenant_information_enabled",
        buildingCategory: "tenant_information",
      },

      tenants_in_the_market_enabled: "Tenants In The Market",
      comps_enabled: "Comps",
      sublease_tracker_enabled: "Sublease Tracker",
      renewal_tracker_enabled: "Renewal Tracker",
      deal_tracker_enabled: "Deal Tracker",
      tour_enabled: "Tour",
    },
  },

  SETTINGS: {
    title: "Settings",
    features: {
      chat_history: "Chat History",
    },
  },
};

export const getDefaultFeatures = () => {
  const obj = {};
  Object.values(FEATURE_CONFIG).forEach((section) => {
    Object.keys(section.features).forEach((key) => {
      obj[key] = false;
    });
  });
  return obj;
};

export const mapUserFeatures = (user) => {
  const obj = {};
  Object.values(FEATURE_CONFIG).forEach((section) => {
    Object.keys(section.features).forEach((key) => {
      obj[key] = Boolean(user?.[key]);
    });
  });
  return obj;
};

export const getFeatureMeta = (featureKey) => {
  const feature = FEATURE_CONFIG.DATA_CATEGORY.features[featureKey];
  return typeof feature === "object" ? feature : null;
};

export const getFeatureLabel = (feature) =>
  typeof feature === "string" ? feature : feature.label;
