import { LightningElement, wire } from 'lwc';
import getitems from '@salesforce/apex/itemsController.getitems';

export default class List extends LightningElement {
    itemdata;
    errordata;

    @wire(getitems)
    dataRecord({data,error}){
        if(data)
        {
            this.itemdata = data;
        }
        else if(error)
        {
            this.errordata = error;
        }
    }
    handleTileClick(evt) {
        // This component wants to emit a itemselected event to its parent
        const event = new CustomEvent('itemselected', {
            detail: evt.detail
        });
        
        // Fire the event from c-list
        this.dispatchEvent(event);
    }
}