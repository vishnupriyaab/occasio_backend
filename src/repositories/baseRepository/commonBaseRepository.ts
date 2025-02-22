import { FilterQuery, Model, Query, UpdateQuery } from "mongoose";

export default class CommonBaseRepository<
  TModels extends Record<string, Document>
> {
  protected models: { [K in keyof TModels]: Model<TModels[K]> };

  constructor(models: { [K in keyof TModels]: Model<TModels[K]> }) {
    this.models = models;
  }

  findById<K extends keyof TModels>(
    modelName: K,
    id: string
  ): Query<TModels[K] | null, TModels[K]> {
    const model = this.models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.findById(id);
  }

  findOne<K extends keyof TModels>(
    modelName: K,
    query: FilterQuery<TModels[K]>
  ): Query<TModels[K] | null, TModels[K]> {
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
  updateById<K extends keyof TModels>(
    modelName: K,
    id: string,
    updateData: UpdateQuery<TModels[K]>
  ): Promise<TModels[K] | null> {
    const model = this.models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }
  updateOne<K extends keyof TModels>(
    modelName: K,
    filter: FilterQuery<TModels[K]>,
    updateData: UpdateQuery<TModels[K]>,
    options?: { upsert?: boolean }
  ): Promise<import("mongodb").UpdateResult> {
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

  count<K extends keyof TModels>(
    modelName: K,
    query: FilterQuery<TModels[K]>
  ): Promise<number> {
    const model = this.models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.countDocuments(query);
  }

  //create
  createData<K extends keyof TModels>(
    modelName: K,
    data: Partial<TModels[K]>
  ): Promise<TModels[K]> {
    const model = this.models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.create(data);
  }

  deleteById<K extends keyof TModels>(
    modelName: K,
    id: string
  ): Promise<TModels[K] | null> {
    const model = this.models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    return model.findByIdAndDelete(id).exec();
  }

  pushToArray<K extends keyof TModels>(
    modelName: K,
    filter: FilterQuery<TModels[K]>,
    field: string,
    value: any
  ): Promise<TModels[K] | null> {
    const model = this.models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    // Use type assertion to bypass TypeScript's strict typing
    const updateObj = { $push: {} } as any;
    updateObj.$push[field] = value;

    return model
      .findOneAndUpdate(filter, updateObj, { new: true, runValidators: true })
      .exec();
  }

  updateArrayItem<K extends keyof TModels>(
    modelName: K,
    filter: FilterQuery<TModels[K]>,
    arrayField: string,
    itemId: string,
    updateData: Record<string, any>
  ): Promise<TModels[K] | null> {
    const model = this.models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    // Create the filter with array item identifier
    const queryFilter = { ...filter } as any;
    queryFilter[`${arrayField}._id`] = itemId;

    // Create the update query with positional $ operator
    const update = { $set: {} } as any;
    for (const [key, value] of Object.entries(updateData)) {
      update.$set[`${arrayField}.$.${key}`] = value;
    }

    return model
      .findOneAndUpdate(queryFilter, update, { new: true, runValidators: true })
      .exec();
  }

  async toggleFeatureBlockStatus<T extends Document>(
    modelName: keyof TModels,
    packageId: string,
    featureId: string
  ): Promise<TModels[typeof modelName] | null> {
    const model = this.models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    const query = {
      _id: packageId,
      "items._id": featureId,
    } as FilterQuery<TModels[typeof modelName]>;

    const doc = await model.findOne(query).exec();
    if (!doc) return null;

    const items = (doc as any).items;
    if (!Array.isArray(items)) return null;

    const feature = items.find(
      (item: any) => item._id.toString() === featureId
    );
    if (!feature) return null;

    const newBlockStatus = !feature.isBlocked;

    const updateQuery = {
      $set: { "items.$.isBlocked": newBlockStatus },
    } as unknown as UpdateQuery<TModels[typeof modelName]>;

    return (await model
      .findOneAndUpdate(query, updateQuery, { new: true })
      .exec()) as unknown as Promise<TModels[typeof modelName] | null>;
  }

  async pullFromArray<K extends keyof TModels>(
    modelName: K,
    documentId: string,
    arrayField: string,
    criteria: Record<string, any>
  ): Promise<TModels[K] | null> {
    const model = this.models[modelName];
    if (!model) throw new Error(`Model ${String(modelName)} not found`);

    const pullOperation = {} as any;
    pullOperation[arrayField] = criteria;

    const updateQuery = {
      $pull: pullOperation,
    } as unknown as UpdateQuery<TModels[K]>;

    return (await model
      .findByIdAndUpdate(documentId, updateQuery, { new: true })
      .exec()) as unknown as Promise<TModels[K] | null>;
  }
}
