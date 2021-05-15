public with sharing class itemsController {

    @AuraEnabled(cacheable=true)
    public static List<SalesStock_Items__c> getitems() {
        return [Select 	Name, id__c,title__c,brand__c,description__c,material__c,imageUrl__c,	occasion__c,Price__c, Warehouse__r.In_Stock__c, Warehouse__r.Name 
                from SalesStock_Items__c];
    }

    @AuraEnabled
    public static List<Warehouse__c> getstock() { 
        System.debug('Con '); 
        return [SELECT Name, In_Stock__c, CreatedById FROM Warehouse__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList() {
        return [SELECT AccountId, Name, Phone, Email, Account.Name FROM Contact];
    }

    @AuraEnabled
    public static void insertProduct (SoldProducts__c prod){ 
        try{  
            insert prod; 
        }catch(Exception e){
            System.debug('--->'+e);
        }
         System.debug('Con '+prod); 
    }    

    @AuraEnabled
    public static void insertContact (Contact cntct){ 
        try
        {  
            insert cntct; 
        }
        catch(Exception e){
            System.debug('--->'+e);
        }
    } 
    
    @AuraEnabled(cacheable=true)
    public static List<SoldProducts__c> getSProdtList() {
        return [SELECT Name, SalesStock_Item__c, 	Warehouse__c, Time__c FROM SoldProducts__c];
    }

    @AuraEnabled
    public static List<SoldProducts__c> getCustpList(String customer, String account) {
        return [SELECT Id, Account__c, 	Contact__c, Date__c, Time__c ,	No_of_Items__c, SalesStock_Item__r.title__c, Warehouse__r.Status__c
        FROM SoldProducts__c
        WHERE Account__c = :account
        AND Contact__c = :customer];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountId(String acc) {
        return [SELECT Id, Name
        FROM Account
        WHERE Name = :acc
      ];
    }
}
