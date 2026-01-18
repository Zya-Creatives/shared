export const ROLES = {
    CREATIVE: "CREATIVE",
    BRAND: "BRAND",
    INVESTOR: "INVESTOR",
    ADMIN: "ADMIN",
} as const;

export const USER_STATUSES = {
    ACTIVE: "ACTIVE",
    SUSPENDED: "SUSPENDED",
    DELETED: "DELETED",
} as const;

export const CLIENT_TYPES = {
    CREATIVE: "CREATIVE",
    BRAND: "BRAND",
    NONE: "NONE",
} as const;

export const EXPERIENCE_LEVELS = {
    YEAR_0_1: "0-1 year",
    YEAR_1_3: "1-3 years",
    YEAR_3_5: "3-5 years",
    YEAR_5_PLUS: "5+ years",
} as const;

export const ONBOARDING_PAGES = {
    EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
    USERNAME_SELECTION: "USERNAME_SELECTION",
    ACCOUNT_TYPE_SELECTION: "ACCOUNT_TYPE_SELECTION",
    CREATIVE_PROFILE_DETAILS: "CREATIVE_PROFILE_DETAILS",
    BRAND_PROFILE_DETAILS: "BRAND_PROFILE_DETAILS",
    INVESTOR_PROFILE_DETAILS: "INVESTOR_PROFILE_DETAILS",
    INVESTOR_INVESTMENT_FOCUS: "INVESTOR_INVESTMENT_FOCUS",
    INVESTOR_VERIFICATION: "INVESTOR_VERIFICATION",
    DONE: "DONE",
} as const;

export const INVESTOR_TYPES = {
    ANGEL_INVESTOR: "Angel Investor",
    VENTURE_CAPITALIST: "Venture Capitalist",
    PRIVATE_EQUITY_FIRM: "Private Equity Firm",
    VENTURE_DEBT_PROVIDER: "Venture Debt Provider",
    BANK: "Bank",
    CONVERTIBLE_NOTE_INVESTOR: "Convertible Note Investor",
    REVENUE_BASED_FINANCING_INVESTOR: "Revenue Based Financing Investor",
    CORPORATE_VENTURE_CAPITALIST: "Corporate Venture Capitalist",
    GOVERNMENT: "Government",
    SOCIAL_IMPACT_INVESTOR: "Social Impact Investor",
} as const;

export const INVESTMENT_SIZES = {
    UNDER_5K: "Under 5k USD",
    BETWEEN_5K_25K: "5k - 25k USD",
    BETWEEN_25K_100K: "25k - 100k USD",
    BETWEEN_100K_500K: "100k - 500k USD",
    BETWEEN_500K_1M: "500k - 1M USD",
    OVER_1M: "1M+ USD",
} as const;

export const GEOGRAPHIC_FOCUS = {
    AFRICA: "Africa",
    ASIA: "Asia",
    EUROPE: "Europe",
    NORTH_AMERICA: "North America",
    SOUTH_AMERICA: "South America",
    MIDDLE_EAST: "Middle East",
    OCEANIA: "Oceania",
    UK: "United Kingdom (UK)",
    US: "United States (US)",
    GLOBAL: "Global",
    OTHER: "Other",
} as const;

export const INVESTOR_VERIFICATION_DOCUMENT_STATUSES = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
} as const;

export const INVESTOR_VERIFICATION_DOCUMENT_TYPES = {
    ID_PROOF: "ID_PROOF",
    BANK_STATEMENT: "BANK_STATEMENT",
    TAX_DOCUMENT: "TAX_DOCUMENT",
    BUSINESS_REGISTRATION: "BUSINESS_REGISTRATION",
    OTHER_CERTIFICATE: "OTHER_CERTIFICATE",
} as const;

export const ACTIVITY_PARENT_TYPES = {
    PROJECT: "PROJECT",
    USER: "USER",
    JOB: "JOB",
    POST: "POST",
    COMMENT: "COMMENT",
    JOB_APPLICATION: "JOB_APPLICATION",
} as const;

export const POST_TYPES = {
    MARKETPLACE: "MARKETPLACE",
    PROJECT: "PROJECT",
    JOB_OPENING: "JOB_OPENING",
    DEFAULT_POST: "DEFAULT_POST",
    POST_WITH_LINKS: "POST_WITH_LINKS",
    POST_WITH_MEDIA: "POST_WITH_MEDIA",
    POST_WITH_MEDIA_AND_LINKS: "POST_WITH_MEDIA_AND_LINKS",
} as const;

export const JOB_TYPE = {
    GIG: "GIG",
    ROLE: "ROLE",
} as const;

export const WORK_MODE = {
    REMOTE: "Remote",
    HYBRID: "Hybrid",
    ON_SITE: "On Site",
} as const;
export const EMPLOYMENT_TYPE = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    FREELANCE: "Freelance",
    INTERNSHIP: "Internship",
} as const;

export const JOB_AVAILABILITY_TYPES = {
    IMMEDIATE: "Immediate (Within 1 week)",
    TWO_WEEKS_NOTICE: "2 weeks notice",
    ONE_MONTH_NOTICE: "1 month notice",
    FLEXIBLE: "Flexible",
} as const;

export const WAGE_TYPES = {
    HOURLY: "Hourly",
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    PROJECT_BASED: "Project Based",
} as const;

export const JOB_SECTIONS = {
    PERSONAL_INFORMATION: "PERSONAL_INFORMATION",
    PHONE_NO: "PHONE_NO",
    PROFESSIONAL_INFORMATION: "PROFESSIONAL_INFORMATION",
    RESUME: "RESUME",
    COVER_LETTER: "COVER_LETTER",
    PORTFOLIO_OR_WORK_SAMPLES: "PORTFOLIO_OR_WORK_SAMPLES",
    AVAILABILITY: "AVAILABILITY",
    WAGES: "WAGES",
} as const;

export const JOB_LOCATIONS = {
    AFRICA: "Africa",
    REMOTE: "Remote",
    EUROPE: "Europe",
    ASIA: "Asia",
    NORTH_AMERICA: "North America",
    SOUTH_AMERICA: "South America",
    MIDDLE_EAST: "Middle East",
    OCEANIA: "Oceania",
    EMEA: "EMEA", // Europe, Middle East, Africa
    ASIA_PACIFIC: "Asia Pacific", // Asia Pacific
    GLOBAL: "Global",
    OTHER: "Other",
} as const;

export const MESSAGE_TYPES = {
    MARKETPLACE: "MARKETPLACE",
    PROJECT: "PROJECT",
    JOB_OPENING: "JOB_OPENING",
    DEFAULT_MESSAGE: "DEFAULT_MESSAGE",
    MESSAGE_WITH_LINKS: "MESSAGE_WITH_LINKS",
    MESSAGE_WITH_MEDIA: "MESSAGE_WITH_MEDIA",
    MESSAGE_WITH_MEDIA_AND_LINKS: "MESSAGE_WITH_MEDIA_AND_LINKS",
} as const;

export type JobLocation = (typeof JOB_LOCATIONS)[keyof typeof JOB_LOCATIONS];

export const GIG_TYPE = {
    ONE_TIME: "One Time",
    RECURRING: "Recurring",
} as const;

export const WAGES_CURRENCY = {
    USD: "USD (United States Dollar)",
    EUR: "EUR (Euro)",
    GBP: "GBP (British Pound Sterling)",
    NGN: "NGN (Nigerian Naira)",
    CAD: "CAD (Canadian Dollar)",
    AUD: "AUD (Australian Dollar)",
    JPY: "JPY (Japanese Yen)",
    CHF: "CHF (Swiss Franc)",
    INR: "INR (Indian Rupee)",
    ZAR: "ZAR (South African Rand)",
} as const;

export const JOB_STATUS = {
    ACTIVE: "ACTIVE",
    DRAFT: "DRAFT",
    ARCHIVED: "ARCHIVED",
    DELETED: "DELETED",
} as const;

export const POST_BADGE_TYPES = {
    NETWORKING: "Networking",
    FUNDING: "Funding",
    COLLABORATION: "Collaboration",
    OPPORTUNITIES: "Opportunities",
    SHOWCASE: "Showcase",
    LEARNING: "Learning",
    DISCUSSION: "Discussion",
    MENTORSHIP: "Mentorship",
} as const;

export const ACTIVITY_TYPES = {
    LIKE: "LIKE",
    UNLIKE: "UNLIKE",
    BOOKMARK: "BOOKMARK",
    UNBOOKMARK: "UNBOOKMARK",
    VIEW: "VIEW",
} as const;

export const LINK_TYPES = {
    INSTAGRAM: "Instagram",
    LINKEDIN: "LinkedIn",
    TWITTER: "Twitter",
    YOUTUBE: "Youtube",
    PORTFOLIO: "Portfolio Website",
    GENERIC_WEBSITE: "Generic Website",
} as const;

export const APPLICATION_STATUS = {
    SENT: "Application Sent",
    OPENED: "Opened",
    REJECTED: "Rejected",
    DECLINED: "Declined",
    OFFERED: "Offered",
    HIRED: "Hired",
} as const;

export const NOTIFICATION_TYPES = {
    FOLLOW: "Follow",
    LIKE: "Like",
    COMMENT: "Comment",
    REPLY: "Reply",
    MESSAGE: "Message",
    BOOKMARK: "Bookmark",
    JOB_APPLICATION: "Job Application",
    APPLICATION_STATUS_CHANGE: "Application Status Change",
    SYSTEM_STRIKE: "System Strike",
    PROJECT_FEATURED: "Project Featured",
} as const;

export type NotificationType =
    (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export type ApplicationStatus =
    (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];
export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];
export type PostBadgeType =
    (typeof POST_BADGE_TYPES)[keyof typeof POST_BADGE_TYPES];
export type JobSections = (typeof JOB_SECTIONS)[keyof typeof JOB_SECTIONS];
export type WagesCurrency =
    (typeof WAGES_CURRENCY)[keyof typeof WAGES_CURRENCY];
export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
export type Role = (typeof ROLES)[keyof typeof ROLES];
export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];
export type WorkMode = (typeof WORK_MODE)[keyof typeof WORK_MODE];
export type GigType = (typeof GIG_TYPE)[keyof typeof GIG_TYPE];
export type EmploymentType =
    (typeof EMPLOYMENT_TYPE)[keyof typeof EMPLOYMENT_TYPE];
export type JobAvailabilityTypes =
    (typeof JOB_AVAILABILITY_TYPES)[keyof typeof JOB_AVAILABILITY_TYPES];
export type WageTypes = (typeof WAGE_TYPES)[keyof typeof WAGE_TYPES];
export type PostType = (typeof POST_TYPES)[keyof typeof POST_TYPES];
export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];
export type LinkType = (typeof LINK_TYPES)[keyof typeof LINK_TYPES];
export type ActivityParentType =
    (typeof ACTIVITY_PARENT_TYPES)[keyof typeof ACTIVITY_PARENT_TYPES];
export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];
export type ClientType = (typeof CLIENT_TYPES)[keyof typeof CLIENT_TYPES];
export type ExperienceLevel =
    (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];
export type OnboardingPage =
    (typeof ONBOARDING_PAGES)[keyof typeof ONBOARDING_PAGES];
export type InvestorType = (typeof INVESTOR_TYPES)[keyof typeof INVESTOR_TYPES];
export type InvestmentSize =
    (typeof INVESTMENT_SIZES)[keyof typeof INVESTMENT_SIZES];
export type GeographicFocus =
    (typeof GEOGRAPHIC_FOCUS)[keyof typeof GEOGRAPHIC_FOCUS];
export type InvestorVerificationDocumentStatus =
    (typeof INVESTOR_VERIFICATION_DOCUMENT_STATUSES)[keyof typeof INVESTOR_VERIFICATION_DOCUMENT_STATUSES];
export type InvestorVerificationDocumentType =
    (typeof INVESTOR_VERIFICATION_DOCUMENT_TYPES)[keyof typeof INVESTOR_VERIFICATION_DOCUMENT_TYPES];

export const API_ROUTES = {
    healthCheck: "/health",
    username: {
        base: "/usernames",
        checkAvailability: "/:username/availability",
    },
    personal: {
        base: "/me",
        getUser: "",
        getProfile: "/profile",
        getProjects: "/projects",
        getProjectBookmarks: "/project-bookmarks",
        getFollowers: "/followers",
        getFollowing: "/following",
    },
    user: {
        base: "/users",
        getUser: "/:value",
        getProfile: "/:value/profile",
        getProjects: "/:value/projects",
        getFollowers: "/:userId/followers",
        getFollowing: "/:userId/following",
        followUser: "/:userId/follow",
        unfollowUser: "/:userId/unfollow",
        reserveUsername: "/reserve-username",
    },
    redirect: {
        base: "/redirect",
        passwordReset: "/password-reset",
        verifiedUser: "/verified-user",
        googleProfile: "/google-profile",
        newGoogleProfile: "/new-google-profile",
    },
    file: {
        base: "/files",
        getPresignedUploadUrl: "/get-upload-url",
        getPresignedDownloadUrl: "/:fileId/download-url",
        getPublicUrl: "/:fileId/public-url",
        createFile: "",
        deleteFile: "/:fileId",
    },
    disciplines: {
        base: "/disciplines",
        getDisciplines: "",
        getSingleDiscipline: "/:slug",
        addDisciplines: "",
        deleteDiscipline: "/:slug",
    },
    creatives: {
        base: "/creatives",
        createCreative: "",
        getCreative: "/:value",
        updateCreative: "",
    },
    brands: {
        base: "/brands",
        createBrand: "",
        getBrand: "/:value",
        updateBrand: "",
    },
    investors: {
        base: "/investors",
        createInvestor: "",
        getInvestor: "/:value",
        updateInvestor: "",
    },
    projects: {
        base: "/projects",
        createProject: "",
        updateProject: "",
        listProjects: "",
        getProject: "/:projectId",
        deleteProject: "/:projectId",
        commentOnProject: "/:projectId/comment",
        deleteCommentOnProject: "/:projectId/comments/:commentId",
        bookmarkProject: "/:projectId/bookmark",
        unbookmarkProject: "/:projectId/unbookmark",
        likeProject: "/:projectId/like",
        unlikeProject: "/:projectId/unlike",
        viewProject: "/:projectId/view",
        getProjectComments: "/:projectId/comments",
        getProjectLikes: "/:projectId/likes",
        getProjectBookmarks: "/:projectId/bookmarks",
        getProjectViews: "/:projectId/views",
        getProjectUser: "/:projectId/user",
    },
} as const;

export const DEFAULT_DISCIPLINES = [
    { name: "3D Art", slug: "3d_art" },
    { name: "Advertising & Marketing", slug: "advertising_marketing" },
    { name: "AI & Machine Learning Art", slug: "ai_machine_learning_art" },
    { name: "Animation & Motion", slug: "animation_motion" },
    { name: "Architecture & Interior", slug: "architecture_interior" },
    { name: "Art Business", slug: "art_business" },
    { name: "Art Challenges & Community", slug: "art_challenges_community" },
    { name: "Art Education", slug: "art_education" },
    { name: "Book & Editorial Design", slug: "book_editorial_design" },
    { name: "Brand Strategy", slug: "brand_strategy" },
    { name: "Business & Consulting", slug: "business_consulting" },
    { name: "Calligraphy & Penmanship", slug: "calligraphy_penmanship" },
    {
        name: "Character Rigging & Animation Setup",
        slug: "character_rigging_setup",
    },
    { name: "Comics & Webtoons", slug: "comics_webtoons" },
    { name: "Concept Art", slug: "concept_art" },
    { name: "Content Creation", slug: "content_creation" },
    {
        name: "Copywriting & Content Writing",
        slug: "copywriting_content_writing",
    },
    { name: "Crafts & DIY", slug: "crafts_diy" },
    { name: "Creative Coding", slug: "creative_coding" },
    { name: "Data Science & Analysis", slug: "data_science_analysis" },
    { name: "Data Visualization", slug: "data_visualization" },
    { name: "Digital Art", slug: "digital_art" },
    {
        name: "Digital Painting & Matte Painting",
        slug: "digital_painting_matte",
    },
    { name: "E-commerce & Store Design", slug: "ecommerce_store_design" },
    { name: "Fashion & Style", slug: "fashion_style" },
    { name: "Food Content", slug: "food_content" },
    { name: "Game Development", slug: "game_development" },
    { name: "Graphic Design", slug: "graphic_design" },
    { name: "Illustration", slug: "illustration" },
    { name: "Lettering & Typography", slug: "lettering_typography" },
    { name: "Miniature & Model Making", slug: "miniature_model_making" },
    { name: "Music Performance", slug: "music_performance" },
    { name: "Music Production", slug: "music_production" },
    { name: "Photography", slug: "photography" },
    { name: "Pixel Art", slug: "pixel_art" },
    {
        name: "Product Strategy & Management",
        slug: "product_strategy_management",
    },
    { name: "Sculpture & 3D Crafts", slug: "sculpture_3d_crafts" },
    { name: "Sound Design & Audio", slug: "sound_design_audio" },
    { name: "Storyboarding & Pre-Vis", slug: "storyboarding_previs" },
    { name: "Street Art & Murals", slug: "street_art_murals" },
    { name: "Tattoo Art", slug: "tattoo_art" },
    { name: "Technical Illustration", slug: "technical_illustration" },
    { name: "Technical Writing", slug: "technical_writing" },
    { name: "Traditional Art", slug: "traditional_art" },
    { name: "Translation & Localization", slug: "translation_localization" },
    { name: "UI/UX Design", slug: "ui_ux_design" },
    { name: "Video Content", slug: "video_content" },
    { name: "Virtual/Augmented Reality", slug: "virtual_augmented_reality" },
    { name: "Visual Effects (VFX)", slug: "visual_effects_vfx" },
    { name: "Web Development (Back-End)", slug: "web_development_backend" },
    { name: "Web Development (Front-End)", slug: "web_development_frontend" },
    { name: "Writing & Storytelling", slug: "writing_storytelling" },
];

export const ANALYTICS_EVENTS = {
    POST: {
        VIEW_DETAILS: "post_view_details",
        LIKE: "post_like",
        BOOKMARK: "post_bookmark",
        VIEW_LIKES_LIST: "post_view_likes_list",
        TAG_CLICK: "post_tag_click",
        LINK_PREVIEW_CLICK: "post_link_preview_click",
        MEDIA_EXPAND: "post_media_expand",
        LIGHTBOX_NAV: "post_lightbox_nav",
        LIGHTBOX_THUMB_SELECT: "post_lightbox_thumb_select",
        VIDEO_VIEW: "post_video_view",
        SHARE_MENU_OPEN: "post_share_menu_open",
        LINK_COPIED: "post_link_copied",
        EXTERNAL_SHARE: "post_external_share",
        DM_CLICK: "post_dm_click",
        FOLLOW: "post_creator_follow",
        UNFOLLOW: "post_creator_unfollow",
        VIEW_OWN_ANALYTICS: "post_creator_view_analytics",
        REPORT: "post_report",
        NOT_INTERESTED: "post_not_interested",
    },
    COMMENT: {
        FORM_FOCUS: "comment_form_focus",
        SUBMIT_SUCCESS: "comment_submit_success",
        LIST_LOAD_MORE: "comment_list_load_more",
        ITEM_LIKE: "comment_item_like",
        ITEM_REPLY_CLICK: "comment_item_reply_click",
        ITEM_REPLIES_TOGGLE: "comment_item_replies_toggle",
        ITEM_SHARE: "comment_item_share",
        ITEM_PROFILE_CLICK: "comment_item_profile_click",
        EMPTY_STATE_VIEW: "comment_empty_state_view",
    },
} as const;
