import * as actions from './action';
const mode = 
    localStorage.getItem("themeMode") === null ? 'light' : localStorage.getItem("themeMode")

const darkmodeReducer = (state = mode, action) => {
    switch (action.type) {
        case actions.SET_MODE:
            {
                localStorage.setItem('themeMode', action.payload.mode);
                return { mode : action.payload.mode };
            }

        default:
            return { mode : state};
    }
};
export default darkmodeReducer;