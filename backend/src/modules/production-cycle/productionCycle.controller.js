import { createProductionCycleSchema, updateProductionCycleSchema } from "./productionCycle.validation.js";
import * as service from "./productionCycle.service.js";

export const createCycle = async(req, res)=>{
    try {
        const userId = req.params.user_id;

        const {error, value} = createProductionCycleSchema.validate(req.body);
        if(error){
            return res.status(400).json({message: error.message});
        }

        const cycle = await service.createCycle(userId, value);
        res.status(201).json({success:true, data: cycle});
        
    } catch (error) {
        console.error("Error creating production cycle:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const getAllCycles = async(req, res) =>{
    try {
        const userId = req.params.user_id;
        const cycles = await service.getAllCycles(userId);
        res.status(200).json({success:true, data: cycles});
        
    } catch (error) {
        console.error("Error fetching production cycles:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const getCycleById = async(req, res) =>{
    try {
        const userId = req.params.user_id;
        const cycleId = req.params.id;
        const cycle = await service.getCycleById(userId, cycleId);
        if(!cycle){
            return res.status(404).json({message:"Production cycle not found"});
        }
        res.status(200).json({success:true, data: cycle});
        
    } catch (error) {
        console.error("Error fetching production cycle:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const updateCycle = async(req, res) =>{
    try {
        const userId = req.params.user_id;
        const cycleId = parseInt(req.params.cycle_id);

        const {error, value} = updateProductionCycleSchema.validate(req.body);
        if(error){
            return res.status(400).json({message: error.message});
        }

        const updatedCycle = await service.updateCycle(userId, cycleId, value);
        res.status(200).json({success:true, data: updatedCycle});

    } catch (error) {
        console.error("Error updating production cycle:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}

export const closeCycle = async(req, res) =>{
    try {
        const userId = req.params.user_id;
        const cycleId = req.params.id;

        const closedCycle = await service.closeCycle(userId, cycleId);
        res.status(200).json({success:true, data: closedCycle});

    } catch (error) {
        console.error("Error closing production cycle:", error);
        res.status(500).json({message:"Internal server error"});
        
    }
}