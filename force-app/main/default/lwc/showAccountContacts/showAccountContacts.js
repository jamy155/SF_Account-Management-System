import { MessageContext, subscribe ,unsubscribe } from 'lightning/messageService';
import { LightningElement , wire } from 'lwc';
import Comrevo from '@salesforce/messageChannel/Comrevo__c';
import getAccContacts from '@salesforce/apex/AccountClass.getAccContacts';
import MyModal from 'c/myModal';
import LightningConfirm from 'lightning/confirm';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ShowAccountContacts extends LightningElement {

    subscription = null;
    title = "Contacts";
    contacts;
    hasContacts;
    isAccountSelected = false;
    editableContactId;



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

    async getContacts() {
        this.contacts =  await getAccContacts({accId: this.accountId});
        this.hasContacts = this.contacts.length > 0? true:false;
        this.isAccountSelected = true; 
    }

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

    async handleDeleteContact(event) {
        this.editableContactId = event.target.dataset.contactId;
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

        showToast() {
        const event = new ShowToastEvent({
            title: 'Delete contact',
            message:
                'Contact is Deleted Successfully',
        });
        this.dispatchEvent(event);
    }

    



}