
import db from "../../lib/prisma.js"

export const createCycle = async (userId,data) => {

    const farmProfile = await db.farmProfile.findUnique({
        where:{user_id:userId}  
    })
     if (!farmProfile) {
    throw new Error("Farm profile not found for this user");
  }

    const cycle = await db.productionCycle.create({
        data:{
            user_id: userId,
            farm_profile_id: farmProfile.id,
            name: data.name,
            cycle_type: data.cycleType,
            start_date: data.startDate,
            expected_end: data.expectedEnd,
            expected_income: data.expectedIncome
        }
    })
    return cycle;
}

export const getAllCycles = async (userId) => {
    return db.productionCycle.findMany({
        where:{
            user_id:userId,
            farmProfile: { user_id: userId } 
        },
        orderBy:{created_at:"desc"}
    })
}

export const getCycleById = async(userId,cycleId) => {
    return db.productionCycle.findFirst({
        where:{id:cycleId,user_id:userId}
    })
}

export const updateCycle = async(userId,cycleId,data) => {
    const existingCycle = await getCycleById(userId,cycleId);
    if(!existingCycle){
        throw new Error("Production cycle not found");
    }
    if(existingCycle.status === "completed"){
        throw new Error("Completed production cycles cannot be updated");
    }

    const updatedCycle = await db.productionCycle.update({
        where:{id:cycleId},
        data:{
            name: data.name ?? existingCycle.name,
            cycle_type: data.cycleType ?? existingCycle.cycle_type,
            start_date: data.startDate ?? existingCycle.start_date,
            expected_end: data.expectedEnd ?? existingCycle.expected_end,
            status: data.status ?? existingCycle.status,
            expected_income: data.expectedIncome ?? existingCycle.expected_income
        }
    })
    return updatedCycle;

}

export const closeCycle = async(userId,cycleId) => {
    const existingCycle = await getCycleById(userId,cycleId);
    if(!existingCycle){
        throw new Error("Production cycle not found");
    }
    if(existingCycle.status === "completed"){
        throw new Error("Production cycle is already completed");
    }
    
    const endedCycle = await db.productionCycle.update({
        where:{id:cycleId},
        data:{
            status: "completed",
        }
    })
    return endedCycle;
}