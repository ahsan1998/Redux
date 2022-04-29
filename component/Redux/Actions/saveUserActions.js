export const saveUserDetails = (userDetail) => ({
    type: "SAVE_USER_DETAIL",
    userDetails: { 
        id: userDetail.id,
        createdAt: userDetail.createdAt, 
        updatedAt: userDetail.updatedAt, 
        firstName: userDetail.firstName, 
        lastName: userDetail.lastName, 
        role: userDetail.role, 
        email: userDetail.email, 
        avatar: userDetail.avatar, 
        phone: userDetail.phone, 
        isActive: userDetail.isActive,  
    } 
});