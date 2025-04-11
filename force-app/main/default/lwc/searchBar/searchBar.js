import { LightningElement } from 'lwc';

export default class SearchBar extends LightningElement {

    searchText;

    handleChange(event) {
        this.searchText = event.target.value;
    }

    handleClick(event) {
        const searchEvent = new CustomEvent('getsearchevent',{detail:this.searchText});
        this.dispatchEvent(searchEvent);
    }    

}