import { createStageSchema, logExpenseSchema, updateStageSchema } from "./productionStage.validation.js";
import * as service from "./productionStage.service.js";

export const createStage = async (req ,res)=>{
    try {
        const cycleId = parseInt(req.params.cycle_id);
        const {error, value} = createStageSchema.validate(req.body);
        if(error){
            return res.status(400).json({message: error.message});
        }

        const stage = await service.createStage(cycleId, value);
        res.status(201).json({success:true, data: stage});
        
    } catch (error) {
        console.error("Error creating production stage:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const getAllStages = async(req, res) =>{
    try {
        const cycleId = parseInt(req.params.cycle_id);
        const stages = await service.getAllStages(cycleId);
        res.status(200).json({success:true, data: stages});
        
    } catch (error) {
        console.error("Error fetching production stages:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const getStageById = async(req, res) =>{
    try {
        const cycleId = parseInt(req.params.cycle_id);
        const stageId = parseInt(req.params.id);
        const stage = await service.getStageById(cycleId, stageId);
        if(!stage){
            return res.status(404).json({message:"Production stage not found"});
        }
        res.status(200).json({success:true, data: stage});
        
    } catch (error) {
        console.error("Error fetching production stage:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const updateStage = async(req, res) =>{
    try {
        const stageId = parseInt(req.params.stage_id);

        const {error, value} = updateStageSchema.validate(req.body);
        if(error){
            return res.status(400).json({message: error.message});
        }

        const updatedStage = await service.updateStage(stageId, value);
        res.status(200).json({success:true, data: updatedStage});
        
    } catch (error) {
        console.error("Error updating production stage:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const logExpense = async(req, res) =>{
    try {
        const stageId = parseInt(req.params.stage_id);
        const {error, value} = logExpenseSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const updatedStage = await service.logExpense(stageId, value.amount);
        res.status(200).json({ success: true, data: updatedStage });

    } catch (error) {
        console.error("Error logging expense:", error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const completeStage = async(req, res) =>{
    try {
        const stageId = parseInt(req.params.id);
        const completedStage = await service.completeStage(stageId);
        res.status(200).json({success:true, data: completedStage});
        
    } catch (error) {
        console.error("Error completing production stage:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}