'use strict';

var researchCtrl = function (AppServices, $scope, $mdDialog) {
  var research = this;
  $scope.loading = false;

  // Get the json data from the service($http)
  AppServices.getResearchData()
    .then(function (data) {
      research.gradStudents = data.research.gradStudents;
      research.visitingScholar = data.research.visitingScholar;
      research.alumni = data.research.alumni;
    });

  $scope.sortingOptionsResearch = {
    'ui-floating': true,
    connectWith: ['.grad-project', '.grad-thesis', '.grad-phd', '.visit-scholar', '.alumni-project', '.alumni-thesis', '.alumni-phd'],
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
        .title('Are you sure you want to delete this research?')
        .ariaLabel('Delete Research Confirmation')
        .ok('YES')
        .cancel('CANCEL');

      $mdDialog.show(confirm).then(function () {
        model.splice(index, 1);
      }, function () { });
    }
  };

  $scope.saveResearch = function () {
    $scope.loading = true;
    var models = [
      research.gradStudents.mastersThesis,
      research.gradStudents.mastersProject,
      research.gradStudents.phdDissertation,
      research.alumni.mastersThesis,
      research.alumni.mastersProject,
      research.alumni.phdDissertation,
      research.visitingScholar
    ];
    models.forEach(function (element) {
      element.map(function (x) { x.edit = false; return x });
    }, this);
    AppServices.backupData('researchData')
      .then(function (backupResp) {
        if (backupResp.backup) {
          AppServices.updateData('researchData', { 'research': research })
            .then(function (data) {
              if (data.updated) {
                $mdDialog.show(
                  $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Research Updated')
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
        AppServices.revertData('researchData')
          .then(function (revertResp) {
            if (revertResp.revert) {
              AppServices.getResearchData()
                .then(function (data) {
                  research.gradStudents = data.research.gradStudents;
                  research.visitingScholar = data.research.visitingScholar;
                  research.alumni = data.research.alumni;
                })
                .finally(function (data) {
                  $mdDialog.show(
                    $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title('Research Reverted')
                      .ok('OK')
                  );
                  $scope.loading = false;
                });
            }
          });
      }, function () { });
  };

  /*-- Scroll to link --*/
  $('.scroller-link').click(function (e) {
    e.preventDefault(); //Don't automatically jump to the link
    var id;
    id = $(this).attr('href').replace('#', ''); //Extract the id of the element to jump to
    $('html,body').animate({
      scrollTop: $("#" + id).offset().top - 40
    }, 'normal');
  });

  $('.parent-link').click(function (e) {
    e.preventDefault();
    $(this).find('.material-icons').toggleClass('down');
    $(this).next('.subUL').toggleClass('subUL-open');
  });
}

angular.module('csel')
  .controller('ResearchCtrl', ['AppServices', '$scope', '$mdDialog', researchCtrl])
