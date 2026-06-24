const shared = require("../dist/index.js");
const constants = require("../dist/constants.js");

const requiredRuntimeConstants = [
  "ROLES",
  "USER_STATUSES",
  "CLIENT_TYPES",
  "EXPERIENCE_LEVELS",
  "ACTIVITY_PARENT_TYPES",
  "ONBOARDING_PAGES",
  "INVESTMENT_SIZES",
  "INVESTOR_TYPES",
  "GEOGRAPHIC_FOCUS",
  "INVESTOR_VERIFICATION_DOCUMENT_STATUSES",
  "INVESTOR_VERIFICATION_DOCUMENT_TYPES",
  "POST_TYPES",
  "JOB_TYPE",
  "EMPLOYMENT_TYPE",
  "WORK_MODE",
  "GIG_TYPE",
  "WAGES_CURRENCY",
  "WAGE_TYPES",
  "JOB_LOCATIONS",
  "JOB_SECTIONS",
  "JOB_STATUS",
  "NOTIFICATION_TYPES",
  "POST_BADGE_TYPES",
  "MESSAGE_TYPES",
  "APPLICATION_STATUS",
  "CREATIVE_APPLICATION_TRACKING_STATUS",
  "JOB_AVAILABILITY_TYPES",
  "VENTURE_STAGES",
  "PROJECT_STATUS",
  "MESSAGE_REQUEST_STATUS",
  "SIGNAL_INTEREST_TYPES",
  "SIGNAL_STATUS",
  "COUNTRY_OF_OPERATION",
  "SELLER_STATUS",
  "GATEWAY_PROVIDER",
  "PAYMENT_METHOD_STATUS",
  "PRICING_MODELS",
  "DISCOUNT_TYPES",
  "PRODUCT_STATUS",
  "TRANSACTION_STATUSES",
  "PAYMENT_PROVIDERS",
];

for (const key of requiredRuntimeConstants) {
  if (!constants[key]) {
    throw new Error(`Missing constants export: ${key}`);
  }

  if (!shared[key]) {
    throw new Error(`Missing root export: ${key}`);
  }

  if (Object.values(constants[key]).length === 0) {
    throw new Error(`Empty constants export: ${key}`);
  }

  if (Object.values(shared[key]).length === 0) {
    throw new Error(`Empty root export: ${key}`);
  }
}

console.log(
  `Verified ${requiredRuntimeConstants.length} shared runtime constants exports.`,
);
