// import { Platform, Dimensions } from 'react-native';
import config from "./aws-exports";

// const { width, height } = Dimensions.get('window');

// const getHeight = () => {
//   if (height >= 812) {
//     return 75;
//   }
//   return 60;
// };

// const getPosition = () => {
//   if (height >= 812) {
//     return 40;
//   }
//   return 25;
// };

// eslint-disable-next-line no-undef

export const Constants = {
  app_images: "EDDEV",
  app_locale: "mddemo",
  app_border_color: "#f4f4f4",
  app_background_color: "#ffffff",
  // app_color: '#F0F0F0',
  app_dark_color: "#f5a138",
  app_light_color: "#fecf94",
  app_color: "#ffffff",
  app_button_color: "#F2A03F",
  app_toolbar_color: "#434343",
  app_button_text_color: "#ffffff",
  app_text_color: "#5C5C5C",
  app_button_text_size: 15,
  app_nav_title_color: "#000000",
  app_statusbar_color: "#434343",
  app_searchbar_background_color: "#5A5A5A",
  app_searchbar_placeholder: "#FFFFFF",
  app_searchbar_text: "#FFFFFF",
  app_searchbar_tintcolor: "#FFFFFF",
  app_font_family_regular: "NunitoSans-Regular",
  app_font_family_bold: "NunitoSans-Bold",
  not_seen_color: "#cccccc",
  not_seen_object_color: "#373737",
  app_grey_color: "#c7c7c7",
  // app_toolbar_height: getHeight(),
  // app_toolbar_position: getPosition(),
  // app_width: width,
  // app_height: height,
  SecretKey: "trfy56rsf6u5t6t6gjuyvy423eyd543165dwq4",
  GET_MY_PROGRAMS: "/getPrograms",
  GET_PROGRAM_DETAILS: "/getProgramsDetails",

  GET_ANNOUNCEMENTS: "/PostAnnouncement",

  // Change Block starts here
  //Constant styles
  // main_color_1: "#0f80a4",
  //   main_color_2: "#f18121",
  //   platform_main_theme: "linear-gradient(#0f80a4, #0f80a4)",
  //   button_color_web: "#0f80a4",
  // Change Block ends here

  // Change the domain here
  DOMAIN: "d1if2pjtoq2sst.cloudfront.net",

  GET_PROGRAM: "/getProgram",
  ALL_PROGRAM: "/getAllProgramList",
  SYNC_PROGRAM: "/syncUserProgramProgress",
  GET_USER_PROGRESS: "/getUserTotalProgress",
  GET_COURSE: "/getCourse",
  SYNC_USER_PROGRESS: "/syncUserProgress",
  GET_APPLICATION: "/getApplication",
  GCP_RESPONSE: "/getGoogleCloudResponse",
  GET_HTTP_RESPONSE: "/getHttpResponse",
  ANALYTICS_WEB_APP: "/analyticsWebApp",
  GET_QUIZ: "/getQuiz",
  GET_EVENTS: "/getEvents",
  POST_ANNOUNCEMENT: "/PostAnnouncement",
  GET_NOTIFICATIONS: "/getNotifications",
  GET_ASSESSMENT: "/getAssessment",
  GET_ASSESSMENT_ANSWERS: "/getAssessmentQuiz",
  UPDATE_ASSESSMENT: "/updateAssessment",
  UPDATE_MINI_ASSIGNMENT: "/uploadAssignment",
  GET_ASSESSMENT_QUIZ: "/getAssessmentQuiz",
  GET_ASSIGNMENT_DATA: "/getAssignmentData",
  GET_PAGEDATA: "/getPageData",
  GET_FAQ: "/faq",
  REFERENCES: "/references",
  GET_Programs_Details: "/getProgramsDetails",
  GET_USER_MINI_ASSIGNMENT: "/getUserMiniAssignment",
  GET_USER_ASSIGN_ASSESS: "/getUserAssignAndAsses",
  REG_USER: "/registerUser",
  // JSS

  app_device_token: "",
  AWS_ORG_API_PATH: config.aws_cloud_logic_custom_endpoint_E,
  AWS_IMAGES_URL: "https://d1hfr1iyugj21x.cloudfront.net/",
  AWS_CLOUDFRONT_URL: "https://d1hfr1iyugj21x.cloudfront.net",
  COOKIE_URL: "https://d1hfr1iyugj21x.cloudfront.net",
  AWS_API_PATH: "JS-PLATFORM",
  GET_USER_TOPIC_PROGRESS: "/getUserDataMobile",
  SYNC_USER_TOPIC_PROGRESS: "/syncUserDataMobile",
  SYNC_STAR_RATE: "/syncUserStarRate",
  UPDATE_ANALYTICS: "/analyticsWebApp",
  GET_ORG_DETAILS: "/getOrgDetails",
  GET_USER_TOPICS: "/getMyTopics",
  GET_PRESIGNED_URL: "/getPreSignedURL",
  GET_FEATURED_CONTENT: "/getFeaturedContent",
  GET_CATEGORIES: "/edGetCategories",
  GET_CATEGORY_DATA: "/edGetCategoryData",
  GET_SEARCH_TOPICS: "/searchTopics",
  GET_LIST_TOPICS: "/listTopics",
  GET_LIVE_SESSION: "/getLiveSessions",
  GET_OBJECT: "/getObjectMobile",

  UPDATE_COURSE_ANALYTICS: "/updateCourseAnalytics",
  GET_TOPIC: "/getTopic",
  GET_NUGGET: "/getNuggetMobile",
  GET_SESSION: "/getUserSessions",
  UPDATE_PAYMENT_STATUS: "/updateUserPaymentStatus",

  GET_USER_CERTIFICATES: "/listUserCerts",
  TERMS_CONDITIONS: "https://www.enhanzed.com/t-c",
  HELP_SUPPORT: "https://www.enhanzed.com/help",
  FEEDBACK: "https://www.enhanzed.com/feedback",
  AUTH_COGNITO_EVENT: "AuthenticatedViaCognito",
  USER_AREASOFINTEREST: "Areas Of Interest",
  TOPIC_STARTED: "Topic Started",
  TOPIC_COMPLETED: "Topic Completed",
  UPDATE_USER_CERTIFICATES: "/generateUserCert",
  VIEW_USER_CERTIFICATE: "/getUserCert",
  CERT_GENERATED: "Certificate Generated",
  QUIZ_SCORE: "/getQuizScore",
  POST_QUIZ: "/postQuizScore",
  CLAIM_BADGE: "/claimBadge",
  GET_USER_OBJECT_LIST: "/getUsersObjectsData",
  GET_OBJECT_RATING: "/getObjectRating",
  ADD_BOOKMARK: "/addBookMark",
  DELETE_BOOKMARK: "/deleteBookmark",
  SYNC_OBJECT_RATING: "/syncObjectsData",
  LIST_BOOKMARKS: "/listBookmark",
  BOOKMARK_STATUS: "/getBookmarkStatus",
  UPDATE_OBJECT_ANALYTICS: "/ObjectsAnalytics",
  GET_RECENT_VIEWS: "/getRecenetView",
  UPDATE_VIEWS: "/updateRecentViewed",
  DELETE_TOKEN: "/deleteToken",
  INDIAN_TIME: "/indianTimeZone",
  UPDATE_USER_REGISTRATION: "/addRegisterEvent",
  GET_REGISTERED_EVENTS: "/getRegisteredEvents",
  GET_DAILYGOAL: "/getDailyGoal",
  SET_DAILYGOAL: "/setDailyGoal",
  VIMEO_URL: "https://player.vimeo.com/video/",
  YOUTUBE_URL: "https://www.youtube.com/embed/",
  SHARE_URL: "https://www.learn.enhanzed.com/#/sharingobject?",
};
