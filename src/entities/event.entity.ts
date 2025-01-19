export interface IEvent {
    _id: string;
    eventName: string;
    // packageName: string;
    description: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    isBlocked: boolean;
  }

  export interface IAddEventRegister {
    eventName: string;
    packageName: string;
    desciption: string;
    image: string;
  }