export enum ResponseMessage {
  //common - use
  LOGIN_SUCCESS = "Login successful",
  LOGIN_FAILURE = "An error occurred during login",
  LOGOUT_SUCCESS = "Logout successful",
  LOGOUT_FAILURE = "Failed to logout",
  AUTHENTICATION_FAILURE = "Failed to authenticate",
  OTP_VERIFIED = "OTP verified successfully",
  OTP_VERIFICATION_FAILED = "Failed to verify OTP",
  PASSWORD_RESET_LINK_SENT = "Password reset link sent to your email",
  PASSWORD_RESET_FAILURE = "Failed to send password reset link",
  PASSWORD_RESET_SUCCESS = "Password has been reset",
  FIELDS_REQUIRED = "All fields are required",
  ACCOUND_NOT_VERIFIED = "Account not verified. Please verify your account.",
  ACCOUNT_BLOCKED = "Your account is blocked",
  INVALID_PASSWORD = "Invalid password",

  //admin
  USER_BLOCKED = "User blocked successfully",
  USER_UNBLOCKED = "User unblocked successfully",
  BLOCK_USER_FAILURE = "Failed to block/unblock user",
  FILE_NOT_FOUND = "No image file provided",

  //user
  USER_REGISTER_SUCCESS = "User registered successfully!",
  USER_REGISTER_FAILURE = "Failed to register user",
  GOOGLE_LOGIN_SUCCESS = "Successfully authenticated with Google",
  GOOGLE_LOGIN_FAILURE = "Google authentication failed",
  GOOGLE_CREDENTIAL_REQUIRED = "Google credential is required",
  FETCH_USER = "Users fetched successfully",
  FETCH_USER_FAILURE = "Failed to fetch users",

  //employee
  EMPLOYEE_REGISTER_SUCCESS = "Employee registered successfully!",
  EMPLOYEE_REGISTER_FAILURE = "Failed to register employee",
  EMPLOYEE_NOT_FOUND = "Employee not found",
  FETCH_EMPLOYEE = "Employees fetched successfully",
  FETCH_EMPLOYEE_FAILURE = "Failed to fetch employees",
  EMPLOYEE_BLOCKED = "Employee blocked successfully",
  EMPLOYEE_UNBLOCKED = "Employee unblocked successfully",
  EMPLOYEE_BLOCK_FAILURE = "Failed to block/unblock employee",

  //Event
  EVENT_CREATED = "Event created successfully",
  EVENT_CREATION_FAILED = "Failed to create event",
  EVENT_UPDATED = "Event updated successfully",
  EVENT_UPDATE_FAILED = "Failed to update event",
  EVENT_DELETED = "Event deleted successfully",
  EVENT_DELETION_FAILED = "Failed to delete event",
  EVENT_BLOCKED = "Event blocked successfully",
  EVENT_UNBLOCKED = "Event unblocked successfully",
  EVENT_BLOCK_FAILURE = "Failed to block/unblock event",
  FETCH_EVENT = "Events fetched successfully",
  FETCH_EVENT_FAILURE = "Failed to fetch events",

  //Package
  PACKAGE_CREATED = "Package created successfully",
  PACKAGE_CREATION_FAILED = "Failed to create package",
  PACKAGE_UPDATED = "Package updated successfully",
  PACKAGE_UPDATE_FAILED = "Failed to update package",
  PACKAGE_DELETED = "Package deleted successfully",
  PACKAGE_DELETION_FAILED = "Failed to delete package",
  PACKAGE_BLOCKED = "Package blocked successfully",
  PACKAGE_UNBLOCKED = "Package unblocked successfully",
  PACKAGE_BLOCK_FAILURE = "Failed to block/unblock package",
  FETCH_PACKAGE = "Package fetched successfully",
  FETCH_PACKAGE_FAILURE = "Failed to fetch packages",
  PACKAGE_ID_REQUIRED = "Package ID is required.",
  FEATURE_ID_REQUIRED = "Feature ID is required.",
  FEATURE_BLOCK_FAILURE = "Failed to block/unblock feature.",
  FEATURE_BLOCKED = "Feature blocked successfully.",
  FEATURE_UNBLOCKED = "Feature unblocked successfully.",
  FEATURE_DELETED = "Package deleted successfully",
  FEATURE_DELETION_FAILED = "Failed to delete package",

  //Food
  FOOD_CREATED = "Food created successfully",
  FOOD_CREATION_FAILED = "Failed to create food",
}
