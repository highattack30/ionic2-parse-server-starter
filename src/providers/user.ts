import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {ParsePushProvider} from './parse-push';
import {IonicUtilProvider} from './ionic-util';
declare var Parse: any;

@Injectable()
export class UserProvider {

  private _fields          = [
    'name',
    'username',
    'status',
    'gender',
    'email',
    'photo',
    'photoThumb',
  ];
  private _ParseObject     = Parse.User.extend({});
          cordova: boolean = false;

  constructor(private ParsePush: ParsePushProvider,
              private util: IonicUtilProvider,
              private Storage: Storage) {
    this.cordova = this.util.cordova;

    this._fields.map(field => {
      Object.defineProperty(this._ParseObject.prototype, field, {
        get: function () {
          return this.get(field);
        },
        set: function (value) {
          this.set(field, value);
        }
      });
    });

    // This is a GeoPoint Object
    Object.defineProperty(this._ParseObject.prototype, 'location', {
      get: function () {
        return this.get('location');
      },
      set: function (val) {
        this.set('location', new Parse.GeoPoint({
          latitude:  val.latitude,
          longitude: val.longitude
        }));
      }
    });
  }

  current(): any {
    return Parse.User.current();
  }

  fetch() {
    return new Promise((resolve, reject) => {
      if (Parse.User.current()) {
        Parse.User.current().fetch().then(resolve, reject);
      } else {
        reject();
      }
    });
  }


  update(form) {
    let user = Parse.User.current();
    Object.keys(form).map(field => user.set(field, form[field]));
    return user.save();
  }

  updatePhoto(parseFile) {
    let user = Parse.User.current();
    user.set('photo', parseFile);
    return user.save();
  }

  recoverPassword(email: string) {
    return Parse.User.requestPasswordReset(email);
  }

  getProfile(username: string) {
    return Parse.Cloud.run('profile', {username: username});
  }

  logout(): void {
    Parse.User.logOut();
  }

  updateWithFacebookData() {
    return Parse.Cloud.run('saveFacebookPicture');
  }

  facebookSyncProfile(fbData: any) {
    let currentUser = Parse.User.current();

    if (!currentUser.get('facebook') && fbData.id) {
      currentUser.set('facebook', fbData.id);
    }

    if (!currentUser.get('email') && fbData.email) {
      currentUser.set('email', fbData.email);
    }

    if (!currentUser.get('name') && fbData.name) {
      currentUser.set('name', fbData.name);
    }

    if (!currentUser.get('gender') && fbData.gender) {
      currentUser.set('gender', fbData.gender);
    }

    if (!currentUser.get('birthdate') && fbData.birthday) {
      currentUser.set('birthdate', new Date(fbData.birthday));
    }

    return currentUser.save();
  }

  signUp(data) {
    let user = new Parse.User();
    user.set('name', data.name);
    user.set('username', data.username);
    user.set('email', data.email);
    user.set('password', data.password);
    return user.signUp(null);

  }

  signIn(obj) {
    return new Promise((resolve, reject) => {
      Parse.User.logIn(obj.username, obj.password).then(currentUser => {
        console.log('logIn', currentUser);

        if (this.cordova) {
          // Parse Push
          this.ParsePush.init();
        }
        resolve(currentUser);

      }, reject);
    });
  }

  setStorage(user: any): void {
    let obj = {
      id:       user.id,
      name:     user.get('name'),
      username: user.get('username'),
      email:    user.get('email'),
      gender:   user.get('gender'),
      photo:    user.get('photo'),
      status:   user.get('status'),
    };
    console.log(obj);
    this.Storage.set('user', obj);
  }

  getStorage(): Promise<any> {
    return this.Storage.get('user');
  }

  changePassword(password: string) {
    return Parse.Cloud.run('changePassword', {password: password});
  }

  destroy(data) {
    return Parse.Cloud.run('destroyUser', data);
  }

  validateEmail(input: string) {
    return Parse.Cloud.run('validateEmail', {email: input});
  }

  validateUsername(input: string) {
    return Parse.Cloud.run('validateUsername', {username: input});
  }


}
