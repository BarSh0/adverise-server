import { facebookService } from '../services/facebook/facebook.service';

class PlatformApi {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public getAdAccounts = async () => {
    return;
  };
}

const FacebookApi = new PlatformApi('facebook');

FacebookApi.getAdAccounts();
