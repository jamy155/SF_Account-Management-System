import { LightningElement } from 'lwc';

export default class SearchBar extends LightningElement {

    searchText;

    //saves the user text to searchText
    handleChange(event) {
        this.searchText = event.target.value;
    }

    //send the searchText to the accountList Component 
    handleClick(event) {
        const searchEvent = new CustomEvent('getsearchevent',{detail:this.searchText});
        this.dispatchEvent(searchEvent);
    }    

}