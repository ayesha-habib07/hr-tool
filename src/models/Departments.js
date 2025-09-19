    import mongoose from "mongoose";

    const departmentSchema = new mongoose.Schema(
        {
            departmentId:{type:String},
            name:{type:String, required:true},
            // code:{
            //     type:Number,
            //     unique:true,
            //     required:true,
            // },
            description:{type:String},
            managerId:{type:mongoose.Schema.Types.ObjectId, ref:"Employee"},
            createdAt:{type:Date},
            updatedAt:{type:Date},
        },
        {timestamps:true}
    );
    const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);
    export default Department;