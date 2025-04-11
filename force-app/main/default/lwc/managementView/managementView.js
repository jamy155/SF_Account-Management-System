import { LightningElement } from 'lwc';

export default class ManagementView extends LightningElement {

    searchAccName;
    

    handleEvent(event){
        this.searchAccName = event.detail;
    }
}