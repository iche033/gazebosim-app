import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { User, UserComponent, UserService } from '../user';
import { Organization, OrganizationComponent } from '../organization';

@Injectable()

/**
 * Resolver for the /profile/:name route.
 *
 * Fetches the corresponding User or Organization, along with it's type to disambiguate them.
 * As they require different components to display, the Component information is also returned.
 */
export class OwnerProfileResolver implements Resolve<any> {

  /**
   * @param userService Service used to get the Owner profile information from the Server.
   */
  constructor(private userService: UserService) {
  }

  /**
   * Resolve method.
   *
   * The user or organization obtained is stored in the route's data, along with the corresponding
   * Component. They can be accessed using the router's ActivatedRoute.
   *
   * @param route A snapshot of the activated route.
   * @returns An observable of the result or an observable of null if it couldn't be fetched.
   */
  public resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const user: string = route.paramMap.get('name');

    return this.userService.getProfile(user)
      .map(
        (response) => {
          // Check if the result is a User or an Organization.
          if (response['OwnerType'] === 'users') {
            return {
              data: new User(response['User']),
              component: UserComponent
            };
          } else if (response['OwnerType'] === 'organizations') {
            return {
              data: new Organization(response['Org']),
              component: OrganizationComponent
            };
          }
        })
      .catch(
        (err) => {
          return Observable.of(null);
        });
  }
}
