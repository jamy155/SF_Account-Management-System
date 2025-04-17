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

    @AuraEnabled
    public static List<Contact> getAccContacts(String accId){
        try {
            return [SELECT Id,Name
                    FROM Contact
                    WHERE AccountId =: accId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Boolean hasCases(String contId){
        try {
            List<Case> accCases = [SELECT Id FROM Case WHERE ContactId =: contId];

            if(accCases.size() > 0){
                return true;
            }else {
                return false;
            }

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}