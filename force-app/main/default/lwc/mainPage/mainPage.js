import { LightningElement } from 'lwc';

export default class MainPage extends LightningElement {

    selecteditemId;
    listtemplate = true;
    detailtemplate = false;

    handleItemselected(evt) {
        this.selecteditemId = evt.detail;
        this.listtemplate = false;
        this.detailtemplate = true;
    }
    handledetailselected(evt)
    { 
        this.listtemplate = true;
        this.detailtemplate = false;
    }
}