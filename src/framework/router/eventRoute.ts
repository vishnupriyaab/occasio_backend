import express from "express";
import { EventRepository } from "../../repositories/eventRepository";
import { EventController } from "../../controllers/eventController";
import { EventUseCase } from "../../usecase/eventUseCase";
import { CloudinaryService } from "../utils/claudinaryService";
import { upload } from "../middlewares/claudinaryUpload";
import { ICloudinaryService } from "../../interfaces/utils/IClaudinary";
import IEventRepository from "../../interfaces/repository/event.Repository";
import { IEventUseCase } from "../../interfaces/useCase/event.useCase";
import { IEventController } from "../../interfaces/controller/event.controller";

const eventRoute = express.Router();

const claudinaryService:ICloudinaryService = new CloudinaryService()
const eventRepository:IEventRepository = new EventRepository();
const eventUseCase:IEventUseCase = new EventUseCase(claudinaryService, eventRepository);
const eventController:IEventController = new EventController(eventUseCase,claudinaryService);

  //event
  eventRoute.get('/searchEvent',eventController.searchEvent.bind(eventController));

  eventRoute.post('/addEvent', upload.single('img'), eventController.addEvent.bind(eventController));
  
  eventRoute.put('/updateEvent/:id', upload.single('img'), eventController.updateEvent.bind(eventController));
  
  eventRoute.patch('/blockEvent/:id', eventController.blockEvent.bind(eventController));

  eventRoute.delete('/deleteEvent/:id', eventController.deleteEvent.bind(eventController));
  
  
  //Package
  eventRoute.get('/getPackages/:id', eventController.getPackages.bind(eventController));
  
  eventRoute.post('/addPackage', upload.single('img'), eventController.addPackage.bind(eventController));
  
  eventRoute.put('/updatePackage/:id', upload.single('img'), eventController.updatePackage.bind(eventController));
  
  eventRoute.patch('/blockPackage/:id', eventController.blockPackage.bind(eventController));
  
  eventRoute.delete('/deletePackage/:id', eventController.deletePackage.bind(eventController));
  
  
  //Features
  eventRoute.get('/getPackageDetails/:id', eventController.getPackageDetails.bind(eventController));
  
  eventRoute.patch('/blockFeature/:packageId', eventController.blockFeature.bind(eventController));
  
  eventRoute.delete('/deleteFeature/:packageId', eventController.deleteFeature.bind(eventController));


export default eventRoute;