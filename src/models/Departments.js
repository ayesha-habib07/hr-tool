    import mongoose from "mongoose";

    const departmentSchema = new mongoose.Schema(
        {
            departmentId:{type:String},
            name:{type:String, required:true},
            description:{type:String},
            managerId:{type:mongoose.Schema.Types.ObjectId, ref:"Employee"},
            createdAt:{type:Date},
            updatedAt:{type:Date},
        },
        {timestamps:true}
    );
    const Department = mongoose.models.department || mongoose.model("department", departmentSchema);
    export default Department;