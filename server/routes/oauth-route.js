import { Router } from 'express';
import { handleOAuthSignUp } from '../controllers/oauth.js';

const OAuthRoute = Router();

OAuthRoute.get('/', handleOAuthSignUp);

export default OAuthRoute;
