import express,{ NextFunction, Request, Response } from "express";
import { EventRepository } from "../../repositories/eventRepository";
import { EventController } from "../../controllers/eventController";
import { EventUseCase } from "../../usecase/eventUseCase";
import { CloudinaryService } from "../utils/claudinaryService";
import { upload } from "../middlewares/claudinaryUpload";

const eventRoute = express.Router();

const claudinaryService = new CloudinaryService()
const eventRepository = new EventRepository();
const eventUseCase = new EventUseCase(claudinaryService, eventRepository);
const eventController = new EventController(eventUseCase,claudinaryService);


const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

eventRoute.get( '/getEvents',asyncHandler(async (req: Request, res: Response) => {  return await eventController.getEvents(req, res) }) );
eventRoute.post( '/addEvent', upload.single('img'),asyncHandler(async (req: Request, res: Response) => {  return await eventController.addEvent(req, res) }) );
eventRoute.put( '/updateEvent/:id', upload.single('img'),asyncHandler(async (req: Request, res: Response) => {  return await eventController.updateEvent(req, res) }) );
eventRoute.patch( '/blockEvent/:id',asyncHandler(async (req: Request, res: Response) => {  return await eventController.blockEvent(req, res) }) );
eventRoute.delete( '/deleteEvent/:id',asyncHandler(async (req: Request, res: Response) => {  return await eventController.deleteEvent(req, res) }) );


export default eventRoute