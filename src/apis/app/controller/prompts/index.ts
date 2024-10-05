import {Router} from "express";

import * as tagSuggestion from './tagSuggestion';
import * as languaSuggestion from './language';
import * as fieldSuggestion from './field_study';
import * as skillSuggestion from './skills';

const suggestionRouter = Router();

suggestionRouter.get('/getTagSuggestions', tagSuggestion.suggestionList);
suggestionRouter.get('/getLanguage', languaSuggestion.getLanguageSuggestion);
suggestionRouter.get('/getFieldName', fieldSuggestion.getFieldSuggestions);
suggestionRouter.get('/getSkills', skillSuggestion.getSkillSuggestions);

export default suggestionRouter;