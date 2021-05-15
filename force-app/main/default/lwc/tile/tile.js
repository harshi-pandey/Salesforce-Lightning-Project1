import { LightningElement, api} from 'lwc';

export default class tile extends LightningElement {
    @api item;
    
   tileClick() {
        const event = new CustomEvent('tileclick', {
            // detail contains only primitives
           
            detail: this.item.id__c
        });
        
        // Fire the event from c-tile
        this.dispatchEvent(event);
       
    }
	
}