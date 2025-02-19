import { FilterQuery, Model, Query } from "mongoose";

export default class AdminBaseRepositoy <TModels extends Record<string, Document>>{
    protected models: { [K in keyof TModels]: Model<TModels[K]> };

    constructor(models: { [K in keyof TModels]: Model<TModels[K]> }) {
        this.models = models;
    }

    findOne<K extends keyof TModels>(modelName: K, query: FilterQuery<TModels[K]>): Query<TModels[K] | null, TModels[K]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
    
        return model.findOne(query);
    }

}