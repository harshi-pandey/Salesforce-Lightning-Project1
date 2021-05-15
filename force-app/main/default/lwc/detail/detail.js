import { LightningElement, api, wire , track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getitems from '@salesforce/apex/itemsController.getitems';
import getContactList from '@salesforce/apex/itemsController.getContactList';
import insertProduct from '@salesforce/apex/itemsController.insertProduct';
import getstock from '@salesforce/apex/itemsController.getstock';

export default class Detail extends LightningElement {

    @track isModalOpen = false;
    @track accList;
    @track SProdList;
    @track _itemdataId;
    @track items;
    @track products;
    @track pq;
    errordata;
    @track dateValue;
    @track timeValue;
    account;
    contact;
    nItems;
    @track Wstock;
    @track xx;
    @track selectList = {	
        Account__c : "", 	
        Contact__c : "", 	
        No_of_Items__c : "", 
        In_Stock__c : "",
        Warehouse__c : "",
        Items__c : ""
    };
   
    set setproducts(value) {
        
        getitems({_itemdataId : value})
        .then(data => {
            this.pq = data;           
            this.items = this.pq.find(item =>(item.id__c === value))
            
        })
        .catch(error =>{
            this.error = error;
        }); 
    }

    @api get setproducts(){
        return this._itemdataId;
    }
 
    sellprod() {  
        if(!this.Wstock)
        getstock().then(data => {   
            console.log("DATABASE")
            if(this.items)
            this.Wstock = data.find(item1 =>(item1.Name === this.items.Warehouse__r.Name))
         })
        this.isModalOpen = true;

    }

    closeModal() {
        this.isModalOpen = false;
    }

    accountHandler(event){
        this.selectList.Account__c = event.target.value;
    }

    contactHandler(event)
    {
        this.selectList.Contact__c = event.target.value;
    }

    nitems(event){
        this.selectList.No_of_Items__c = event.target.value;
    }

    submitDetails() {
        if(this.items.Warehouse__r.In_Stock__c>=this.selectList.No_of_Items__c && this.items.Warehouse__r.In_Stock__c!=0)
            {
                this.selectList.Items__c = this.items.Name;
                console.log(this.selectList)
                insertProduct({ prod: this.selectList})
                .then(() => {     
                    console.log(this.selectList.In_Stock__c);
                    
                    this.Wstock.In_Stock__c-=this.selectList.No_of_Items__c;

                    // Show success messsage

                        this.dispatchEvent(new ShowToastEvent({
                        title: 'Success!!',
                        message: 'Product Inserted Successfully!!',
                        variant: 'success'
                        }), );
                    })
                .catch(error => {
                    this.error = error.message;
            });
                this.isModalOpen = false;
            }
            else
            
            if(this.items.Warehouse__r.In_Stock__c<this.selectList.No_of_Items__c &&  this.items.Warehouse__r.In_Stock__c!=0){
            alert('No. of Items selected is more than in Stock');
            this.isModalOpen = false;
            }
            else
            
            {
            alert('Out of Stock');
            this.isModalOpen = false;
            }
    }

    get dateToday()
    {
        var newDate = new Date();
        this.dateValue = newDate.toLocaleDateString();
        return this.dateValue;
    }

    get timeToday()
    {
        var newDate = new Date();
        this.timeValue = newDate.toLocaleTimeString();
        return this.timeValue;
    }

    get WInstock()
    {       
        if(this.Wstock) 
        return this.Wstock.In_Stock__c;
        return null;
    }

  

    @wire(getContactList,)
    wiredContacts({error, data}) {
        if (data) {
            this.accList = data;
        } else if (error) {
            this.error = error;
        }
    }

}