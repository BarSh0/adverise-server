type ModelNames = 'Platform' | 'User' | 'Post' | 'Automation' | 'Page';
type Fields =
  | 'platformId'
  | 'name'
  | 'accessTokens'
  | 'pages'
  | 'automations'
  | 'postId'
  | 'pageId'
  | 'campaignId'
  | 'handled'
  | 'deleted'
  | 'type'
  | 'automationId'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | 'email'
  | 'password'
  | 'phone'
  | 'address'
  | 'city';

export { ModelNames, Fields };
