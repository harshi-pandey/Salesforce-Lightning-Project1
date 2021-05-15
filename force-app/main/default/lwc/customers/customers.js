import { LightningElement ,api, wire, track} from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';

import getContactList from '@salesforce/apex/itemsController.getContactList';
import getCustpList from '@salesforce/apex/itemsController.getCustpList';

import CONTACT from '@salesforce/schema/SoldProducts__c.Contact__c';
import ACCOUNT from '@salesforce/schema/SoldProducts__c.Account__c';
import NO_OF_ITEMS from '@salesforce/schema/SoldProducts__c.No_of_Items__c';
import DATE from '@salesforce/schema/SoldProducts__c.Date__c';
import TIME from '@salesforce/schema/SoldProducts__c.Time__c';

    // row actions
const actions = [
        { label: 'View', name: 'view'}, 
        { label: 'Edit', name: 'edit'}, 
        { label: 'Delete', name: 'delete'}
    ];

const columnsA = [{
        label: 'Customer Name',
        fieldName: 'Name',
        type: 'text',
        sortable: true,
    },
    {
        label: 'Account Name',
        fieldName: 'AccountName',
        type : 'text',
        sortable: true,
    },
    {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
        sortable: true,
    },
    {
        label: 'Email',
        fieldName: 'Email',
        type: 'Email',
        sortable: true, 
    },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
            menuAlignment: 'auto'
        }
    }
];

const columnsB = [{
    label: 'Customer Name',
    fieldName: 'Contact__c',
    type: 'text',
    sortable: true,
},
{
    label: 'Account',
    fieldName: 'Account__c',
    type : 'text',
    sortable: true,
},

{
    label: 'Item Names',
    fieldName: 'title',
    type: 'text',
    sortable: true,  
},
{
    label: 'No. of Items',
    fieldName: 'No_of_Items__c',
    type: 'number',
    sortable: true,
},

{
    label: 'Date Issued',
    fieldName: 'Date__c',
    type: 'Date',
    sortable: true,
},

{
    label: 'Time Issued',
    fieldName: 'Time__c',
    type: 'Time',
    sortable: true,  
},
{
    label: 'Status',
    fieldName: 'status',
    type: 'text',
    sortable: true, 
},
];
export default class customers extends LightningElement {

    @track columnsA = columnsA;
    @track columnsB = columnsB;
    @track error;
    @track accList;
    @track accListOpen=true;
    @track AccountName = [];
    @track record = [];
    @track productData;
    productID;
    viewtemplate = false;
    editTemplate = false;
    selectedRecords;
    @track isDialogVisible = false;
    @track pdata;
    ContactName;
    AccntName;
    recordId;
    itemTitle;
    status;
    accountData;

    selectedFields = [CONTACT, ACCOUNT, NO_OF_ITEMS, DATE, TIME];
    fields;
    parentId;
    
    @wire(getContactList,)
    wiredContacts({error, data}) {
        if (data) {
            let ContactData = data.map(row=>({...row,AccountName :  row.Account.Name}));
            this.accList = ContactData;
        } else if (error) {
            this.error = error;
        }
    }

    onrowclick(event)
    {
        const actionName = event.detail.action.name;  
        let row = event.detail.row;
   
        switch (actionName) {
            case 'view':
                this.viewCurrentRecord(row);
                break;
            case 'edit':
                this.editCurrentRecord(row);
                break;
             case 'delete':
                 this.deleteCons(row);
                 break;
        }
    }
        // view the current record details
    viewCurrentRecord(currentRow) {
        this.viewtemplate = true;
        this.accListOpen = false;
        this.record = currentRow;
        this.AccntName = this.record.Account.Name;
        this.ContactName = this.record.Name ;
        this.getProductList();
    }

    deleteCons(currentRow) {
        this.record = currentRow;
   deleteRecord (this.record.Id)
        .then(()=>
            {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Deleted Successfully!!',
                    variant: 'success'
                    }), );
     
                    getContactList().then(data=>{  
                        if (data) {
                            let ContactData = data.map(row=>({...row,AccountName :  row.Account.Name}));
                            this.accList = ContactData;
                        }
                    })
                    .catch(error =>{
                        this.error = error;
                    }); 
            }
        )
        .catch(error =>{
            this.error = error;
        }); 
    }

    editCurrentRecord(currentRow){
        this.record = currentRow;
    }
    handleback()
    {
        this.viewtemplate = false;
        this.accListOpen = true;
    }

    backviewtemplate()
    {
        this.editTemplate = false;
        this.viewtemplate = true;
    }

    handleDelete(event)
    {      
        if(event.target.name === 'Delete'){
            this.isDialogVisible = true;
        }

        else if(event.target.name === 'confirmModal'){

            if(event.detail !== 1){
                if(event.detail.status === 'confirm') {

                    this.selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();  
                    this.selectedRecords.forEach((record)=>{
                     deleteRecord (record.Id)
                     .then(()=>
                         {                          
                          this.getProductList();

                             // Show success messsage

                        this.dispatchEvent(new ShowToastEvent({
                            title: 'Success!!',
                            message: 'Product Deleted Successfully!!',
                            variant: 'success'
                            }), );
                         })
                     .catch(error =>{
                          this.error = error;
                         }); 
                         })   
                }
                else if(event.detail.status === 'cancel'){
                     console.log('cancel')
                }
                this.isDialogVisible = false; 
            }
        }                      
}

handleEdit()
{
    this.selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();  
    this.selectedRecords.forEach((record)=>{
        this.recordId = record.Id;
        this.itemTitle = '[Edit] '+record.SalesStock_Item__r.title__c;
        this.status = 'Status : ' + record.Warehouse__r.Status__c;
    this.viewtemplate = false;
    this.editTemplate = true;w
})
}

handleSubmit(event)
{
     // stop the form from submitting
    event.preventDefault();      

    const fields = event.detail.fields;
    console.log(JSON.stringify(fields))
    this.template.querySelector('lightning-record-form').submit(fields);   
}

 getProductList(){
    getCustpList ({customer :  this.ContactName , account :   this.AccntName}) 
    .then(data => {
        let ProdData = data.map(row=>{
            this.productID = row.Id;
            if(row.SalesStock_Item__r && row.Warehouse__r) return {...row, 
            title  : row.SalesStock_Item__r.title__c, 
            status : row.Warehouse__r.Status__c
           }
           else return row;
        }
           );
            
        this.productData = ProdData;                  
     })
    .catch(error =>{
        this.error = error;
    }); 
}
}
