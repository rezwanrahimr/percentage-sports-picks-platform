import dotenv from "dotenv"
import path from "path"
import Stripe from "stripe";
dotenv.config({ path: path.join(process.cwd(), ".env") })

const config = {
    FrontEndHostedPort: process.env.FRONT_END_HOSTED_PORT as string,
    port: process.env.PORT ? Number(process.env.PORT) : 4000,
    nodeEnv: process.env.NODE_ENV,
    mongoose_uri: process.env.MONGOOSE_URI as string,

    jwt_token_secret: process.env.JWT_TOKEN_SECRET as string,
    token_expairsIn: process.env.TOKEN_EXPAIRS_IN as string,
    jwt_refresh_Token_secret: process.env.JWT_REFRESHTOKEN_SECRET as string,
    rifresh_expairsIn: process.env.REFRESH_TOKEN_EXPAIRS_IN as string,

    // company_gmail: process.env.COMPANY_GMAIL as string,
    // gmail_app_password: process.env.GMAIL_APP_PASSWORD as string,

    sendgrid_api_key: process.env.SENDGRID_API_KEY || '',
    company_email: process.env.COMPANY_EMAIL || 'noreply@yourapp.com',
    company_name: process.env.COMPANY_NAME || 'Your App Name',


    bcrypt_salt: process.env.BCRYPT_SALT as string,

    cloudinary_name: process.env.CLOUDINARY_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,


}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);



export { config, stripe };