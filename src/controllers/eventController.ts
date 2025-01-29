import { Request, Response } from "express";
import { EventUseCase } from "../usecase/eventUseCase";
import { handleError, handleSuccess } from "../framework/utils/responseHandler";
import { ICloudinaryService } from "../interfaces/utils/IClaudinary";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import { ResponseMessage } from "../constant/responseMsg";
import { IEventUseCase } from "../interfaces/useCase/event.useCase";

export class EventController {
  constructor(
    private eventUseCase: IEventUseCase,
    private cloudinaryService: ICloudinaryService
  ) {}

  //addEvent
  async addEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventName, description } = req.body;
      console.log(eventName, description, "req.bodyyy");
      const file = req.file;
      console.log(file, "file in event Controller");

      if (!file) {
        res.status( HttpStatusCode.BAD_REQUEST ).json( handleError( ResponseMessage.FILE_NOT_FOUND, HttpStatusCode.BAD_REQUEST ));
        return;
      }

      const event = await this.eventUseCase.addEvent(
        { eventName, description },
        file
      );
      res.status( HttpStatusCode.CREATED ).json( handleSuccess( ResponseMessage.EVENT_CREATED, HttpStatusCode.CREATED, event ));
      return;
    } catch (error) {
      console.log("Error occured: ",error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.EVENT_CREATION_FAILED,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }
  
  //Search Event
   async searchEvent(req: Request, res: Response): Promise<void> {
    try {
      // Parse and validate query parameters
      const searchTerm = (req.query.searchTerm as string | undefined) || '';
      const filterStatus = req.query.filterStatus as string | undefined;
      
      // Robust page and limit parsing
      const page = req.query.page 
        ? parseInt(req.query.page as string, 10) 
        : 1;
      const limit = req.query.limit 
        ? parseInt(req.query.limit as string, 10) 
        : 10;

      // Validate parsed values
      if (isNaN(page) || isNaN(limit)) {
        res.status(HttpStatusCode.BAD_REQUEST).json(
          handleError('Invalid page or limit parameters', HttpStatusCode.BAD_REQUEST)
        );
        return;
      }

      // Call use case
      const result = await this.eventUseCase.searchEvent(
        searchTerm, 
        filterStatus, 
        page, 
        limit
      );
      console.log(result,"qwertyui")

      // Successful response
      res.status(HttpStatusCode.OK).json(
        handleSuccess(
          ResponseMessage.FETCH_EVENT, 
          HttpStatusCode.OK, 
          result
        )
      );
    } catch (error) {
      // Error handling
      console.error('Search Event Error:', error);

      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        handleError(
          ResponseMessage.FETCH_EVENT_FAILURE, 
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          // error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  }

  //getEvents
  async getEvents(req: Request, res: Response): Promise<void> {
    try {
      const page = (req.query.page as string | undefined) || '';
      console.log(page,"page");
      const limit = (req.query.limit as string | undefined) || '';
      console.log(limit,"limit");
      const events = await this.eventUseCase.getAllEvents();
      res.status(HttpStatusCode.OK).json(handleSuccess(ResponseMessage.FETCH_EVENT,HttpStatusCode.OK,events));
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.FETCH_EVENT_FAILURE,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }

  //updtaeEvent
  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      console.log(id, "id");
      const { eventName, packageName, description } = req.body;
      console.log(eventName, packageName, description, "req.body");
      const file = req.file;

      const updatedData: any = { eventName, packageName, description };

      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updatedData.image = imageUrl;
      }

      const updatedEvent = await this.eventUseCase.updateEvent(id, updatedData);
      res.status(HttpStatusCode.OK).json(handleSuccess(ResponseMessage.EVENT_UPDATED,HttpStatusCode.OK,updatedEvent));
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.EVENT_UPDATE_FAILED,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }

  //blockEvent
  async blockEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      console.log(eventId, "eventid");
      const result: any = await this.eventUseCase.blockEvent(eventId);

      const response = result.isBlocked? ResponseMessage.EVENT_BLOCKED : ResponseMessage.EVENT_UNBLOCKED;
      res.status( HttpStatusCode.OK ).json( handleSuccess( response, HttpStatusCode.OK, result ))
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.EVENT_BLOCK_FAILURE,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }

  //deleteEvent
  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventId = req.params.id;
      await this.eventUseCase.deleteEvent(eventId);

      res.status(HttpStatusCode.OK).json(handleSuccess(ResponseMessage.EVENT_DELETED,HttpStatusCode.OK))
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.EVENT_DELETION_FAILED,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }

  //addPackage
  async addPackage(req: Request, res: Response):Promise<void> {
    try {
      const { packageName, startingAmnt, eventId } = req.body;
      const file = req.file;
      console.log(
        packageName,
        startingAmnt,
        eventId,
        "1111111111111",
        file,
        "req.bodyyyy"
      );

      if (!file) {
        res.status(HttpStatusCode.BAD_REQUEST).json(handleError(ResponseMessage.FILE_NOT_FOUND,HttpStatusCode.BAD_REQUEST));
        return;
      }
      const newPackage = await this.eventUseCase.addPackage(
        { packageName, startingAmnt, eventId },
        file
      );
      
      res.status(HttpStatusCode.CREATED).json(handleSuccess(ResponseMessage.PACKAGE_CREATED, HttpStatusCode.CREATED, newPackage));
      return;
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.PACKAGE_CREATION_FAILED,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }

  //getPackage
  async getPackages(req: Request, res: Response):Promise<void> {
    const eventId: string = req.params.id;
    try {
      console.log(eventId, "eventId");
      const packages = await this.eventUseCase.getAllPackages(eventId);
      
      res.status(HttpStatusCode.OK).json(handleSuccess(ResponseMessage.FETCH_PACKAGE, HttpStatusCode.OK, packages));
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.FETCH_PACKAGE_FAILURE,HttpStatusCode.INTERNAL_SERVER_ERROR));
    }
  }

  //updatePackage
  async updatePackage(req: Request, res: Response): Promise<void> {
    try {
      const packageId = req.params.id;
      console.log(packageId, "packageId");
      const { packageName, startingAmnt, eventId } = req.body;
      console.log(packageName, startingAmnt, eventId, "req.bodyyyyyy");
      const file = req.file;
      const updatedData: any = { packageName, startingAmnt, eventId };
      if (file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        updatedData.image = imageUrl;
      }
      const updatedPackage = await this.eventUseCase.updatedPackage(
        packageId,
        updatedData
      );
      res.status(HttpStatusCode.OK).json(handleSuccess(ResponseMessage.PACKAGE_UPDATED,HttpStatusCode.OK,updatedPackage));
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.PACKAGE_UPDATE_FAILED,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }

  //deletePackage
  async deletePackage(req: Request, res: Response): Promise<void> {
    try {
      const packageId = req.params.id;
      console.log(packageId, "packageId");
      await this.eventUseCase.deletePackage(packageId);
      res.status(HttpStatusCode.OK).json(handleSuccess(ResponseMessage.EVENT_DELETED,HttpStatusCode.OK))
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.EVENT_DELETION_FAILED,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }

  //blockPackage
  async blockPackage(req: Request, res: Response): Promise<void> {
    try {
      const packageId = req.params.id;
      console.log(packageId, "packageIddddddddddd");
      const result: any = await this.eventUseCase.blockPackage(packageId);

      const response = result.isBlocked? ResponseMessage.EVENT_BLOCKED : ResponseMessage.EVENT_UNBLOCKED;
      res.status( HttpStatusCode.OK ).json( handleSuccess( response, HttpStatusCode.OK, result ))
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(handleError(ResponseMessage.EVENT_BLOCK_FAILURE,HttpStatusCode.INTERNAL_SERVER_ERROR))
    }
  }
}
