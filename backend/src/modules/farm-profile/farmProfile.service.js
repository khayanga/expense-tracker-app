import db from "../../lib/prisma.js";


export const createFarmProfile = async(userId, data) => {
    const existingProfile = await db.farmProfile.findUnique({
        where: { user_id: userId },
    });
    
    if (existingProfile) {
        throw new Error("Farm profile already exists for this user");
    }

    const newProfile = await db.farmProfile.create({
        data: {
            user_id: userId,
            farm_name: data.farmName,
            farm_type: data.farmType,
            main_activity: data.mainActivity,
            farm_size: data.farmSize,
            location: data.location,
        }
    })
    return newProfile;
}

export const getFarmProfileByUserId = async(userId) => {
    return db.farmProfile.findUnique({
        where:{user_id:userId}
    })
}

export const updateFarmProfileByUserId = async(userId,data) =>{
    const existingProfile = await db.farmProfile.findUnique({
        where: { user_id: userId },
    });
    
    if (existingProfile) {
        throw new Error("Farm profile already exists for this user");
    }

    const updatedProfile = await db.farmProfile.update({
        where:{user_id:userId},
        data:{
            farm_name: data.farmName,
            farm_type: data.farmType,
            main_activity: data.mainActivity,
            farm_size: data.farmSize,
            location: data.location
        }
    })

    return updatedProfile;
}