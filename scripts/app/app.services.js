'use strict';

var appServices = function ($rootScope, $http) {
  return {
    getHomeData: function () {
      return $http.post($rootScope.baseURL + 'data/homeData.json')
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    getPeopleData: function () {
      return $http.post($rootScope.baseURL + 'data/people.json')
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    getResearchData: function () {
      return $http.post($rootScope.baseURL + 'data/researchData.json')
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    getGrantAcData: function () {
      return $http.post($rootScope.baseURL + 'data/grantActivities.json')
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    getPubData: function () {
      return $http.post($rootScope.baseURL + 'data/publicationData.json')
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    getUserData: function (userId) {
      return $http.post($rootScope.baseURL + 'php/getUser.php', {
        'userId': userId
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    deleteUser: function (userId, type) {
      return $http.post($rootScope.baseURL + 'php/deleteUser.php', {
        'userId': userId,
        'type': type
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    getSearchUser: function (searchInput) {
      return $http.post($rootScope.baseURL + 'php/searchUser.php', {
        'search': searchInput
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    login: function (username, password) {
      return $http.post($rootScope.baseURL + 'php/login.php', {
        'username': username,
        'password': password
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    register: function (formData) {
      return $http.post($rootScope.baseURL + 'php/register.php', {
        'data': formData
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    updatePass: function (credentials) {
      return $http.post($rootScope.baseURL + 'php/updatePass.php', {
        'account': credentials
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    resetPass: function (email) {
      return $http.post($rootScope.baseURL + 'php/resetPass.php', {
        'email': email
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    updateStudent: function (studentData) {
      return $http.post($rootScope.baseURL + 'php/updateStudent.php', {
        'data': studentData
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    updateSocial: function (studentData) {
      return $http.post($rootScope.baseURL + 'php/updateSocial.php', {
        'userId': studentData.id,
        'homepage': studentData.homepage,
        'facebook': studentData.facebook,
        'linkedin': studentData.linkedin
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    updateData: function (file, data) {
      return $http.post($rootScope.baseURL + 'php/updateData.php', {
        'file': file,
        'data': data
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    backupData: function (file) {
      return $http.post($rootScope.baseURL + 'php/backupData.php', {
        'file': file
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    revertData: function (file) {
      return $http.post($rootScope.baseURL + 'php/revertData.php', {
        'file': file
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    sendEmail: function (account, email, selected) {
      return $http.post($rootScope.baseURL + 'php/sendEmail.php', {
        'account': account,
        'receivingEmail': email.receivingEmail,
        'selected': selected,
        'from': email.from,
        'cc': email.cc,
        'test': email.test,
        'subject': email.subject,
        'body': email.body
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    },
    downloadData: function (account) {
      return $http.post($rootScope.baseURL + 'php/downloadData.php', {
        'account': account
      })
        .then(function (response) {
          return response.data;
        }, function (response) {
          return response.data;
        });
    }
  }
};

angular.module('csel')
  .factory('AppServices', [
    '$rootScope',
    '$http',
    appServices]);
