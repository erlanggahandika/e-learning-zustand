// utils/endpoint.js
// endpoint rest api

const BASE_URL = 'https://app.webinarku.tech/v1/admin';
const BACKEND = 'https://app.webinarku.tech/';
const BANNER_URL = 'https://app.webinarku.tech/';
const IMAGE= 'https://app.webinarku.tech/';
export const ENDPOINTS = {
  BACKEND: BACKEND,
  IMAGE: IMAGE,
  GETBYUUID_NOTIFIKASI: `${BASE_URL}/getbyuuid-status-notification`,
  GET_NOTIFIKASI_ADMIN: `${BASE_URL}/get-notifikasi-admin`, //get-notifikasi-admin
  DELETE_BANNER_ADMIN: `${BASE_URL}/delete-banner-admin`, //delete-banner-admin
  GET_BANNER_ADMIN_BY_ID: `${BASE_URL}/get-banner-admin-by-id`,
  CREATE_BANNER: `${BASE_URL}/create-banner-admin`, //create-banner-admin
  GET_BANNER_ADMIN: `${BASE_URL}/get-banner-admin`, //get-banner-admin
  UPDATE_BANNER: `${BASE_URL}/update-banner-admin`, // update-banner-admin
  SUBSCRIPTIONS_BY_DATE: `${BASE_URL}/subscriptions-by-date`, //subscriptions-by-date
  SEARCH_SUBSCRIPTIONS: `${BASE_URL}/search-subscriptions`, //search-subscriptions
  GETALL_PEMBELIANPENDING: `${BASE_URL}/getAllSubscriptions`,
  SEARCH_DATE_TRANSAKSI_BERHASIL: `${BASE_URL}/transactions-by-date`,
  SEARCH_TRANSAKSI_BERHASIL: `${BASE_URL}/search-transactions`,
  GETALLTRANSACTION: `${BASE_URL}/getAllTransactions`,
  COUNT_ALLUSER: `${BASE_URL}/count-alluser`,
  GET_COURSEES: `${BASE_URL}/get-courses`,
  LIST_SOAL_PERTEMUAN_RESULT: `${BASE_URL}/list-soal-pertemuan-result`,
  SUBMIT_SOAL_PERTEMUAN: `${BASE_URL}/submit-soal-pertemuan`, //submit-soal-pertemuan
  CARI_KELASUSER: `${BASE_URL}/search-kelasuser`, //search-kelasuser
  GET_KELASUSER: `${BASE_URL}/get-kelasuser`,
  BUY_COURSE: `${BASE_URL}/beli-course`,
  GET_MY_PENARIKAN: `${BASE_URL}/get-my-penarikan`, //get-my-penarikan
  CREATE_TARIKAN: `${BASE_URL}/create-penarikan`, //create-penarikan
  HAPUS_PERTEMUAN: `${BASE_URL}/hapus-pertemuan`, //hapus-pertemuan
  UPDATE_PERTEMUAN: `${BASE_URL}/update-pertemuan`, //update-pertemuan/
  UPDATE_COURSE: `${BASE_URL}/update-course`,
  DELETE_SOAL_PERTEMUAN: `${BASE_URL}/delete-soal-pertemuan`, //delete-soal-pertemuan
  LIST_SOAL_PERTEMUAN: `${BASE_URL}/list-soal-pertemuan`,
  TAMBAH_SOAL: `${BASE_URL}/buat-soal-pertemuan`,
  TAMBAH_PERTEMUAN: `${BASE_URL}/tambah-pertemuan`,
  GET_COURSE_BY_ID: `${BASE_URL}/get-course-by-id`,
  LISTUSER_YANGBELI: `${BASE_URL}/list-useryangbeli`,
  TOTAL_KELAS: `${BASE_URL}/get-my-kelas`,
  SALDO_MENTOR: `${BASE_URL}/get-mysaldo`,
  BUAT_KELAS: `${BASE_URL}/create-course`,
  GET_COURSE: `${BASE_URL}/get-course`,
  CHAT_GET_ROOMS: `${BASE_URL}/get-rooms`,
  CHAT_GET_MESSAGES: `${BASE_URL}/get-messages`,
  CHAT_SEND_MESSAGE: `${BASE_URL}/send-message`,
  CHAT_START: `${BASE_URL}/start-chat`,
  USERCOMMUNITY: `${BASE_URL}/get-usercommunity-by-params`,
  FEEDADMIN: `${BASE_URL}/getpostadmin-user`,
  MY_COMMUNITY: `${BASE_URL}/my-community`,
  FOLLOW_USER: `${BASE_URL}/follow-user`, //follow-user/
  USERPROFILE: `${BASE_URL}/user-profile`,
  SEARCHUSER : `${BASE_URL}/search-user`,
  MY_POST: `${BASE_URL}/my-post`,
  MY_PROFILE: `${BASE_URL}/my-profile`,
  CREATE_SUBSCRIPTION: `${BASE_URL}/create-subscription`,
  TAMPIL_PLAN: `${BASE_URL}/tampil-plan`,
  TAMPIL_PLAN_NOAUTH: `${BASE_URL}/tampil-plan-noauth`,
  FIND_KOMUNITAS_BY_SEARCH: `${BASE_URL}/find-komunitas-by-search`,
  GET_KOMUNITAS_BY_PARAMS: `${BASE_URL}/get-komunitas-by-params`,
  GET_KOMUNITAS_DIBUAT: `${BASE_URL}/get-komunitas-dibuat`,
  GET_KOMUNITAS_DIIKUTI: `${BASE_URL}/get-community-ikuti`,
  GET_RECOMENDED_COMMUNITY: `${BASE_URL}/get-recomended-community`,
  GET_COMUNITY: `${BASE_URL}/get-community`,
  CREATE_COMUNITY: `${BASE_URL}/create-comunity`, //create-comunity
  SEARCH_WEBINAR: `${BASE_URL}/findwebinar-by-search`,
  GET_WEBINAR: `${BASE_URL}/get-webinar`,
  GET_WEBINAR_I_CREATE: `${BASE_URL}/get-webinar-icreate`,
  GET_CHAT_MESSAGES: `${BASE_URL}/chat`,
  SEND_CHAT: `${BASE_URL}/chat/send`,
  GET_WEBINAR_BY_PARAMS: `${BASE_URL}/get-webinar-by-params`,
  GET_WEBINARDIIKUTI: `${BASE_URL}/get-webinardiikuti`,
  GABUNG_WEBINAR: `${BASE_URL}/gabung-webinar`,
  GET_RECOMENDED_WEBINAR: `${BASE_URL}/get-recomended-webinar`,
  CREATE_WEBINAR: `${BASE_URL}/create-webinar`,
  CEK_PLAN: `${BASE_URL}/cek-status-plan`,
  TOGGLE_LIKE: `${BASE_URL}/toggle-like`,
  POST_COMMENT: `${BASE_URL}/post-comment`,
  GET_COMMENTS: `${BASE_URL}/get-comments`,
BASE_URL: BASE_URL,
  CREATEFEED: `${BASE_URL}/createfeed`,
  GETFEED: `${BASE_URL}/getfeed`,
  LOGIN: `${BASE_URL}/sign-in`,
  LOGOUT: `${BASE_URL}/sign-out`,
  REFRESH: `${BASE_URL}/refresh-token`, 
  REGISTERR: `${BASE_URL}/register`, 
  REGISTER: `${BASE_URL}/register`,
  VERIFY_OTP: `${BASE_URL}/verifykode`, 
  RESEND_REGISTER_OTP: `${BASE_URL}/resend-register-otp`,
  RECOVERY_PASSWORD: `${BASE_URL}/recovery-password`,
  RECOVERY_PASSWORD_SUDAH_LOGIN: `${BASE_URL}/recovery-password-sudah-login`, //didalam stack app
  VALIDATE_RECOVERY_PASSWORD: `${BASE_URL}/validate-recovery-password`, 
  RESET_PASSWORD: `${BASE_URL}/reset-password`,
  CHANGE_PASSWORD: `${BASE_URL}/change-password`, 
  PROFILE: `${BASE_URL}/profile`,  
  EDIT_PROFILE: `${BASE_URL}/edit-profile`, 
  TOKEN_NOTIFICATION: `${BASE_URL}/token-notification`, 
  GET_NOTIFICATION: `${BASE_URL}/status-notification`, 
  LIST_NOTIFICATION: `${BASE_URL}/list-notification`, 
  GET_NOTIFICATION_BY_ID: `${BASE_URL}/list-notification-byid`, 
  UPDATE_NOTIFICATION: `${BASE_URL}/update-status-notification`, 
  DELETE_NOTIFICATION: `${BASE_URL}/delete-notification`, 
  LIST_LOGIN_INFO: `${BASE_URL}/list-info-login`,
  KATEGORI_KURSUS: `${BASE_URL}/kategori-kursus`,
  DEGREE: `${BASE_URL}/list-degree`, // ini api getlist degree/catalog , page home lalu allcatalog
  LIST_PRODUCT: `${BASE_URL}/list-product`, // ini apiget list semua product page home
  LIST_PRODUCT_DEGREE: `${BASE_URL}/list-product-degree`, //get catalog by id (( implementasi di page getcatalogig))
  LIST_BANNER: `${BASE_URL}/list-banner`, // list banner
  LIST_COURSE_PRODUCT: `${BASE_URL}/list-course-product`, // list course by product
  LIST_COURSE_SESSION: `${BASE_URL}/list-course-session`, // lis pertemuan
  // LIST_COURSE_SESSION_BY_ID: `${BASE_URL}/list-course-session-by-id`, // list pertemuan by id
  SUM_COURSE_SESSION: `${BASE_URL}/sum-course-session`, // sum pertemuan
  SUM_COURSE_MATERIAL: `${BASE_URL}/sum-course-material`, // sum materi 
  IMAGE_BANNER_URL: `${BANNER_URL}/uploads/banner/`, // endpoint imagge banner
};

export default BASE_URL;


