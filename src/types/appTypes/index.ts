export class AppAdAccount {
  id: string;
  name: string;
  saved_audiences: any;
  constructor(id: string, name: string, saved_audiences: any) {
    this.id = id;
    this.name = name;
    this.saved_audiences = saved_audiences;
  }
}
export class AppAccount {
  pageId: string;
  name: string;
  picture: string;
  constructor(id: string, name: string, picture: string) {
    this.pageId = id;
    this.name = name;
    this.picture = picture;
  }
}

export class AppAdGroup {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

