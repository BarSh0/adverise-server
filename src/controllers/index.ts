import * as Auth from './auth.controller';
import * as Automation from '../library/automation/automation.controller';
import * as Twitter from '../library/twitter/twitter.controller';
import * as Facebook from '../library/facebook/facebook.controller';
import * as Instagram from '../library/instagram/instagram.controller';
import * as Page from '../library/page/page.controller';
import * as User from './user.controller';
import * as Business from '../library/business/business.controller';

export const Controllers = {
  Auth,
  Automation,
  Business,
  Twitter,
  Facebook,
  Instagram,
  Page,
  User,
};
