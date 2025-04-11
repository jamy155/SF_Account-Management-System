public with sharing class AccountClass {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        try {
            return [SELECT Id, Name
                    FROM Account
                    ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}