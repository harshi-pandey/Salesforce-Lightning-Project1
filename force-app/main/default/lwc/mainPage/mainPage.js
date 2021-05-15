import { LightningElement } from 'lwc';

export default class MainPage extends LightningElement {

    selecteditemId;

    handleItemselected(evt) {
        this.selecteditemId = evt.detail;
    }
}