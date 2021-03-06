angular.module('admin-users', ['admin-users-edit', 'services.crud', 'services.i18nNotifications'])

.config(['crudRouteProvider', function (crudRouteProvider) {

  var adminUser =  ['authentication', function(authentication) {
    return authentication.requireAdminUser();
  }];

  crudRouteProvider.routesFor('Users', 'admin')
    .whenList({
      users: ['Users', function(Users) { return Users.all(); }],
      currentUser: adminUser
    })
    .whenNew({
      user: ['Users', function(Users) { return new Users(); }],
      currentUser: adminUser
    })
    .whenEdit({
      user:['$route', 'Users', function ($route, Users) {
        return Users.getById($route.current.params.itemId);
      }],
      currentUser: adminUser
    });
}])

.controller('UsersListCtrl', ['$scope', 'crudListMethods', 'users', 'i18nNotifications', function ($scope, crudListMethods, users, i18nNotifications) {
  $scope.users = users;

  angular.extend($scope, crudListMethods('/admin/users'));

  $scope.remove = function(user, $index, $event) {
    // Don't let the click bubble up to the ng-click on the enclosing div, which will try to trigger
    // an edit of this item.
    $event.stopPropagation();

    // Remove this user
    user.$remove(function() {
      // It is gone from the DB so we can remove it from the local list too
      $scope.users.splice($index,1);
      i18nNotifications.pushForCurrentRoute('crud.user.remove.success', 'success', {id : user.$id()});
    }, function() {
      i18nNotifications.pushForCurrentRoute('crud.user.remove.error', 'error', {id : user.$id()});
    });
  };
}]);