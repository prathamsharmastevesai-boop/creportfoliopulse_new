//BASE URL
export const baseURL = import.meta.env.VITE_BASE_URL;

//AUTH
export const login = "/auth/login";
export const Sigup = "/auth/register";
export const VerifyOtp = "/auth/verify_otp";
export const ForgetPassword = "/auth/forgot_password";
export const ResetPasswod = "/auth/reset_password";
export const UserDelete = "/auth/user/";

//PROFILE
export const ProfileDetail = "/auth/user/profile";
export const ProfileUpdateDetail = "/auth/user/profile/update";

//BUILDING
export const CreateBuilding = "/building_operations/create_buildings";
export const ListBuilding = "/building_operations/list_buildings";
export const UpdateBuildingEndpoint = "/building_operations/update_buildings";
export const DeleteBuildingEndpoint = "/building_operations/delete_building/";
export const UploadBuildingImageEndpoint = "/buildings/";

//Lease
export const CreateLeaseEndpoint = "/lease/create_lease";
export const LeaselistEndpoint = "/lease/list_leases";
export const UpdateLeaseeEndpoint = "/lease/update_lease";
export const DeleteLeaseEndpoint = "/lease/delete_lease";

//LEASE Document
export const UploadDoc = "/chatbot/upload_building_doc/";
export const UpdateDoc = "/chatbot/update_files/";
export const ListDoc = "/chatbot/files/";
export const DeleteDoc = "/chatbot/delete_files/";

//ASK QUESTION building
export const AskQuestion = "/chatbot/ask_question/";

// chat Ask Question
export const ASkQuestionbuildingEndpoint = "/building/files/query";
export const Chat_history = "/chat/history/";
export const Gemini_Chat_History = "/gemini/gemini/history/";
export const Del_Chat_Session = "/chat/delete/";

// ASK QUESTION REPORT
export const AskQuestionReportEndpoint = "/user/ask_summary_chat/";

//session list
export const Session_List_Specific = "/chat/sessions/";

export const AskGemini = "gemini/chat";
export const ToggleGemini = "/gemini/gemini-toggle";

//GENERAL INFO
export const UploadGeneralDoc = "/admin_user_chat/upload";
export const updateGenralDoc = "/admin_user_chat/update";

//PERMISSON FOR BUILDING
export const Request_list = "/building_permissions/pending_requests";
export const Request_approve_deny = "/building_permissions/action_request";
export const Request_permission = "/building_permissions/request_access";
export const Approved_list = "/building_permissions/approved_requests";
export const Denied_list = "/building_permissions/denied_requests";

//GENERAL INFO BUILDING
export const Upload_General_info =
  "/genral-builidng/buildings/documents/upload";

//Admin Dashboard
export const dashboardData = "/admin/stats";
export const complianceStatesEndpoint = "/api/admin/compliance/stats";
export const compliancelogEndpoint = "/api/admin/compliance/logs";

//AI INSLILGHTS
export const AIAnalyticsData = "/admin/analytics";

export const AIInsights = "/admin/ai_insights";

export const RecentQuestion = "/admin/recent_questions";

export const UsageTreads = "/admin/usage_trends";

export const ActivitySummary = "/admin/activity_summary";

//System Tracing
export const SystemTracing = "/admin/system_tracing";

//USER MANAGEMENT
export const InviteUser = "/invite_user/admin";
export const userList = "/invite_user/admin/invited-users";

//AI LEASE Abstract
export const upload_Report_Generator = "/generate_lease/upload/summarize";
export const upload_Abstract_Lease = "/generate_lease/upload/simple";
export const listAbstractDoc = "/generate_lease/list_category_files/";
export const deleteAbstractDoc = "/generate_lease/delete_file/";

//AI LEASE DRAFTING
export const upload_Drafting_Lease = "/gen_lease/upload/simple";
export const listDraftingDoc = "/gen_lease/list_category_files/";
export const deleteDraftingDoc = "/gen_lease/delete_file/";
export const extractMetadata = "/gen_lease/files/structured_metadata?";
export const extractTextdata = "/gen_lease/files/lease-agreement-text";
export const extractTextViewdata = "/gen_lease/files/view_generated_lease/text";
export const updatetextdata = "/gen_lease/files/text";

//Feedback
export const feedbacksubmit = "/information_collaboration/submit";
export const getfeedback = "/feedback/my-feedback";
export const getadminfeedback = "/information_collaboration/admin/entries";
export const getuserfeedback = "/feedback/my-feedback";
export const updatefeedback = "/feedback/update/";
export const getinfocollaborationbuildings =
  "/information_collaboration/category-buildings";

//Email Drafting
export const AddnewTenent = "/mail_draft/tenants/create";
export const AddnewEmailTemplate = "/mail_draft/templates/create";
export const TenentName = "/mail_draft/tenants/list";
export const EmailDraftingTemlate = "/mail_draft/templates/list";
export const GenerateTemplate = "/mail_draft/generate";
export const updateMailTemplate = "/mail_draft/templates/";
export const Deletetemplatemplate = "/mail_draft/templates/";

//SUPER ADMIN
export const inviteAdmin = "/auth/invite-admin";
export const listAdmin = "/invite_user/list";

//Tours
export const Tours = "/tours/";
export const getTours = "/tours/";

//DistilledExpenseTracker
export const distilledExpenseTrackerEndpoint = "/det_expense/submit";
export const distilledExpenseTrackerlistEndPoint = "/det_expense/submissions";

//DistilledCompTracker
export const distilledCompTrackerEndpoint = "/dct/submit";
export const distilledCompTrackerlistEndPoint = "/dct/comps";
export const AskQuestionDCTEndpoint = "/dct/gemini-query";
export const distilledBenchmarkEndpoint = "/dct/benchmark";

//Calc
export const calcEndpoint = "calc/lease-finance";
export const itcalculatorEndpoint = "/calc/TIcalculator";

//Forum
export const thread = "/forum/threads/";
export const threadData = "/forum/threads";
export const createThreadEndpoint = "/forum/threads";
export const createThoughtEndpoint = "/forum/threads/";
export const ThreadhistoryEndpoint = "/forum/threads/";
export const ToggleForum = "/forum/forum-toggle";
export const benchmarkEndpoint = "/det_expense/benchmark";

//Notes
export const notes = "/notes/";

//SpaceInquiry
export const ingestionconfigs = "/space_inquiry/client-config";
export const updateingestionconfigs = "/space_inquiry/client-config";
export const getspaceinqurylist = "/space_inquiry/list";
export const getspaceinquryView = "/space_inquiry/details/";
export const togglebutton = "/space_inquiry/client-config/switch";
export const Deleteconfig = "/space_inquiry/client-config";

//Deal Tracker
export const dealformEndpoint = "/deals/";
export const dealList = "/deals/";
export const getFormEndpoint = "/deals/deal_id/";
export const deleteDeal = "/deals/";

//Sublease Tracker
export const subleaseEndpoint = "/sublease/";
export const subleasetrackerendpoint = "/sublease/create";
export const renewaltrackerendpoint = "/renewal/create";

//Health
export const health = "/health";

//Message Center
export const conversationEndPoint = "/messenger/conversations";
export const conversationMessageEndpoint = "/messenger/conversations/messages/";
export const conversationUploadFileEndpoint = "/messenger/upload";
export const conversationListFilesEndpoint = "/messenger/file/";
export const conversationDownloadFileEndpoint = "/messenger/file/";
export const conversationSendMessageEndpoint = "/messenger/messages";
export const conversationDeleteMesaage = "/messenger/messages";
export const conversationCreateGroupEndpoint = "/messenger/conversations/group";
export const conversationuploadChatFileEndpoint = "/messenger/upload";
export const conversationLeaveGroupEndpoint = "/messenger/conversations/";

//MaintenanceUpdate
export const maintenanceCreateEndPoint = "/features/maintenance";
export const maintenanceUpdateEndPoint = "maintenanceUpdateEndPoint";
export const maintenanceDeleteEndPoint = "/features/maintenance";
export const maintenanceHistoryFetchEndPoint = "/features/maintenance/";
export const maintenanceFetchSubscriptionEndPoint = "/features/subscriptions";
export const maintenanceCreateSubscriptionEndPoint = "/features/subscriptions";

//Notification
export const notificationStatusEndpoint = "/notifications/status";
export const notificatioToggleEndpoint = "/notifications/toggle";

//Project Management
export const projectManagemantEndpoint = "/work-letter/projects";
export const projectManagemantGetSummaryEndpoint = "/work-letter/summary";

//Space Up
export const spaceUpEndpoint = "/api/space-up/buildings";
export const spaceUpProspectEndpoint = "/api/space-up/spaces/";
export const spaceUpBuildingAssginEndpoint = "/api/space-up/buildings/assign";
export const removeUserFromBuildingEndpoint = "/api/space-up/buildings/";

//Building Stack
export const buildingStackEndpoint = "/building-stack/buildings/";
export const buildingStackAddUnitEndpoint = "/building-stack/floors/";
export const buildingStackUnitEndPoint = "/building-stack/units/";
export const buildingStackMergeEndpoint = "/building-stack/units/merge";
export const buildingStackConflictEndpoint = "/building-stack/conflicts/";

//renewal Tracker
export const renewal = "/renewal/";
