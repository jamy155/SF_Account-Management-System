import { api, wire , LightningElement } from 'lwc';
import getAccounts  from '@salesforce/apex/AccountClass.getAccounts';
import { MessageContext, publish } from 'lightning/messageService';
import Comrevo from '@salesforce/messageChannel/Comrevo__c';

export default class AccountList extends LightningElement {

    @api searchText;

    @wire(MessageContext) messageContext;

    // establishes columns
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

    
    currentId;
    currentName;


    handleRowAction(event){

        // sets the current ID and Name to the account view contacts button that was pressed 
        if(event.detail.action.value=='view_contacts'){ 
            this.currentId = event.detail.row.Id;
            this.currentName = event.detail.row.Name;}

            // save account Id and Name to variable 
            const payload = {
                accountId: event.detail.row.Id,
                accountName: event.detail.row.Name
            };

            // send payload to message channel to go the showAccountContacts component
            publish(this.messageContext, Comrevo ,payload);
    }

    //gets the Account that relate to the searched text
    @wire(getAccounts,{searchKey:'$searchText'}) accountRecords;

}