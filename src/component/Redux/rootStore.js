import { configureStore} from '@reduxjs/toolkit'
import adminslice from './adminslice';
import toolslice from './toolslice';


const rootstore = configureStore({
    reducer:{
        admin: adminslice.reducer,
        tool: toolslice.reducer
    }
})


export default rootstore;