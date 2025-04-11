public with sharing class AccountClass {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String searchKey){
        try {
            if(String.isEmpty(searchKey)){
            return [SELECT Id, Name
                    FROM Account];
            }else {
                return [SELECT Id, Name
                    FROM Account
                    WHERE Name LIKE :'%'+searchKey+'%'
                    ];
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}