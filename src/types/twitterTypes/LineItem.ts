export enum Objective {
  APP_ENGAGEMENTS = 'APP_ENGAGEMENTS',
  APP_INSTALLS = 'APP_INSTALLS',
  REACH = 'REACH',
  FOLLOWERS = 'FOLLOWERS',
  ENGAGEMENTS = 'ENGAGEMENTS',
  VIDEO_VIEWS = 'VIDEO_VIEWS',
  PREROLL_VIEWS = 'PREROLL_VIEWS',
  WEBSITE_CLICKS = 'WEBSITE_CLICKS',
}

export enum Placements {
  ALL_ON_TWITTER = 'ALL_ON_TWITTER',
  PUBLISHER_NETWORK = 'PUBLISHER_NETWORK',
  TAP_BANNER = 'TAP_BANNER',
  TAP_FULL = 'TAP_FULL',
  TAP_FULL_LANDSCAPE = 'TAP_FULL_LANDSCAPE',
  TAP_NATIVE = 'TAP_NATIVE',
  TAP_MRECT = 'TAP_MRECT',
  TWITTER_PROFILE = 'TWITTER_PROFILE',
  TWITTER_REPLIES = 'TWITTER_REPLIES',
  TWITTER_SEARCH = 'TWITTER_SEARCH',
  TWITTER_TIMELINE = 'TWITTER_TIMELINE',
}

export enum ProductType {
  MEDIA = 'MEDIA',
  PROMOTED_ACCOUNT = 'PROMOTED_ACCOUNT',
  PROMOTED_TWEETS = 'PROMOTED_TWEETS',
}
export enum AudienceExpansion {
  BROAD = 'BROAD',
  DEFINED = 'DEFINED',
  EXPANDED = 'EXPANDED',
}

export enum BidStrategy {
  MAX = 'MAX',
  AUTO = 'AUTO',
  TARGET = 'TARGET',
}

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DRAFT = 'DRAFT',
}

export enum Goal {
  APP_CLICKS = 'APP_CLICKS',
  APP_INSTALLS = 'APP_INSTALLS',
  APP_PURCHASES = 'APP_PURCHASES',
  ENGAGEMENT = 'ENGAGEMENT',
  FOLLOWERS = 'FOLLOWERS',
  LINK_CLICKS = 'LINK_CLICKS',
  MAX_REACH = 'MAX_REACH',
  PREROLL = 'PREROLL',
  PREROLL_STARTS = 'PREROLL_STARTS',
  REACH_WITH_ENGAGEMENT = 'REACH_WITH_ENGAGEMENT',
  SITE_VISITS = 'SITE_VISITS',
  VIDEO_VIEW = 'VIDEO_VIEW',
  VIEW_3S_100PCT = 'VIEW_3S_100PCT',
  VIEW_6S = 'VIEW_6S',
  VIEW_15S = 'VIEW_15S',
  WEBSITE_CONVERSIONS = 'WEBSITE_CONVERSIONS',
}
export enum PayBy {
  APP_CLICK = 'APP_CLICK',
  IMPRESSION = 'IMPRESSION',
  LINK_CLICKS = 'LINK_CLICKS',
}

export type LineItemParams = {
  campaign_id: string;
  end_time?: string; //
  objective?: Objective; //
  placements: Placements[];
  product_type: ProductType;
  start_time?: string; //
  advertiser_domain?: string;
  android_app_store_identifier?: string;
  bid_amount_local_micro?: number;
  categories?: string;
  ios_app_store_identifier?: string;
  primary_web_event_tag?: string;
  advertiser_user_id?: string;
  audience_expansion?: AudienceExpansion;
  bid_strategy?: BidStrategy;
  duration_in_days?: number;
  entity_status?: EntityStatus;
  frequency_cap?: number;
  goal?: Goal;
  name?: string;
  pay_by?: PayBy;
  standard_delivery?: boolean;
  total_budget_amount_local_micro?: number;
  daily_budget_amount_local_micro?: number;
};
