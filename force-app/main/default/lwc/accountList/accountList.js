import { api, wire , LightningElement } from 'lwc';
import getAccounts  from '@salesforce/apex/AccountClass.getAccounts';

export default class AccountList extends LightningElement {

    @api searchText;

    columns = [
        { 
        label: 'ID',
        fieldName: 'Id'},
        {
        label: 'Name',
        fieldName: 'Name',
        },
        {
        label: 'Actions',
        fieldName: 'Actions',
        type: 'button',
        typeAttributes: {
            label: 'View Contacts',
            value: 'view_contacts',
        }
            
        }];

    accounts =[{
        Id: '1',
        Name: 'Account 1',}];

    currentId;
    currentName;

    handleRowAction(event){

        if(event.detail.action.value=='view_contacts'){ 
            this.currentId = event.detail.row.Id;
            this.currentName = event.detail.row.Name;}
    }

    @wire(getAccounts,{searchKey:'$searchText'}) accountRecords;

}