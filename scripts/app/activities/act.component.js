'use strict';

var actCtrl = function (AppServices, $scope, $mdDialog) {
  var grantActivities = this;
  $scope.loading = false;

  AppServices.getGrantAcData()
    .then(function (data) {
      grantActivities.data = data.grantActivities;
    });

  $scope.sortingOptions = {
    'ui-floating': true,
    cursor: 'move',
    cancel: ".unsortable",
    update: function (e, ui) { }
  };

  $scope.addPoint = function (model) {
    model.unshift({ 'edit': true, 'point': '' });
  };

  $scope.deletePoint = function (model, index) {
    if (!model[index].point || model[index].point == '') {
      model.splice(index, 1);
    } else {
      var confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete this activity?')
        .ariaLabel('Delete Activity Confirmation')
        .ok('YES')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function () {
        model.splice(index, 1);
      }, function () { });
    }
  };

  $scope.saveActs = function () {
    $scope.loading = true;
    grantActivities.data.map(function (x) { x.edit = false; return x });
    AppServices.backupData('grantActivities')
      .then(function (backupResponse) {
        if (backupResponse.backup) {
          AppServices.updateData('grantActivities', { 'grantActivities': grantActivities.data })
            .then(function (data) {
              if (data.updated) {
                $mdDialog.show(
                  $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Grant Activities Updated')
                    .ok('OK')
                );
              }
            })
            .finally(function (data) {
              $scope.loading = false;
            });
        }
      });
  };

  $scope.revert = function () {
    var confirm = $mdDialog.confirm()
      .title('Are you sure you want to revert data?')
      .ok('YES')
      .cancel('CANCEL');

    $mdDialog.show(confirm)
      .then(function () {
        $scope.loading = true;
        AppServices.revertData('grantActivities')
          .then(function (revertResp) {
            if (revertResp.revert) {
              AppServices.getGrantAcData()
                .then(function (data) {
                  grantActivities.data = data.grantActivities;
                })
                .finally(function (data) {
                  $mdDialog.show(
                    $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title('Activities Reverted')
                      .ok('OK')
                  );
                  $scope.loading = false;
                });
            }
          });
      }, function () { });
  };
}

angular.module('csel')
  .controller('GrantActivitiesCtrl', ['AppServices', '$scope', '$mdDialog', actCtrl]);
