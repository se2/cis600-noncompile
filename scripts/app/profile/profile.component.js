'use strict';

var profileCtrl = function (AppServices, $rootScope, $scope, $http, Upload, $mdDialog) {

  $scope.defaultAvatar = "images/noimage.png";
  $scope.loading = false;
  $scope.months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  $scope.defaultForm = {
    avatar: $scope.defaultAvatar,
    type: 'graduate-ms',
    year: "2016",
    school: 'UMass Dartmouth'
  };
  $scope.prefixes = [
    'NONE',
    'Mr.',
    'Mrs.',
    'Ms.',
    'Prof.',
    'Dr.',
    'Chan.',
    'Dean',
    'Sir'
  ];
  // $scope variables
  $scope.isEdit = false;
  $scope.formdata = {};
  $scope.credentials = {};
  $scope.common = {};
  $scope.forms = {};
  $scope.msg = {};
  $scope.users = {};
  $scope.totalUsers = [];
  $scope.selected = [];
  $scope.email = {
    receivingEmail: ($rootScope.account && $rootScope.account.email) ? $rootScope.account.email : 'hxu@umassd.edu',
    from: 'Haiping Xu',
    cc: 'hxu@umassd.edu',
    test: 'hxu@umassd.edu',
    subject: 'CSEL Update',
    body: 'Dear [*FIRST-NAME*] [*LAST-NAME*],'
  };
  $scope.formdata = $scope.defaultForm;

  // check logged-in state
  if (sessionStorage.getItem('csel-account') && sessionStorage.getItem('csel-account') != '') {
    if ($rootScope.isAdmin) {
      $scope.credentials = $rootScope.account;
      if (sessionStorage.getItem('csel-common') && sessionStorage.getItem('csel-common') != '') {
        $scope.common = JSON.parse(sessionStorage.getItem('csel-common'));
      }
      AppServices.getPeopleData()
        .then(function (result) {
          $scope.users.graduate = result.graduate;
          $scope.users.alumni = result.alumni;
          $scope.users.scholar = result.scholar;
          $scope.totalUsers = $scope.users.graduate.concat($scope.users.alumni, $scope.users.scholar);
        });
    }
    $rootScope.loggedIn = true;
  } else {
    $rootScope.loggedIn = false;
  }

  var monthFormat = buildLocaleProvider("MMMM YYYY");
  var ymdFormat = buildLocaleProvider("YYYY-MM-DD");

  function buildLocaleProvider(formatString) {
    return {
      formatDate: function (date) {
        if (date) return moment(date).format(formatString);
        else return null;
      },
      parseDate: function (dateString) {
        if (dateString) {
          var m = moment(dateString, formatString, true);
          return m.isValid() ? m.toDate() : new Date(NaN);
        } else return null;
      }
    };
  }

  // HTML mockup
  // <md-datepicker ng-model="formdata.startDate" md-date-locale="dateFields.locale" md-current-view="year" md-open-on-focus="true"></md-datepicker>
  $scope.dateFields = {
    type: 'date',
    required: false,
    startView: 'month',
    locale: monthFormat
  };

  $scope.range = function (min, max, step) {
    step = step || 1;
    max = max || (new Date()).getFullYear() + 10;
    var input = [];
    for (var i = min; i <= max; i += step) {
      input.push(i);
    }
    return input;
  };

  $scope.resetMsg = function () {
    $scope.msg = {};
  };

  $scope.submit = function (credentials) {
    $scope.formdata.searchInput = '';
    $scope.formdata = $scope.defaultForm;
    $scope.msg = {};
    AppServices.login($scope.credentials.username, $scope.credentials.password)
      .then(function (result) {
        if (result.found) {
          if (result.common && result.common != {}) {
            $scope.common = result.common;
          }
          $rootScope.loggedIn = true;
          $rootScope.account = result.account;
          $scope.credentials = result.account;
          $rootScope.isAdmin = (result.account.role == 'admin') ? true : false;
          $scope.isEdit = false;
          $scope.users.graduate = result.users.graduate;
          $scope.users.alumni = result.users.alumni;
          $scope.users.scholar = result.users.scholar;
          $scope.totalUsers = $scope.users.graduate.concat($scope.users.alumni, $scope.users.scholar);
          sessionStorage.setItem('csel-account', JSON.stringify(result.account));
          sessionStorage.setItem('csel-common', JSON.stringify(result.common));
        } else {
          $rootScope.loggedIn = false;
          $scope.msg.error = "Incorrect username or password!";
        }
      });
  };

  $scope.editUser = function (userId, model) {
    var idx = -1;
    model.some(function (el, i) {
      if (el.id == userId) {
        idx = i;
        return true;
      }
    });
    $scope.formdata = model[idx];
    $scope.isEdit = true;
    // scroll page to top
    $('html').animate({
      scrollTop: 266
    }, 1000);
  };

  $scope.deleteUser = function (userId, type) {
    var confirm = $mdDialog.confirm()
      .title('Are you sure you want to delete this user?')
      .ok('YES')
      .cancel('CANCEL');

    $mdDialog.show(confirm)
      .then(function () {
        $scope.loading = true;
        AppServices.deleteUser(userId, type)
          .then(function (result) { })
          .finally(function (resp) {
            $scope.loading = false;
            AppServices.getPeopleData()
              .then(function (result) {
                $scope.users[type] = result[type];
              });
          });
      }, function () { });

  };

  $scope.backToList = function () {
    $scope.msg = {};
    $scope.formdata = {
      avatar: $scope.defaultAvatar,
      type: 'graduate-ms',
      year: "2016",
      school: 'UMass Dartmouth'
    };
    $scope.isEdit = false;
    // scroll page to top
    $('html').animate({
      scrollTop: 266
    }, 1000);
  };

  $scope.register = function () {
    $scope.loading = true;
    $scope.formdata.avatar = $scope.defaultAvatar;
    $scope.formdata.firstlast = $scope.formdata.firstname + ' ' + $scope.formdata.lastname;
    $scope.formdata.prefix = ($scope.formdata.prefix == 'NONE') ? '' : $scope.formdata.prefix;
    if ($scope.formdata.middlename && $scope.formdata.middlename != '') {
      $scope.formdata.fullname = $scope.formdata.firstname + ' ' + $scope.formdata.middlename + '. ' + $scope.formdata.lastname;
    } else {
      $scope.formdata.fullname = $scope.formdata.firstname + ' ' + $scope.formdata.lastname;
    }
    if ($scope.formdata.type == 'scholar') {
      $scope.formdata.year = '';
    }
    AppServices.register($scope.formdata)
      .then(function (result) {
        if (Object.keys(result).length > 0) {
          // update current users list
          if (result.type == 'graduate-ms' || result.type == 'graduate-phd') {
            $scope.users.graduate.push(result);
          } else {
            $scope.users[result.type].push(result);
          }
          // reset form data
          $scope.formdata = {
            avatar: $scope.defaultAvatar,
            type: 'graduate-ms',
            year: "2016",
            school: 'UMass Dartmouth'
          };
          $scope.forms.registerForm.$setPristine();
          $scope.forms.registerForm.$setUntouched();
          $scope.msg = {};
          $scope.msg.successRegister = 'Registered Successfully';
        } else {
          $scope.msg = {};
          $scope.msg.errorRegister = 'Email already exists!';
        }
      })
      .finally(function (data) {
        $scope.loading = false;
      });
  };

  $scope.changeAvatar = function () {
    if ($scope.forms.avatarForm.file.$valid && $scope.formdata.file) {
      $scope.upload($scope.formdata.file);
    }
  };

  $scope.upload = function (file) {
    $scope.msg = {};
    Upload.upload({
      url: $rootScope.baseURL + 'php/changeAvatar.php',
      data: { file: file, 'userId': $scope.formdata.id, 'type': $scope.formdata.type }
    })
      .then(function (resp) {
        if (resp.data.uploaded) {
          console.log('Success ' + resp.config.data.file.name + ' uploaded.');
          $scope.formdata.file = '';
          $scope.formdata.avatar = resp.data.user.avatar;
        } else {
          $scope.msg.uploadProgress = '';
          $scope.msg.uploadFail = 'Upload Failed. Please try another.'
        }
      }, function (resp) {
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $scope.msg.uploadFail = '';
        $scope.msg.uploadProgress = progressPercentage;
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
  };

  $scope.studentSubmit = function () {
    $scope.loading = true;
    $scope.formdata.firstlast = $scope.formdata.firstname + ' ' + $scope.formdata.lastname;
    $scope.formdata.prefix = ($scope.formdata.prefix == 'NONE') ? '' : $scope.formdata.prefix;
    if ($scope.formdata.middlename && $scope.formdata.middlename != '') {
      $scope.formdata.fullname = $scope.formdata.firstname + ' ' + $scope.formdata.middlename + '. ' + $scope.formdata.lastname;
    } else {
      $scope.formdata.fullname = $scope.formdata.firstname + ' ' + $scope.formdata.lastname;
    }
    if ($scope.formdata.type == 'scholar') {
      $scope.formdata.year = '';
    }
    if ($scope.formdata.type == 'graduate-ms' || $scope.formdata.type == 'graduate-phd') {
      $scope.formdata.state = $scope.formdata.country = '';
    }
    if ($scope.formdata.startMonth && $scope.formdata.startYear) {
      $scope.formdata.startDate = $scope.formdata.startMonth + ' ' + $scope.formdata.startYear;
    } else {
      $scope.formdata.startDate = '';
    }
    if ($scope.formdata.endMonth && $scope.formdata.endYear) {
      $scope.formdata.endDate = $scope.formdata.endMonth + ' ' + $scope.formdata.endYear;
    } else {
      $scope.formdata.endDate = '';
    }
    AppServices.updateStudent($scope.formdata)
      .then(function (result) {
        if (result.updated) {
          if ($rootScope.isAdmin) {
            AppServices.getPeopleData()
              .then(function (result) {
                $scope.users.graduate = result.graduate;
                $scope.users.alumni = result.alumni;
                $scope.users.scholar = result.scholar;
              });
          }
          $scope.msg.successUpdate = 'Information updated';
        }
      })
      .finally(function (data) {
        $scope.loading = false;
      });
  };

  $scope.socialSubmit = function () {
    AppServices.updateSocial($scope.formdata)
      .then(function (result) {
        if (result.updated) {
          $scope.msg.successSocial = 'Social profiles updated';
        }
      });
  };

  $scope.updatePassword = function (credentials) {
    if ($scope.credentials.newPassword == $scope.credentials.confirmPassword) {
      AppServices.updatePass($scope.credentials)
        .then(function (result) {
          if (result.updated) {
            delete result.account.hashed;
            $scope.credentials = $rootScope.account = result.account;
            sessionStorage.setItem('csel-account', JSON.stringify($scope.credentials));
            $scope.msg.errorUpdatePass = '';
            $scope.msg.successUpdatePass = 'Account updated';
            $scope.forms.updatePasswordForm.$setPristine();
            $scope.forms.updatePasswordForm.$setUntouched();
          } else {
            $scope.credentials = $rootScope.account;
            $scope.msg.successUpdatePass = '';
            $scope.msg.errorUpdatePass = result.error;
          }
        });
    } else {
      $scope.msg.errorUpdatePass = "Confirm password mismatch.";
    }
  };

  $scope.updateCommonPassword = function (common) {
    if ($scope.common.newPassword == $scope.common.confirmPassword) {
      AppServices.updatePass($scope.common)
        .then(function (result) {
          if (result.updated) {
            delete result.account.hashed;
            $scope.common = result.account;
            sessionStorage.setItem('csel-common', JSON.stringify($scope.common));
            $scope.msg.errorUpdateCommonPass = '';
            $scope.msg.successUpdateCommonPass = 'Account updated';
            $scope.forms.updateCommonPasswordForm.$setPristine();
            $scope.forms.updateCommonPasswordForm.$setUntouched();
          } else {
            $scope.msg.successUpdateCommonPass = '';
            $scope.msg.errorUpdateCommonPass = result.error;
          }
        });
    } else {
      $scope.msg.errorUpdateCommonPass = "Confirm password mismatch.";
    }
  };

  $scope.searchUser = function () {
    if (!$rootScope.isAdmin) {
      AppServices.getSearchUser($scope.formdata.searchInput.toLowerCase())
        .then(function (result) {
          $scope.msg = {};
          $scope.users.graduate = [];
          $scope.users.alumni = [];
          $scope.users.scholar = [];
          if (result.length == 0) {
            $scope.msg.searchNotFound = 'User Not Found. Please Register!';
          } else if (result.length == 1) {
            result.forEach(element => {
              if (element.type == 'graduate-ms' || element.type == 'graduate-phd') {
                $scope.users.graduate.push(element);
              } else {
                $scope.users[element.type].push(element);
              }
            });
          } else if (result.length > 1) {
            $scope.msg.searchNotFound = 'Please Provide Full Name';
          }
        });
    }
  };

  $scope.logout = function () {
    $rootScope.loggedIn = false;
    $rootScope.isAdmin = false;
    $rootScope.isEdit = false;
    // reset formdata
    $scope.formdata = $scope.defaultForm;
    $scope.credentials.username = {};
    $scope.common = {};
    $scope.users = {};
    $scope.totalUsers = [];
    $scope.selected = [];
    // reset messages
    $scope.msg = {};
    // reset sessionStorage
    sessionStorage.removeItem('csel-account');
    sessionStorage.removeItem('csel-common');
  };

  $scope.sendTestEmailForm = function (email) {
    if ($scope.email.body && $scope.email.body != '') {
      $scope.msg = {};
      AppServices.sendEmail($rootScope.account, $scope.email, $scope.selected)
        .then(function (resp) {
          if (resp.sent) {
            $scope.email.receivingEmail = $rootScope.account.email = (resp.email) ? resp.email : 'hxu@umassd.edu';
            sessionStorage.setItem('csel-account', JSON.stringify($rootScope.account));
            $scope.msg = {};
            $scope.msg.successSentEmail = 'Email Sent';
          }
        })
        .finally(function (resp) {
          $scope.loading = false;
        });
    } else {
      $scope.msg.errorNoEmail = 'Empty Message';
    }
  };

  $scope.sendEmailForm = function (email) {
    if ($scope.selected.length && $scope.selected.length > 0) {
      if ($scope.email.body && $scope.email.body != '') {
        $scope.msg = {};
        var confirm = $mdDialog.confirm()
          .title('Sending email to ' + $scope.selected.length + ' ' + (($scope.selected.length == 1) ? 'person' : 'people') + '?')
          .ok('YES')
          .cancel('CANCEL');

        $mdDialog.show(confirm).then(function () {
          $scope.loading = true;
          $scope.email.test = '';
          AppServices.sendEmail($rootScope.account, $scope.email, $scope.selected)
            .then(function (resp) {
              if (resp.sent) {
                $scope.email.receivingEmail = $rootScope.account.email = (resp.email) ? resp.email : 'hxu@umassd.edu';
                sessionStorage.setItem('csel-account', JSON.stringify($rootScope.account));
                $scope.msg = {};
                $scope.msg.successSentEmail = 'Email Sent';
              }
            })
            .finally(function (resp) {
              $scope.loading = false;
            });
        }, function () { });
      } else {
        $scope.msg.errorNoEmail = 'Empty Message';
      }
    } else {
      $scope.msg.errorNoEmail = 'No Recipients To Send';
    }
  };

  $scope.download = function () {
    $scope.loading = true;
    AppServices.downloadData($rootScope.account)
      .then(function (resp) {
        if (resp.download) {
          $scope.msg.downloadFile = resp.file;
          window.location = $rootScope.baseURL + resp.file;
        }
      })
      .finally(function (resp) {
        $scope.loading = false;
      });
  };

  $scope.tinymceOptions = {
    height: 450,
    inline: false,
    skin: 'lightgray',
    theme: 'modern',
    plugins: "textcolor link image colorpicker preview insertdatetime",
    menubar: 'file edit view insert format',
    toolbar: 'fontselect undo redo | styleselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image insertdatetime | preview'
  };

  $scope.tinymceOptionsBio = {
    height: 300,
    inline: false,
    skin: 'lightgray',
    theme: 'modern',
    plugins: "textcolor link image colorpicker preview insertdatetime code",
    menubar: "file edit view insert format",
    toolbar: 'fontselect undo redo | styleselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image insertdatetime | preview code'
  };

  // email users list checkboxes functions
  $scope.toggle = function (item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    }
    else {
      list.push(item);
    }
  };

  $scope.exists = function (item, list) {
    return list.indexOf(item) > -1;
  };

  $scope.isIndeterminate = function () {
    return ($scope.selected.length !== 0 &&
      $scope.selected.length !== $scope.totalUsers.length);
  };

  $scope.isChecked = function () {
    return ($scope.selected.length !== 0) && ($scope.selected.length === $scope.totalUsers.length);
  };

  $scope.isCheckedSub = function (model) {
    return model ? $scope.arrayContainsArray($scope.selected, model) : false;
  };

  $scope.toggleAll = function () {
    if ($scope.selected.length === $scope.totalUsers.length && $scope.selected.length > 0) {
      $scope.selected = [];
    } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
      $scope.selected = $scope.totalUsers.slice(0);
    }
  };

  $scope.toggleAllSub = function (model) {
    if ($scope.arrayContainsArray($scope.selected, model)) {
      $scope.selected = $scope.selected.filter(function (el) {
        return !model.includes(el);
      });
    } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
      $scope.selected = $scope.selected.concat(model);
    }
  };

  $scope.arrayContainsArray = function (superset, subset) {
    if (0 === subset.length) {
      return false;
    }
    return subset.every(function (value) {
      return (superset.indexOf(value) >= 0);
    });
  }
}

angular.module('csel')
  .controller('ProfileCtrl', [
    'AppServices',
    '$rootScope',
    '$scope',
    '$http',
    'Upload',
    '$mdDialog',
    profileCtrl
  ]);
