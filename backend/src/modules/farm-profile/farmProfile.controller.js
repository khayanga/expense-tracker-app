import { createFarmProfileSchema } from "./farmProfile.validation.js";
import * as service from "./farmProfile.service.js";
export const createFarmProfile = async(req,res) =>{
    try {
        const{error,value} = createFarmProfileSchema.validate(req.body);
        if(error){
            return res.status(400).json({message:error.message});
        }

        const userId = req.params.user_id;
        const profile = await service.createFarmProfile(userId,value);
        res.status(201).json({success:true,data:profile});

    } catch (error) {
        console.error("Error creating farm profile:", error);
        res.status(500).json({message:"Internal server error"});
    
    }
}

export const getFarmProfile = async(req,res) =>{
    try {

        const userId = req.params.user_id;
        const profile = await service.getFarmProfileByUserId(userId);
        if(!profile){
            return res.status(404).json({message:"Farm profile not found"});
        }
        res.status(200).json({success:true,data:profile});
        
    } catch (error) {
        console.error("Error fetching farm profile:", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const updateFarmProfile = async(req,res) =>{
    try {
        const{error,value} = createFarmProfileSchema.validate(req.body);
        if(error){
            return res.status(400).json({message:error.message});
        }

        const userId = req.params.user_id;
        const profile = await service.updateFarmProfileByUserId(userId,value);
        res.status(200).json({success:true,data:profile});
        
    } catch (error) {
        console.error("Error updating farm profile:", error);
        res.status(500).json({message:"Internal server error"});
    }
}