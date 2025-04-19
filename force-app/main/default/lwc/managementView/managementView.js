import { LightningElement } from 'lwc';

export default class ManagementView extends LightningElement {

    searchAccName;
    
    // sets the searchAccName to the searchText it got from the getsearchevent Event in the SearchBar component
    handleEvent(event){
        this.searchAccName = event.detail;
    }
}