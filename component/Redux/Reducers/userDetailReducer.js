const initialState = {
    userDetails: {      
        id: '',
        createdAt: '', 
        updatedAt: '', 
        firstName: '', 
        lastName: '', 
        role: '', 
        email: '', 
        avatar: '', 
        phone: '', 
        isActive: '',  
    }
};
const userDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_USER_DETAIL": {
            return {
                ...state,
                userDetails: action.userDetails
            }
        }
        default: {
            return state;
        }
    }
}
export default userDetailReducer;