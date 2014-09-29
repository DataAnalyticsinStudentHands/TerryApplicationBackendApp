/*global angular, console*/

/**
 * @ngdoc function
 * @name myapplication.controller:MyApplicationController
 * @description
 * # MyApplicationController
 * Controller for the terry
 */
angular.module('TerryControllers').controller('MyApplicationController', function ($scope, Restangular, ngNotify, $stateParams, $state, $filter, $ionicSideMenuDelegate, $ionicModal, $ionicPopup, MyApplicationService, MyCourseworkService, MyUniversityService, MyScholarshipService, MyChildService) {
    'use strict';

    $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.myVariables = {
        current_mode: 'Add',
    };

    $scope.myapplication = {};
    $scope.myscholarships = {};
    $scope.myscholarship = {};
    $scope.myuniversity = {};
    $scope.mynewuniversity = {};
    $scope.mychildren = {};
    $scope.mychild = {};

    // GET 
    MyApplicationService.getMyApplication($stateParams.applicationId).then(
        function (result) {
            if ($stateParams.applicationId !== "") {
                $scope.myapplication = result;
                if ($scope.myapplication.state !== undefined && $scope.myapplication.state !== null) {
                    $scope.test = $filter('filter')($scope.states, {
                        name: $scope.myapplication.state
                    }, true);
                    $scope.myVariables.myState = $scope.test[0];
                } else {
                    $scope.myVariables.myState = $scope.states[50];
                }
            }
        },
        function (error) {
            if (error.status === 0) {
                ngNotify.set("Internet or Server unavailable.", {
                    type: "error",
                    sticky: true
                });
            } else {
                ngNotify.set("Something went wrong retrieving data.", {
                    type: "error",
                    sticky: true
                });
            }
        }
    );

    // GET 
    MyUniversityService.getAllUniversity().then(
        function (result) {
            $scope.myuniversities = result;
        },
        function (error) {
            ngNotify.set("Something went wrong retrieving data.", {
                type: "error",
                sticky: true
            });
        }
    );

    // GET 
    MyScholarshipService.getAllScholarship().then(
        function (result) {
            $scope.myscholarships = result;
        },
        function (error) {
            ngNotify.set("Something went wrong retrieving data.", {
                type: "error",
                sticky: true
            });
        }
    );

    // GET 
    MyChildService.getAllChild().then(
        function (result) {
            $scope.mychildren = result;
        },
        function (error) {
            ngNotify.set("Something went wrong retrieving data.", {
                type: "error",
                sticky: true
            });
        }
    );

    // Open a popup to add data
    $scope.showAddData = function () {
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="mynewuniversity.name">',
            title: 'Name University',
            subTitle: 'You can reorder the list later',
            scope: $scope,
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.mynewuniversity.name) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            $scope.mynewuniversity.application_id = $stateParams.applicationId;
                            MyUniversityService.addUniversity($scope.mynewuniversity);
                            $scope.updateList('university');
                        }
                    }
                }
            ]
        });
    };

    // Open a popup to edit data
    $scope.editData = function (acType, item) {
        switch (acType) {
        case 'university':
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="mynewuniversity.name">',
                title: 'Name University',
                subTitle: 'You can reorder the list later',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel'
                },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.mynewuniversity.name) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                $scope.mynewuniversity.application_id = $stateParams.applicationId;
                                MyUniversityService.updateUniversity($scope.mynewuniversity.id, $scope.mynewuniversity);
                                $scope.updateList();
                            }
                        }
                }
            ]
            });
            break;
        case 'scholarship':
            $scope.myVariables.current_mode = "Edit";
            $scope.myscholarship = item;
            $scope.modal.show();
            break;
        }
    };

    $scope.updateList = function (acType) {
        switch (acType) {
        case 'university':
            // GET 
            MyUniversityService.getAllUniversity().then(
                function (result) {
                    $scope.myuniversities = result;
                },
                function (error) {
                    ngNotify.set("Something went wrong retrieving data.", {
                        type: "error",
                        sticky: true
                    });
                }
            );
            break;
        case 'scholarship':
            // GET 
            MyScholarshipService.getAllScholarship().then(
                function (result) {
                    $scope.myscholarships = result;
                },
                function (error) {
                    ngNotify.set("Something went wrong retrieving data.", {
                        type: "error",
                        sticky: true
                    });
                }
            );
            break;
        case 'children':
            // GET 
            MyChildService.getAllChild().then(
                function (result) {
                    $scope.mychildren = result;
                },
                function (error) {
                    ngNotify.set("Something went wrong retrieving data.", {
                        type: "error",
                        sticky: true
                    });
                }
            );
        }
    };

    // callback for ng-click 'modal'- open Modal dialog
    $ionicModal.fromTemplateUrl('templates/modal_scholarship.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // callback for ng-click 'modal'- open Modal dialog
    $ionicModal.fromTemplateUrl('templates/modal_child.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal1 = modal;
    });

    // Open a modal
    $scope.showAddModal = function (type) {

        $scope.myVariables.current_mode = "Add";

        switch (type) {
        case 1:
            $scope.myscholarship = {};
            $scope.myscholarship.applied_received = 'true';
            $scope.modal.show();
            break;
        case 2:
            $scope.myscholarship = {};
            $scope.myscholarship.applied_received = 'false';
            $scope.modal.show();
            break;
        case 3:
            $scope.mychild = {};
            $scope.modal1.show();
            break;
        }


    };

    // callback for ng-click 'saveModal':
    $scope.saveModal = function () {

        if ($scope.modal.isShown === 'true') {
            $scope.myscholarship.application_id = $stateParams.applicationId;

            if ($scope.myVariables.current_mode === 'Add') {
                MyScholarshipService.addScholarship($scope.myscholarship).then(
                    function (success) {
                        $scope.updateList('scholarship');
                        $scope.modal.hide();
                    }
                );
            } else {
                MyScholarshipService.updateScholarship($scope.myscholarship.id, $scope.myscholarship).then(
                    function (success) {
                        $scope.updateList('scholarship');
                        $scope.modal.hide();
                    }
                );
            }
        } else {
            $scope.mychild.application_id = $stateParams.applicationId;

            if ($scope.myVariables.current_mode === 'Add') {
                MyChildService.addChild($scope.mychild).then(
                    function (success) {
                        $scope.updateList('children');
                        $scope.modal1.hide();
                    }
                );
            } else {
                MyChildService.updateChild($scope.mychild.id, $scope.mychild).then(
                    function (success) {
                        $scope.updateList('children');
                        $scope.modal1.hide();
                    }
                );
            }
        }
    };

    // callback for ng-click 'deleteData':
    $scope.deleteData = function (acType, itemId) {

        switch (acType) {
        case 'university':
            MyUniversityService.deleteUniversity(itemId).then(
                function (success) {
                    $scope.updateList(acType);
                }
            );
            break;
        case 'scholarship':
            MyScholarshipService.deleteScholarship(itemId).then(
                function (success) {
                    $scope.updateList(acType);
                }
            );
            break;
        case 'children':
            MyChildService.deleteChild(itemId).then(
                function (success) {
                    $scope.updateList(acType);
                }
            );
            break;
        }
    };

    $scope.pickedDates = {};

    $scope.$watch('pickedDates.birthDate', function (unformattedDate) {
        $scope.myapplication.dob = $filter('date')(unformattedDate, 'dd/MM/yyyy');
    });

    $scope.$watch('pickedDates.gradDate', function (unformattedDate) {
        $scope.myapplication.highschool_graduation_date = $filter('date')(unformattedDate, 'dd/MM/yyyy');
    });

    $scope.$watch('pickedDates.psatDate', function (unformattedDate) {
        $scope.myapplication.psat_date = $filter('date')(unformattedDate, 'dd/MM/yyyy');
    });

    $scope.$watch('pickedDates.satDate', function (unformattedDate) {
        $scope.myapplication.sat_date = $filter('date')(unformattedDate, 'dd/MM/yyyy');
    });

    $scope.$watch('pickedDates.actDate', function (unformattedDate) {
        $scope.myapplication.act_date = $filter('date')(unformattedDate, 'dd/MM/yyyy');
    });

    $scope.$watch('pickedDates.national_merit_date', function (unformattedDate) {
        $scope.myapplication.national_merit_date = $filter('date')(unformattedDate, 'dd/MM/yyyy');
    });

    $scope.$watch('pickedDates.national_achievement_date', function (unformattedDate) {
        $scope.myapplication.national_achievement_date = $filter('date')(unformattedDate, 'dd/MM/yyyy');
    });

    $scope.$watch('pickedDates.national_hispanic_date', function (unformattedDate) {
        $scope.myapplication.national_hispanic_date = $filter('date')(unformattedDate, 'dd/MM/yyyy');
    });

    $scope.openDOBPicker = function () {
        $scope.tmp = {};
        $scope.tmp.newDate = $scope.pickedDates.birthDate;

        var birthDatePopup = $ionicPopup.show({
            template: '<datetimepicker data-ng-model="tmp.newDate"></datetimepicker>',
            title: "Birth date",
            scope: $scope,
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        $scope.pickedDates.birthDate = $scope.tmp.newDate;
                    }
                }
            ]
        });
    };

    $scope.openTestDatePicker = function (testvar) {
        $scope.tmp = {};
        $scope.tmp.newDate = $scope.pickedDates.birthDate;

        var birthDatePopup = $ionicPopup.show({
            template: '<datetimepicker data-ng-model="tmp.newDate"></datetimepicker>',
            title: "Date of Test",
            scope: $scope,
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        switch (testvar) {
                        case 1:
                            $scope.pickedDates.gradDate = $scope.tmp.newDate;
                            break;
                        case 2:
                            $scope.pickedDates.psatDate = $scope.tmp.newDate;
                            break;
                        case 3:
                            $scope.pickedDates.satDate = $scope.tmp.newDate;
                            break;
                        case 4:
                            $scope.pickedDates.actDate = $scope.tmp.newDate;
                            break;
                        case 5:
                            $scope.pickedDates.national_merit_date = $scope.tmp.newDate;
                            break;
                        case 6:
                            $scope.pickedDates.national_achievement_date = $scope.tmp.newDate;
                            break;
                        case 7:
                            $scope.pickedDates.national_hispanic_date = $scope.tmp.newDate;
                            break;
                        default:
                            //need to define a default
                        }
                    }
                }
            ]
        });
    };

    // callback for ng-submit 'save': save application updates to server
    $scope.save = function (nextstate) {
        $scope.myapplication.state = $scope.myVariables.myState.name;

        MyApplicationService.updateMyApplication($scope.myapplication.id, $scope.myapplication).then(
            function (result) {
                ngNotify.set("Saved to server.", {
                    position: 'bottom',
                    type: 'success'
                });
                //if succesful => send to next page
                $state.go(nextstate);
            },
            function (error) {
                ngNotify.set("Could not contact server to save application!", {
                    position: 'bottom',
                    type: 'error'
                });

            }
        );
    };

    $scope.states = [
        {
            "name": "Alabama",
            "abbreviation": "AL"
        },
        {
            "name": "Alaska",
            "abbreviation": "AK"
        },
        {
            "name": "American Samoa",
            "abbreviation": "AS"
        },
        {
            "name": "Arizona",
            "abbreviation": "AZ"
        },
        {
            "name": "Arkansas",
            "abbreviation": "AR"
        },
        {
            "name": "California",
            "abbreviation": "CA"
        },
        {
            "name": "Colorado",
            "abbreviation": "CO"
        },
        {
            "name": "Connecticut",
            "abbreviation": "CT"
        },
        {
            "name": "Delaware",
            "abbreviation": "DE"
        },
        {
            "name": "District Of Columbia",
            "abbreviation": "DC"
        },
        {
            "name": "Federated States Of Micronesia",
            "abbreviation": "FM"
        },
        {
            "name": "Florida",
            "abbreviation": "FL"
        },
        {
            "name": "Georgia",
            "abbreviation": "GA"
        },
        {
            "name": "Guam",
            "abbreviation": "GU"
        },
        {
            "name": "Hawaii",
            "abbreviation": "HI"
        },
        {
            "name": "Idaho",
            "abbreviation": "ID"
        },
        {
            "name": "Illinois",
            "abbreviation": "IL"
        },
        {
            "name": "Indiana",
            "abbreviation": "IN"
        },
        {
            "name": "Iowa",
            "abbreviation": "IA"
        },
        {
            "name": "Kansas",
            "abbreviation": "KS"
        },
        {
            "name": "Kentucky",
            "abbreviation": "KY"
        },
        {
            "name": "Louisiana",
            "abbreviation": "LA"
        },
        {
            "name": "Maine",
            "abbreviation": "ME"
        },
        {
            "name": "Marshall Islands",
            "abbreviation": "MH"
        },
        {
            "name": "Maryland",
            "abbreviation": "MD"
        },
        {
            "name": "Massachusetts",
            "abbreviation": "MA"
        },
        {
            "name": "Michigan",
            "abbreviation": "MI"
        },
        {
            "name": "Minnesota",
            "abbreviation": "MN"
        },
        {
            "name": "Mississippi",
            "abbreviation": "MS"
        },
        {
            "name": "Missouri",
            "abbreviation": "MO"
        },
        {
            "name": "Montana",
            "abbreviation": "MT"
        },
        {
            "name": "Nebraska",
            "abbreviation": "NE"
        },
        {
            "name": "Nevada",
            "abbreviation": "NV"
        },
        {
            "name": "New Hampshire",
            "abbreviation": "NH"
        },
        {
            "name": "New Jersey",
            "abbreviation": "NJ"
        },
        {
            "name": "New Mexico",
            "abbreviation": "NM"
        },
        {
            "name": "New York",
            "abbreviation": "NY"
        },
        {
            "name": "North Carolina",
            "abbreviation": "NC"
        },
        {
            "name": "North Dakota",
            "abbreviation": "ND"
        },
        {
            "name": "Northern Mariana Islands",
            "abbreviation": "MP"
        },
        {
            "name": "Ohio",
            "abbreviation": "OH"
        },
        {
            "name": "Oklahoma",
            "abbreviation": "OK"
        },
        {
            "name": "Oregon",
            "abbreviation": "OR"
        },
        {
            "name": "Palau",
            "abbreviation": "PW"
        },
        {
            "name": "Pennsylvania",
            "abbreviation": "PA"
        },
        {
            "name": "Puerto Rico",
            "abbreviation": "PR"
        },
        {
            "name": "Rhode Island",
            "abbreviation": "RI"
        },
        {
            "name": "South Carolina",
            "abbreviation": "SC"
        },
        {
            "name": "South Dakota",
            "abbreviation": "SD"
        },
        {
            "name": "Tennessee",
            "abbreviation": "TN"
        },
        {
            "name": "Texas",
            "abbreviation": "TX"
        },
        {
            "name": "Utah",
            "abbreviation": "UT"
        },
        {
            "name": "Vermont",
            "abbreviation": "VT"
        },
        {
            "name": "Virgin Islands",
            "abbreviation": "VI"
        },
        {
            "name": "Virginia",
            "abbreviation": "VA"
        },
        {
            "name": "Washington",
            "abbreviation": "WA"
        },
        {
            "name": "West Virginia",
            "abbreviation": "WV"
        },
        {
            "name": "Wisconsin",
            "abbreviation": "WI"
        },
        {
            "name": "Wyoming",
            "abbreviation": "WY"
        }
    ];


});