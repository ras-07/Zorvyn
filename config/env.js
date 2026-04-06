import {config} from 'dotenv';

config({ path:`.env.${process.env.NODE_ENV || 'development'}.local`});
export const {PORT,NODE_ENV,DB_URI,JWT_SECRET,JWT_EXPIRES_IN,ARCJET_ENV,ARCJET_KEY,ATLAS_PROJECT_ID,ATLAS_API_KEY,ATLAS_API_SECRET} =process.env;