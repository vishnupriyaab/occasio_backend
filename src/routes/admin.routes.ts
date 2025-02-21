import { Router } from "express";
import { adminAuthController } from "../controllers/management/adminController/authController";
import { JWTService } from "../integration/jwtServices";
import { IJWTService } from "../interfaces/integration/IJwt";
import AuthMiddleware from "../middleware/authenticateToken";
import { adminUserController } from "../controllers/management/adminController/userController";
import { adminEmployeeController } from "../controllers/management/adminController/employeeController";
import { adminEventController } from "../controllers/management/adminController/eventController";
import { upload } from "../middleware/claudinaryUpload";
import { adminPackageController } from "../controllers/management/adminController/packageController";
import { adminFeatureController } from "../controllers/management/adminController/featureController";

const adminRouter = Router();
const iJwtServices: IJWTService = new JWTService();
const authMiddleware = new AuthMiddleware("admin", iJwtServices);


//private - routes
adminRouter
    .post( "/login", adminAuthController.adminLogin.bind(adminAuthController))
    .get( "/isAuthenticate", adminAuthController.isAuthenticated.bind(adminAuthController));


// Protected routes (middleware applied)
adminRouter.use(authMiddleware.authenticateToken.bind(authMiddleware));
adminRouter
    .post( "/logOut", adminAuthController.logOut.bind(adminAuthController))
    .patch( "/blockUser/:id", adminUserController.blockUsers.bind(adminUserController))
    .get( "/searchUser", adminUserController.searchUser.bind(adminUserController))
    .patch( "/blockEmployee/:id", adminEmployeeController.blockEmployee.bind(adminEmployeeController))
    .get( "/searchEmployee", adminEmployeeController.searchEmployee.bind(adminEmployeeController))

////////////////////////////////////////////////////////      Event - Management       ////////////////////////////////////////////////////////
    .get('/searchEvent', adminEventController.searchEvent.bind(adminEventController))
    .post('/addEvent', upload.single('img'), adminEventController.addEvent.bind(adminEventController))
    .put('/updateEvent/:id', upload.single('img'), adminEventController.updateEvent.bind(adminEventController))
    .patch('/blockEvent/:id', adminEventController.blockEvent.bind(adminEventController))
    .delete('/deleteEvent/:id', adminEventController.deleteEvent.bind(adminEventController))

    /////////////////////////////////////////////////////       Package - Management      //////////////////////////////////////////////////////
    .get( "/getPackages/:id", adminPackageController.getPackages.bind(adminPackageController))
    .post( "/addPackage", upload.single("img"), adminPackageController.addPackage.bind(adminPackageController))
    .put( "/updatePackage/:id", upload.single("img"), adminPackageController.updatePackage.bind(adminPackageController))
    .patch( "/blockPackage/:id", adminPackageController.blockPackage.bind(adminPackageController))
    .delete( "/deletePackage/:id", adminPackageController.deletePackage.bind(adminPackageController))

    /////////////////////////////////////////////////////       Feature - Management     //////////////////////////////////////////////////////
    .get( "/getPackageDetails/:id", adminFeatureController.getPackageDetails.bind(adminFeatureController))
    .post( "/addFeature", adminFeatureController.addFeature.bind(adminFeatureController))
    .put( "/updateFeature/:id", adminFeatureController.updateFeature.bind(adminFeatureController))
    .patch( "/blockFeature/:packageId", adminFeatureController.blockFeature.bind(adminFeatureController))
    .delete( "/deleteFeature/:packageId", adminFeatureController.deleteFeature.bind(adminFeatureController));

export default adminRouter;