import { FilterQuery, Model, Query, UpdateQuery } from "mongoose";

export default class CommonBaseRepository <TModels extends Record<string, Document>>{
    protected models: { [K in keyof TModels]: Model<TModels[K]> };

    constructor(models: { [K in keyof TModels]: Model<TModels[K]> }) {
        this.models = models;
    }

    findById<K extends keyof TModels>(modelName: K, id: string): Query<TModels[K] | null, TModels[K]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
    
        return model.findById(id);
    }

    findOne<K extends keyof TModels>(modelName: K, query: FilterQuery<TModels[K]>): Query<TModels[K] | null, TModels[K]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
    
        return model.findOne(query);
    }

    findOneAndUpdate<K extends keyof TModels>(
        modelName: K,
        filter: FilterQuery<TModels[K]>,
        updateData: UpdateQuery<TModels[K]>
      ): Promise<TModels[K] | null> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
      
        return model.findOneAndUpdate(
          filter,
          { $set: updateData },
          { new: true, runValidators: true }
        );
      }
    
    //block-unblock
    updateById<K extends keyof TModels>( modelName: K, id: string, updateData: UpdateQuery<TModels[K]> ): Promise<TModels[K] | null> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
        
        return model.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    }
    updateOne<K extends keyof TModels>(
        modelName: K,
        filter: FilterQuery<TModels[K]>,
        updateData: UpdateQuery<TModels[K]>,
        options?: { upsert?: boolean }
    ): Promise<import('mongodb').UpdateResult> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
      
        return model.updateOne(filter, { $set: updateData }, options);
    }

    // search and filter
    findMany<K extends keyof TModels>(
        modelName: K,
        query: FilterQuery<TModels[K]>,
        options?: { skip?: number; limit?: number; sort?: Record<string, 1 | -1> }
      ): Promise<TModels[K][]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
      
        return model
          .find(query)
          .skip(options?.skip ?? 0)
          .limit(options?.limit ?? 0)
          .sort(options?.sort ?? {});
      }
      
    count<K extends keyof TModels>(modelName: K, query: FilterQuery<TModels[K]>): Promise<number> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
      
        return model.countDocuments(query);
    }

    //create
    createData<K extends keyof TModels>(modelName: K, data: Partial<TModels[K]>): Promise<TModels[K]> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
    
        return model.create(data);
    }

    deleteById<K extends keyof TModels>(modelName: K, id: string): Promise<TModels[K] | null> {
        const model = this.models[modelName];
        if (!model) throw new Error(`Model ${String(modelName)} not found`);
    
        return model.findByIdAndDelete(id).exec();
    }
      
}