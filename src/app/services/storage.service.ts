import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import * as CryptoTS from 'crypto-ts';
import { CookieService } from 'ngx-cookie-service';
import { number } from '@amcharts/amcharts4/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  TEMP = {
    KEY: '_tk',
    PASSWORD: '90590348534YYIU!@00'
  };
  USER = {
    KEY: '_tuL',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  CSPDATA = {
    KEY: '_stepperData',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  CSP = {
    KEY: '_cspData',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  REP = {
    KEY: '_repData',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  TITLE = {
    KEY: '_titleData',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  AFFLIATE = {
    KEY: '_affiliateData',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  SUPPLIAR = {
    KEY: '_suppliarData',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  SERVICESTEPDATA = {
    KEY: '_serviceData',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  FORMSTATS = {
    KEY: '_FORMstatus',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  FORSCREEN = {
    KEY: '_FORscreenstatus',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  FORCOOKIEDIV = {
    KEY: '_FORcookiedivstatus',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  FORPASSWORDDIV = {
    KEY: '_FORpassworddivstatus',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  CHECKOUTPROCESS = {
    KEY: '_FORcheckout',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  IP = {
    KEY: '_FORdevise',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };
  CODEFORBROWSER = {
    KEY: '_forbrowser',
    PASSWORD: '!##0895*()?:}95047834&&tes'
  };

  constructor(
    private cookie: CookieService
  ) { }


  private encription(data: any, secret: string) {
    return CryptoTS.AES.encrypt(JSON.stringify(data), secret);
  }
  private decription(data: any, secret: string) {
    const bytes = CryptoTS.AES.decrypt(data.toString(), secret);
    return JSON.parse(bytes.toString(CryptoTS.enc.Utf8));
  }

  setTempData(ID: string) {
    return this.cookie.set(this.TEMP.KEY, this.encription(ID, this.TEMP.PASSWORD).toString());
  }

  setcspStepData(data: any) {
    return this.cookie.set(this.CSPDATA.KEY,
      this.encription(data, this.CSPDATA.PASSWORD).toString(), 7, '/', environment.DOMAIN, false, 'Lax');
  }

  getcspStepData() {
    const DATA = this.cookie.get(this.CSPDATA.KEY) !== null ? this.cookie.get(this.CSPDATA.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.CSPDATA.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearcspStepData() {
    return this.cookie.delete(this.CSPDATA.KEY, '/', environment.DOMAIN);
  }

  setserviceStepData(data: any) {
    return this.cookie.set(this.SERVICESTEPDATA.KEY,
      this.encription(data, this.SERVICESTEPDATA.PASSWORD).toString(), 7, '/', environment.DOMAIN, false, 'Lax');
  }

  getserviceStepData() {
    const DATA = this.cookie.get(this.SERVICESTEPDATA.KEY) !== null ? this.cookie.get(this.SERVICESTEPDATA.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.SERVICESTEPDATA.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearserviceStepData() {
    return this.cookie.delete(this.SERVICESTEPDATA.KEY, '/', environment.DOMAIN);
  }

  SetFormStatusByUser(data: any) {
    return this.cookie.set(this.FORMSTATS.KEY,
      this.encription(data, this.FORMSTATS.PASSWORD).toString(), 7, '/', environment.DOMAIN, false, 'Lax');
  }

  GetFormStatusByUser() {
    const DATA = this.cookie.get(this.FORMSTATS.KEY) !== null ? this.cookie.get(this.FORMSTATS.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.FORMSTATS.PASSWORD);
    } else {
      return undefined;
    }
  }
  clearFormStatusByUser() {
    return this.cookie.delete(this.FORMSTATS.KEY, '/', environment.DOMAIN);
  }

  getTempData() {
    const DATA = this.cookie.get(this.TEMP.KEY) !== null ? this.cookie.get(this.TEMP.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.TEMP.PASSWORD);
    } else {
      return undefined;
    }
  }
  clearTempData() {
    return this.cookie.delete(this.USER.KEY);
  }

  setUser(data: any) {
    return this.cookie.set(this.USER.KEY, this.encription(data, this.USER.PASSWORD).toString());
  }
  getUser() {
    const DATA = this.cookie.get(this.USER.KEY) !== null ? this.cookie.get(this.USER.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.USER.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearUser() {
    return this.cookie.delete(this.USER.KEY);
  }

  setscreenstatus(data: any) {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    end.setTime(end.getTime());
    console.log(end);
    return this.cookie.set(this.FORSCREEN.KEY,
      this.encription(data, this.FORSCREEN.PASSWORD).toString(), end, '/', environment.DOMAIN, false, 'Lax');
  }

  getscreenstatus() {
    const DATA = this.cookie.get(this.FORSCREEN.KEY) !== null ? this.cookie.get(this.FORSCREEN.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.FORSCREEN.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearscreenstatus() {
    return this.cookie.delete(this.FORSCREEN.KEY, '/', environment.DOMAIN);
  }

  setcookiedivstatus(data: any) {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    end.setTime(end.getTime());
    console.log(end);
    return this.cookie.set(this.FORCOOKIEDIV.KEY,
      this.encription(data, this.FORCOOKIEDIV.PASSWORD).toString(), 30, '/', environment.DOMAIN, false, 'Lax');
  }

  getcookiedivstatus() {
    const DATA = this.cookie.get(this.FORCOOKIEDIV.KEY) !== null ? this.cookie.get(this.FORCOOKIEDIV.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.FORCOOKIEDIV.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearcookiedivstatus() {
    return this.cookie.delete(this.FORCOOKIEDIV.KEY, '/', environment.DOMAIN);
  }


  setpassworddivstatus(data: any) {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    end.setTime(end.getTime());
    console.log(end);
    return this.cookie.set(this.FORPASSWORDDIV.KEY,
      this.encription(data, this.FORPASSWORDDIV.PASSWORD).toString(), end, '/', environment.DOMAIN, false, 'Lax');
  }

  getpassworddivstatus() {
    const DATA = this.cookie.get(this.FORPASSWORDDIV.KEY) !== null ? this.cookie.get(this.FORPASSWORDDIV.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.FORPASSWORDDIV.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearpassworddivstatus() {
    return this.cookie.delete(this.FORPASSWORDDIV.KEY, '/', environment.DOMAIN);
  }

  // TOKEN
  getDataField(type: string) {
    if (this.getUser() !== undefined && this.getUser()[type] !== undefined) {
      return this.getUser()[type];
    } else {
      return undefined;
    }
  }

  isAuthenticate() {
    if (this.getDataField('token') !== undefined) {
      return true;
    } else {
      return false;
    }
  }
  setcspData(data: any) {
    return this.cookie.set(this.CSP.KEY,
      this.encription(data, this.CSP.PASSWORD).toString(), 7, '/', environment.DOMAIN, false, 'Lax');
  }

  getcspData() {
    const DATA = this.cookie.get(this.CSP.KEY) !== null ? this.cookie.get(this.CSP.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.CSP.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearcspData() {
    return this.cookie.delete(this.CSP.KEY, '/', environment.DOMAIN);
  }

  setrepData(data: any) {
    return this.cookie.set(this.REP.KEY,
      this.encription(data, this.REP.PASSWORD).toString(), 7, '/', environment.DOMAIN, false, 'Lax');
  }

  getrepData() {
    const DATA = this.cookie.get(this.REP.KEY) !== null ? this.cookie.get(this.REP.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.REP.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearrepData() {
    return this.cookie.delete(this.REP.KEY, '/', environment.DOMAIN);
  }

  settitleAgencyData(data: any) {
    return this.cookie.set(this.TITLE.KEY,
      this.encription(data, this.TITLE.PASSWORD).toString(), 7, '/', environment.DOMAIN, false, 'Lax');
  }

  gettitleAgencyData() {
    const DATA = this.cookie.get(this.TITLE.KEY) !== null ? this.cookie.get(this.TITLE.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.TITLE.PASSWORD);
    } else {
      return undefined;
    }
  }

  cleartitleAgencyData() {
    return this.cookie.delete(this.TITLE.KEY, '/', environment.DOMAIN);
  }

  setaffiliateData(data: any) {
    return this.cookie.set(this.AFFLIATE.KEY,
      this.encription(data, this.AFFLIATE.PASSWORD).toString(), 7, '/', environment.DOMAIN, false, 'Lax');
  }

  getaffiliateData() {
    const DATA = this.cookie.get(this.AFFLIATE.KEY) !== null ? this.cookie.get(this.AFFLIATE.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.AFFLIATE.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearaffiliateData() {
    return this.cookie.delete(this.AFFLIATE.KEY, '/', environment.DOMAIN);
  }

  setsuppliarData(data: any) {
    return this.cookie.set(this.SUPPLIAR.KEY,
      this.encription(data, this.SUPPLIAR.PASSWORD).toString(), 7, '/', environment.DOMAIN, false, 'Lax');
  }

  getsuppliarData() {
    const DATA = this.cookie.get(this.SUPPLIAR.KEY) !== null ? this.cookie.get(this.SUPPLIAR.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.SUPPLIAR.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearsuppliarData() {
    return this.cookie.delete(this.SUPPLIAR.KEY, '/', environment.DOMAIN);
  }
  savecheckoutdata(data: any) {
    return this.cookie.set(this.CHECKOUTPROCESS.KEY,
      this.encription(data, this.CHECKOUTPROCESS.PASSWORD).toString(), 7, '/', environment.DOMAIN, true, 'Lax');
  }
  getcheckoutdata() {
    const DATA = this.cookie.get(this.CHECKOUTPROCESS.KEY) !== null ? this.cookie.get(this.CHECKOUTPROCESS.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.CHECKOUTPROCESS.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearcheckoutdata() {
    return this.cookie.delete(this.CHECKOUTPROCESS.KEY, '/', environment.DOMAIN);
  }

  saveIp(data: any) {
    return this.cookie.set(this.IP.KEY,
      this.encription(data, this.IP.PASSWORD).toString(), 30000, '/', environment.DOMAIN, false, 'Lax');
  }
  getIp() {
    const DATA = this.cookie.get(this.IP.KEY) !== null ? this.cookie.get(this.IP.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.IP.PASSWORD);
    } else {
      return undefined;
    }
  }

  cleaIp() {
    return this.cookie.delete(this.IP.KEY, '/', environment.DOMAIN);
  }
  saveuniquecodeforbrowser(data: any) {
    return this.cookie.set(this.CODEFORBROWSER.KEY,
      this.encription(data, this.CODEFORBROWSER.PASSWORD).toString(), 30000, '/', environment.DOMAIN, false, 'Lax');
  }
  getuniquecodeforbrowser() {
    const DATA = this.cookie.get(this.CODEFORBROWSER.KEY) !== null ? this.cookie.get(this.CODEFORBROWSER.KEY) : undefined;
    if (DATA && DATA !== undefined) {
      return this.decription(DATA, this.CODEFORBROWSER.PASSWORD);
    } else {
      return undefined;
    }
  }

  clearuniquecodeforbrowser() {
    return this.cookie.delete(this.CODEFORBROWSER.KEY, '/', environment.DOMAIN);
  }
}
