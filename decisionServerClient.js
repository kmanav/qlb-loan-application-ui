
angular.module('demo', [])
.controller('kie-server-info', function($scope, $http) {

    $http.get('http://localhost:8080/kie-server/services/rest/server', {
        headers: {'accept' : 'application/json', 'content-type' : 'application/json' ,'Authorization': 'Basic ' + btoa('dsUser:dsUser1!') }
    }).
        then(function(response) {
            
            $scope.greeting = response.data;
            $scope.info = $scope.greeting.result["kie-server-info"];
            console.log($scope.result);
        });
})


.controller('fire-loan-rules', function($scope, $http) {

    $scope.applicationResult = "";
    $scope.applicationResultIcon = "";
    $scope.displayResults = "display: none;"; 

    $scope.fireRules = function(){
        console.log("fireRules! ");  
        $http.post('http://localhost:8080/kie-server/services/rest/server/containers/instances/loan-application_1.0', '{ \"lookup\": \"default-stateless-ksession\", \"commands\": [ { \"insert\": { \"object\": { \"com.redhat.demo.qlb.loan_application.model.Applicant\": { \"creditScore\":'+$scope.applicant.creditScore+', \"name\":\"'+$scope.applicant.name+'\", \"age\":'+$scope.applicant.age+', \"yearlyIncome\":'+$scope.applicant.yearlyIncome+' } }, \"out-identifier\":\"applicant\" } }, { \"insert\": { \"object\": { \"com.redhat.demo.qlb.loan_application.model.Loan\": { \"amount\":'+$scope.loan.amount+', \"duration\":'+$scope.loan.duration+' } }, \"out-identifier\":\"loan\" } }, { \"start-process\" : { \"processId\" : \"loan-application.loan-application-decision-flow\", \"parameter\" : [ ], \"out-identifier\" : null } } ]}' ,{
        headers: {'Authorization': 'Basic ' + btoa('dsUser:dsUser1!') }
        }).
            then(function(response) {
                
                $scope.greeting = response.data;
                // $scope.info = $scope.greeting.result["kie-server-info"];
               // console.log($scope.greeting);
                var approved =  $scope.greeting.result["execution-results"].results[0].value["com.redhat.demo.qlb.loan_application.model.Loan"].approved;
                if (approved) {
                    // approved 
                    console.log("approved");
                    // change label to approved
                    $scope.displayResults = ""; 
                    $scope.applicationResult = "Approved";
                    $scope.applicationResultIcon = "pficon pficon-ok";
                    // add comment to message 
                    var comment =  $scope.greeting.result["execution-results"].results[0].value["com.redhat.demo.qlb.loan_application.model.Loan"].comment;
                    // add interestRate to message 
                    var interestRate =  $scope.greeting.result["execution-results"].results[0].value["com.redhat.demo.qlb.loan_application.model.Loan"].interestRate;
                    // add monthlyRepayment to message 
                    var monthlyRepayment =  $scope.greeting.result["execution-results"].results[0].value["com.redhat.demo.qlb.loan_application.model.Loan"].monthlyRepayment;
                    $scope.applicationResultMessages = [comment,"Interest Rate : "+interestRate, "Monthly Repayment : "+monthlyRepayment];
                    console.log($scope.applicationResultMessages);
                } else {
                    console.log("rejected");
                    // rejected 
                    // change label to rejected
                    $scope.displayResults = "";
                    $scope.applicationResult = "Rejected";
                    $scope.applicationResultIcon = "pficon pficon-error-circle-o";
                    // add comment to message 
                    var comment =  $scope.greeting.result["execution-results"].results[0].value["com.redhat.demo.qlb.loan_application.model.Loan"].comment;
                    $scope.applicationResultMessages = [comment];
                    console.log($scope.applicationResultMessages);
                }
            });
        
    }


});