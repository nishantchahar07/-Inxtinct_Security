import mongoose, { Schema, InferSchemaType, Model, Types } from 'mongoose';

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  city: { type: String, required: true },
  salary: { type: Number, required: true },
  joinedAt: { type: Date, required: true },
}, { timestamps: true });

export type EmployeeDoc = InferSchemaType<typeof EmployeeSchema> & { _id: Types.ObjectId };

export const EmployeeModel: Model<EmployeeDoc> =
  (mongoose.models.Employee as Model<EmployeeDoc>) || mongoose.model<EmployeeDoc>('Employee', EmployeeSchema);
