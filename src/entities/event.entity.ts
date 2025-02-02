export interface IEvent {
    _id: string;
    eventName: string;
    description: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    isBlocked: boolean;
  }

  export interface IAddEventRegister {
    eventName: string;
    packageName: string;
    desciption: string;
    image: string;
  }