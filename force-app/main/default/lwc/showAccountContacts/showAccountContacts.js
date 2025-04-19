import { MessageContext, subscribe ,unsubscribe } from 'lightning/messageService';
import { LightningElement , wire } from 'lwc';
import Comrevo from '@salesforce/messageChannel/Comrevo__c';
import getAccContacts from '@salesforce/apex/AccountClass.getAccContacts';
import MyModal from 'c/myModal';
import LightningConfirm from 'lightning/confirm';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import hasCases from '@salesforce/apex/AccountClass.hasCases';

export default class ShowAccountContacts extends LightningElement {

    subscription = null;
    title = "Contacts";
    contacts;
    hasContacts;
    isAccountSelected = false;
    editableContactId;
    accHasCases = false;


    @wire (MessageContext) messageContext;

    accountId;
    accountName;

    connectedCallback() {
        this.handleSubscribe();
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    handleSubscribe() {
        if(!this.subscription) 
            {
                // gets the account Id and Name from accountList 
                this.subscription = subscribe(this.messageContext,Comrevo, 
                    (param)=>
                        {
                            this.accountId = param.accountId;
                            this.accountName = param.accountName;
                            this.title = param.accountName+"'s Contacts";
                            this.getContacts();
                        })
            
            }
    }

    handleUnsubscribe() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    //gets from the Account contacts from account Class
    async getContacts() {
        this.contacts =  await getAccContacts({accId: this.accountId});
        this.hasContacts = this.contacts.length > 0? true:false;
        this.isAccountSelected = true; 
    }

    // opens up a popup that adds a contact to account 
    async handleAddContact() {
        const result = await MyModal.open({
            modalHeader: "Add Contact",
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
            isAddContact: true,
            isEditContact: false,
            isDeleteContact: false,
            accountId: this.accountId
        }).then(result => {
                this.getContacts();
        });
    }

    // opens up a popup that edits the current contact
    async handleEditContact() {
        this.editableContactId = event.target.dataset.contactId;
        const result = await MyModal.open({
            modalHeader: "Edit Contact",
            size: 'large',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
            isAddContact: false,
            isEditContact: true,
            isDeleteContact: false,
            editableContactId: event.target.dataset.contactId
        }).then(result => {
                this.getContacts();
        });
    }

    // opens up a popup that deletes the current contact if it has no cases 
    async handleDeleteContact(event) {

        this.editableContactId = event.target.dataset.contactId;

        // checks to see if account has cases from Account Class 
        this.accHasCases = await hasCases({contId:  this.editableContactId});
        
        if(this.accHasCases ) {

            const result = await MyModal.open({
            modalHeader: "Your attempt to delete this contact could not be completed because it is associated with a case",
            size: 'large',
            content: 'Your attempt to delete this contact could not be completed because it is associated a case',
            isAddContact: false,
            isEditContact: false,
            isDeleteContact: true,
        }).then(result => {
                this.getContacts();
        });

        } else{

            const result = await LightningConfirm.open({
                message: 'Are you sure you want to delete this contact?',
                variant: 'headerless',
                label: 'this is the aria-label value',
            });

            if (result) {
                let deleteResult = await deleteRecord(this.editableContactId);
                this.getContacts();
                this.showToast();
            };
        }   
        
}

        //shows message when account is deleted
        showToast() {
        const event = new ShowToastEvent({
            title: 'Delete contact',
            message:
                'Contact is Deleted Successfully',
        });
        this.dispatchEvent(event);
    }

}