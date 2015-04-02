app.controller('BranchCtrl', function ($scope, $state, $rootScope, branches, branchFactory, pullFactory) {
  // var deleteBranches = [];
  $scope.branches = branches;

  
  // $scope.deleteBranches = function(){
  //   for (var i=0; i<branches.length; i++){
  //     if (!(value==='master')) deleteBranches.push(value);
  //   }
  //   return deleteBranches;
  // }

  


  $scope.switch = function (branchName) {
    console.log('switch', branchName);
  	branchFactory.switchBranch(branchName);
  	branchFactory.currentBranch = branchName;
  }

  $scope.newBranch = function(branchName) {
    console.log('initial', $scope.branchName);
    
    branchFactory.createNewBranch(branchName)
    .then(function (data) {
        branchFactory.currentBranch = branchName;
        console.log('bf', branchFactory.currentBranch, 'name', branchName)
        return branchFactory.switchBranch(branchName)
    }).then(function (data) {
        $state.go('work');

      })
  }

  $scope.deleteBranch = function(branchName) {
    console.log('deleteBranch', branchName);
    branchFactory.switchBranch('master').then(function(data){
      console.log('after switch');
      return branchFactory.deleteOldBranch(branchName)
    })
    .then(function(data){
      console.log('after delete');
      return branchFactory.getAllBranches().then(function(branches){
        $scope.branches = branches;
      })
    })
  }

});
